import "@fontsource-variable/manrope";

class NodusTitle extends HTMLElement {
  private cleanup?: () => void;
  private controller?: AbortController;

  connectedCallback() {
    this.controller = new AbortController();
    const signal = this.controller.signal;
    import("./nodus-title-scene")
      .then(({ createTitleScene }) => {
        if (!signal.aborted) this.cleanup = createTitleScene(this, signal);
      })
      .catch(() => {
        // The semantic title and sculpted CSS lettering remain available without WebGL.
        this.dataset.renderer = "fallback";
      });
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.cleanup?.();
    this.cleanup = undefined;
  }
}

class NodusGallery extends HTMLElement {
  private controller?: AbortController;
  private resize?: ResizeObserver;
  private observer?: IntersectionObserver;
  private active = 0;
  private preview?: HTMLAnchorElement;
  private manualPreview = false;

  connectedCallback() {
    const controller = new AbortController();
    this.controller = controller;
    const { signal } = controller;
    const slots = Array.from(
      this.querySelectorAll<HTMLElement>("[data-card-slot]")
    );
    const cards = Array.from(
      this.querySelectorAll<HTMLAnchorElement>("[data-card]")
    );
    const dots = Array.from(
      this.querySelectorAll<HTMLButtonElement>("[data-select-card]")
    );
    const home = this.closest<HTMLElement>("[data-nodus-home]")!;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const motionButton = home.querySelector<HTMLButtonElement>(
      "[data-motion-toggle]"
    )!;
    let paused = reducedMotion.matches;
    this.active = 0;

    const setMotion = (value: boolean) => {
      paused = value || reducedMotion.matches;
      motionButton.disabled = reducedMotion.matches;
      home.dataset.motion = paused ? "paused" : "running";
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute(
        "aria-label",
        paused ? "배경 움직임 재개" : "배경 움직임 일시 정지"
      );
      motionButton.querySelector("span")!.textContent = paused
        ? "Motion off"
        : "Motion on";
      window.dispatchEvent(
        new CustomEvent("nodus:motion", { detail: { paused } })
      );
    };
    setMotion(paused);
    motionButton.addEventListener("click", () => setMotion(!paused), {
      signal,
    });
    reducedMotion.addEventListener(
      "change",
      () => {
        setMotion(reducedMotion.matches);
        this.stopPreview();
      },
      { signal }
    );

    const layout = () => {
      const width = this.clientWidth;
      const step =
        width < 640
          ? Math.min(width * 0.82, 350)
          : width < 1000
            ? 332
            : Math.min(width * 0.29, 405);
      slots.forEach((slot, index) => {
        let distance = index - this.active;
        if (distance > cards.length / 2) distance -= cards.length;
        if (distance < -cards.length / 2) distance += cards.length;
        const magnitude = Math.abs(distance);
        slot.style.setProperty("--card-x", `${distance * step}px`);
        slot.style.setProperty("--card-y", `${magnitude * 14}px`);
        slot.style.setProperty(
          "--card-z",
          `${-magnitude * (width < 640 ? 110 : 140)}px`
        );
        slot.style.setProperty(
          "--card-yaw",
          `${-distance * (width < 640 ? 13 : 12)}deg`
        );
        slot.style.setProperty(
          "--card-opacity",
          String(
            magnitude > 2
              ? 0
              : magnitude === 2
                ? 0.46
                : magnitude === 1
                  ? 0.82
                  : 1
          )
        );
        slot.style.setProperty("--card-stack", String(10 - magnitude));
        slot.toggleAttribute("data-outside", magnitude > 1);
        slot.inert = magnitude > 1;
        slot.setAttribute("role", "group");
        slot.setAttribute("aria-roledescription", "슬라이드");
        slot.setAttribute("aria-label", `${index + 1} / ${cards.length}`);
        slot.toggleAttribute("data-current", distance === 0);
        dots[index].setAttribute("aria-pressed", String(distance === 0));
      });
      this.querySelector("[data-current-number]")!.textContent = String(
        this.active + 1
      ).padStart(2, "0");
      this.querySelector("[data-gallery-announcement]")!.textContent =
        `${this.active + 1} / ${cards.length}: ${cards[this.active].getAttribute("aria-label")}`;
      this.setAttribute("data-enhanced", "");
    };
    const select = (index: number) => {
      this.stopPreview();
      this.active = (index + cards.length) % cards.length;
      layout();
    };
    this.querySelector("[data-previous]")!.addEventListener(
      "click",
      () => select(this.active - 1),
      { signal }
    );
    this.querySelector("[data-next]")!.addEventListener(
      "click",
      () => select(this.active + 1),
      { signal }
    );
    dots.forEach((dot, index) =>
      dot.addEventListener("click", () => select(index), { signal })
    );
    this.addEventListener(
      "keydown",
      event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(this.active + (event.key === "ArrowRight" ? 1 : -1));
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          select(event.key === "Home" ? 0 : cards.length - 1);
        }
      },
      { signal }
    );

    cards.forEach((card, index) => {
      card.addEventListener(
        "pointerenter",
        event => {
          if (
            event.pointerType === "mouse" &&
            finePointer.matches &&
            this.clientWidth > 640 &&
            !reducedMotion.matches
          )
            this.startPreview(card);
        },
        { signal }
      );
      card.addEventListener(
        "pointerleave",
        () => {
          if (this.preview === card && !this.manualPreview) this.stopPreview();
        },
        { signal }
      );
      card.addEventListener(
        "focus",
        () => {
          if (this.active !== index) select(index);
        },
        { signal }
      );
      const previewButton = card
        .closest("[data-card-slot]")!
        .querySelector<HTMLButtonElement>("[data-touch-preview]");
      previewButton?.addEventListener(
        "click",
        () => {
          if (this.preview === card) this.stopPreview();
          else this.startPreview(card, true);
        },
        { signal }
      );
    });

    let startX = 0;
    let startY = 0;
    let pointer: number | undefined;
    let dragging = false;
    let suppressClickUntil = 0;
    const stage = this.querySelector<HTMLElement>(".gallery-stage")!;
    this.addEventListener(
      "pointerdown",
      event => {
        if (event.button !== 0 || (event.target as Element).closest("button"))
          return;
        startX = event.clientX;
        startY = event.clientY;
        pointer = event.pointerId;
        dragging = false;
      },
      { signal }
    );
    this.addEventListener(
      "pointermove",
      event => {
        if (event.pointerId !== pointer) return;
        const dx = event.clientX - startX;
        if (
          !dragging &&
          Math.abs(dx) > 12 &&
          Math.abs(dx) > Math.abs(event.clientY - startY)
        ) {
          dragging = true;
          this.setPointerCapture(event.pointerId);
          this.stopPreview();
        }
        if (dragging) {
          event.preventDefault();
          stage.style.transform = `translateX(${Math.max(-50, Math.min(50, dx * 0.2))}px)`;
        }
      },
      { signal }
    );
    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      const dx = event.clientX - startX;
      if (dragging) {
        suppressClickUntil = performance.now() + 400;
        if (event.type !== "pointercancel" && Math.abs(dx) > 40)
          select(this.active + (dx < 0 ? 1 : -1));
      }
      if (this.hasPointerCapture(event.pointerId))
        this.releasePointerCapture(event.pointerId);
      stage.style.transform = "";
      pointer = undefined;
      dragging = false;
    };
    this.addEventListener("pointerup", endDrag, { signal });
    this.addEventListener("pointercancel", endDrag, { signal });
    this.addEventListener(
      "click",
      event => {
        if (performance.now() < suppressClickUntil) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { signal, capture: true }
    );
    this.addEventListener("dragstart", event => event.preventDefault(), {
      signal,
    });
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) this.stopPreview();
      },
      { signal }
    );
    this.observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) this.stopPreview();
    });
    this.observer.observe(this);
    this.resize = new ResizeObserver(layout);
    this.resize.observe(this);
    layout();
    sessionStorage.setItem("backUrl", "/");
  }

  private async startPreview(card: HTMLAnchorElement, manual = false) {
    if (this.preview === card) return;
    this.stopPreview();
    this.preview = card;
    this.manualPreview = manual;
    const button = card
      .closest("[data-card-slot]")
      ?.querySelector("[data-touch-preview]");
    button?.setAttribute("aria-pressed", "true");
    const video = card.querySelector<HTMLVideoElement>("video");
    if (video) {
      const source = video.querySelector("source")!;
      if (!source.src) {
        source.src = source.dataset.src!;
        video.load();
      }
      video.muted = true;
      try {
        await video.play();
        if (this.preview !== card) {
          video.pause();
          return;
        }
        card.setAttribute("data-playing", "");
      } catch {
        if (this.preview === card) this.stopPreview();
      }
    } else if (card.dataset.youtube) {
      const iframe = document.createElement("iframe");
      iframe.title = "프로젝트 영상 미리보기";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.allow = "autoplay; encrypted-media";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(card.dataset.youtube)}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${encodeURIComponent(card.dataset.youtube)}&rel=0`;
      iframe.addEventListener(
        "load",
        () => {
          if (this.preview !== card) return;
          card.setAttribute("data-playing", "");
          card.querySelector("[data-preview-label]")!.textContent = "Playing";
        },
        { once: true }
      );
      card.querySelector(".card-media")!.append(iframe);
    }
    if (card.hasAttribute("data-playing"))
      card.querySelector("[data-preview-label]")!.textContent = "Playing";
  }

  private stopPreview() {
    const card = this.preview;
    this.preview = undefined;
    this.manualPreview = false;
    if (!card) return;
    card.removeAttribute("data-playing");
    card.querySelector("[data-preview-label]")!.textContent = "Preview";
    const video = card.querySelector("video");
    if (video) {
      video.pause();
      if (video.readyState) video.currentTime = 0;
    }
    card.querySelector("iframe")?.remove();
    card
      .closest("[data-card-slot]")
      ?.querySelector("[data-touch-preview]")
      ?.setAttribute("aria-pressed", "false");
  }

  disconnectedCallback() {
    this.stopPreview();
    this.controller?.abort();
    this.resize?.disconnect();
    this.observer?.disconnect();
  }
}

if (!customElements.get("nodus-title"))
  customElements.define("nodus-title", NodusTitle);
if (!customElements.get("nodus-gallery"))
  customElements.define("nodus-gallery", NodusGallery);
