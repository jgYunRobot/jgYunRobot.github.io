import "@fontsource-variable/manrope";
import { createExperienceNavigation } from "./nodus-experience";

class NodusTitle extends HTMLElement {
  private cleanup?: () => void;
  private controller?: AbortController;

  connectedCallback() {
    delete this.dataset.ready;
    delete this.dataset.renderer;
    this.controller = new AbortController();
    const signal = this.controller.signal;
    import("./nodus-title-scene")
      .then(({ createTitleScene }) => {
        if (!signal.aborted) this.cleanup = createTitleScene(this, signal);
      })
      .catch(() => {
        // The inline poster and semantic heading remain visible without WebGL.
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
  private dateAnimations: Animation[] = [];
  private dragFrame = 0;

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
    // Paint solid surfaces once: Samsung force-dark rewrites CSS fills but retains canvas sRGB.
    home
      .querySelectorAll<HTMLCanvasElement>("[data-surface-color]")
      .forEach(canvas => {
        const context = canvas.getContext("2d", {
          alpha: false,
          colorSpace: "srgb",
        })!;
        context.fillStyle = canvas.dataset.surfaceColor!;
        context.fillRect(0, 0, 1, 1);
      });
    cards.forEach(card => {
      const image = card.querySelector<HTMLImageElement>(".card-media > img")!;
      const canvas = card.querySelector<HTMLCanvasElement>(
        "[data-thumbnail-canvas]"
      )!;
      const paintThumbnail = () => {
        canvas.width = Math.min(image.naturalWidth, 768);
        canvas.height = Math.round(
          (canvas.width * image.naturalHeight) / image.naturalWidth
        );
        canvas
          .getContext("2d", { colorSpace: "srgb" })!
          .drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.parentElement!.dataset.thumbnailReady = "";
      };
      if (image.complete && image.naturalWidth) paintThumbnail();
      else
        image.addEventListener("load", paintThumbnail, { once: true, signal });
    });
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const motionButton = home.querySelector<HTMLButtonElement>(
      "[data-motion-toggle]"
    )!;
    let paused = reducedMotion.matches;
    this.active = cards.length - 1;

    const setMotion = (value: boolean) => {
      paused = value || reducedMotion.matches;
      if (paused) this.dateAnimations.forEach(animation => animation.cancel());
      motionButton.disabled = reducedMotion.matches;
      home.dataset.motion = paused ? "paused" : "running";
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute(
        "aria-label",
        paused ? "Resume background motion" : "Pause background motion"
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

    let previousWidth = -1;
    let previousActive = -1;
    const layout = () => {
      const width = this.clientWidth;
      if (width === previousWidth && this.active === previousActive) return;
      const initialLayout = previousActive === -1;
      const selectionChanged = this.active !== previousActive;
      previousWidth = width;
      previousActive = this.active;
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
        slot.setAttribute("aria-roledescription", "slide");
        slot.setAttribute("aria-label", `${index + 1} / ${cards.length}`);
        slot.toggleAttribute("data-current", distance === 0);
        dots[index].setAttribute("aria-pressed", String(distance === 0));
      });
      this.querySelector("[data-current-number]")!.textContent = String(
        this.active + 1
      ).padStart(2, "0");
      if (selectionChanged) {
        this.updateTimelineDate(cards[this.active], !paused && !initialLayout);
        this.querySelector("[data-gallery-announcement]")!.textContent =
          `${this.active + 1} of ${cards.length}: ${cards[this.active].getAttribute("aria-label")}. ${cards[this.active].dataset.timelineLabel}.`;
      }
      this.setAttribute("data-enhanced", "");
    };
    let experience_controller:
      ReturnType<typeof createExperienceNavigation> | undefined;
    const select = (index: number) => {
      if (experience_controller?.isActive()) {
        experience_controller.close(() => select(index));
        return;
      }
      const next = (index + cards.length) % cards.length;
      if (next === this.active) return;
      this.stopPreview();
      this.active = next;
      layout();
    };
    experience_controller = createExperienceNavigation(this, {
      signal,
      getCurrentIndex: () => this.active,
      selectProject: select,
      stopPreview: () => this.stopPreview(),
    });
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
          if (experience_controller?.isActive()) return;
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

    const wheelArea = this.querySelector<HTMLElement>(".gallery-window")!;
    let wheelTravel = 0;
    let lastWheelTime = 0;
    let lastWheelStep = -Infinity;
    wheelArea.addEventListener(
      "wheel",
      event => {
        if (event.ctrlKey || event.altKey || event.metaKey) return;
        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
        if (!delta) return;
        const now = performance.now();
        event.preventDefault();
        if (
          now - lastWheelTime > 160 ||
          Math.sign(delta) !== Math.sign(wheelTravel)
        )
          wheelTravel = 0;
        lastWheelTime = now;
        if (now - lastWheelStep < 450) return;
        const scale =
          event.deltaMode === 1
            ? 16
            : event.deltaMode === 2
              ? wheelArea.clientHeight
              : 1;
        wheelTravel += delta * scale;
        if (Math.abs(wheelTravel) >= 50) {
          select(this.active + (wheelTravel > 0 ? 1 : -1));
          lastWheelStep = now;
          wheelTravel = 0;
        }
      },
      { signal, passive: false }
    );

    let startX = 0;
    let startY = 0;
    let pointer: number | undefined;
    let dragging = false;
    let suppressClickUntil = 0;
    let dragOffset = 0;
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
          dragOffset = Math.max(-50, Math.min(50, dx * 0.2));
          if (!this.dragFrame)
            this.dragFrame = requestAnimationFrame(() => {
              stage.style.transform = `translateX(${dragOffset}px)`;
              this.dragFrame = 0;
            });
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
      cancelAnimationFrame(this.dragFrame);
      this.dragFrame = 0;
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
    let inView = true;
    const syncActivity = () => {
      const suspended = document.hidden || !inView;
      this.toggleAttribute("data-suspended", suspended);
      if (suspended) {
        this.stopPreview();
        this.dateAnimations.forEach(animation => animation.cancel());
      }
    };
    document.addEventListener("visibilitychange", syncActivity, { signal });
    this.observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncActivity();
    });
    this.observer.observe(this);
    this.resize = new ResizeObserver(layout);
    this.resize.observe(this);
    layout();
    sessionStorage.setItem("backUrl", "/");
  }

  private updateTimelineDate(card: HTMLAnchorElement, animate: boolean) {
    const date = this.querySelector<HTMLTimeElement>("[data-current-date]")!;
    const value = card.dataset.timelineDate!;
    date.dateTime = card.dataset.timelineAt!;
    this.querySelector("[data-current-date-label]")!.textContent =
      card.dataset.timelineLabel!;
    if (date.dataset.value === value) return;
    date.dataset.value = value;
    const strips = Array.from(
      this.querySelectorAll<HTMLElement>("[data-date-digit]")
    );
    // Rebase repeating reels to their visible position before interrupting a roll.
    // Read all transforms first so rapid wheel input does not alternate layout reads and writes.
    const positions = animate
      ? strips.map(strip => {
          const style = getComputedStyle(strip);
          const offset =
            -new DOMMatrixReadOnly(style.transform).m42 /
            parseFloat(style.fontSize);
          return offset % 10;
        })
      : [];
    this.dateAnimations.forEach(animation => animation.cancel());
    this.dateAnimations = [];
    const digits = value.replaceAll(".", "");
    strips.forEach((strip, index) => {
      const previous = positions[index];
      const next = Number(digits[index]);
      strip.dataset.dateDigit = String(next);
      strip.style.transform = `translateY(-${next}em)`;
      if (!animate) return;
      const animation = strip.animate(
        [
          { transform: `translateY(-${previous}em)` },
          { transform: `translateY(-${20 + next}em)` },
        ],
        {
          duration: 620 + index * 35,
          easing: "cubic-bezier(0.18, 0.7, 0.2, 1)",
          fill: "forwards",
        }
      );
      animation.onfinish = () => animation.cancel();
      this.dateAnimations.push(animation);
    });
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
      iframe.title = "Project video preview";
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
    cancelAnimationFrame(this.dragFrame);
    this.dateAnimations.forEach(animation => animation.cancel());
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
