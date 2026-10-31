type ExperienceOptions = {
  signal: AbortSignal;
  getCurrentIndex: () => number;
  selectProject: (index: number) => void;
  stopPreview: () => void;
};

export function createExperienceNavigation(
  gallery: HTMLElement,
  { signal, getCurrentIndex, selectProject, stopPreview }: ExperienceOptions
) {
  const home = gallery.closest<HTMLElement>("[data-nodus-home]")!;
  const hero = home.querySelector<HTMLElement>(".nodus-hero")!;
  const brand = home.querySelector<HTMLAnchorElement>(".nodus-brand")!;
  const project_brand = brand.querySelector<HTMLElement>(
    ".axis-brand-project"
  )!;
  const career_brand = brand.querySelector<HTMLElement>(".axis-career-brand")!;
  const original_brand_label = brand.getAttribute("aria-label")!;
  const original_page_title = document.title;
  const ancillary = home.querySelectorAll<HTMLElement>(
    ".gallery-heading,.collection-footer,.nodus-footer"
  );
  const stage = gallery.querySelector<HTMLElement>(".gallery-stage")!;
  const window_element = gallery.querySelector<HTMLElement>(".gallery-window")!;
  const panel = gallery.querySelector<HTMLElement>(".axis-experience")!;
  const document_element = panel.querySelector<HTMLElement>(".axis-document")!;
  const entry = gallery.querySelector<HTMLButtonElement>("[data-axis-open]")!;
  const close_buttons =
    panel.querySelectorAll<HTMLButtonElement>("[data-axis-close]");
  const progress = panel.querySelector<HTMLElement>("[data-axis-position]")!;
  const controls = gallery.querySelector<HTMLElement>(".gallery-controls")!;
  const project_layer = gallery.querySelector<HTMLElement>(
    ".axis-project-layer"
  )!;
  const slots = Array.from(
    gallery.querySelectorAll<HTMLElement>("[data-card-slot]")
  );
  const reduced_motion = matchMedia("(prefers-reduced-motion: reduce)");
  let mode: "projects" | "opening" | "career" | "closing" = "projects";
  let transition_timer = 0;
  let open_frame = 0;
  let resize_frame = 0;
  let wheel_travel = 0;
  let last_wheel_time = 0;
  let entry_cooldown_until = 0;
  let return_travel = 0;
  let last_document_wheel = 0;
  let return_gesture_armed = true;
  let horizontal_travel = 0;
  let last_horizontal_wheel = 0;
  let pending_project: (() => void) | undefined;
  let side_pointer: { id: number; x: number; y: number } | undefined;
  let touch_start: { x: number; y: number; at_top: boolean } | undefined;

  function syncGeometry() {
    const stage_rect = stage.getBoundingClientRect();
    const window_rect = window_element.getBoundingClientRect();
    const current_slot = slots[getCurrentIndex()];
    const card_height =
      current_slot.querySelector<HTMLElement>(".project-card")!.offsetHeight;
    const anchor_top = stage_rect.top - window_rect.top + stage_rect.height / 2;
    panel.style.setProperty("--axis-anchor-top", `${anchor_top}px`);
    panel.style.setProperty(
      "--axis-rise",
      `${Math.min(innerHeight * 0.12, 160)}px`
    );
    panel.style.setProperty("--axis-rest-height", `${card_height}px`);
    panel.style.setProperty(
      "--axis-expanded-height",
      `${Math.min(card_height + 620, innerHeight * 0.8, 1040)}px`
    );
    slots.forEach(slot => {
      for (const property_name of ["x", "y", "z", "yaw", "opacity"]) {
        slot.style.setProperty(
          `--axis-frozen-${property_name}`,
          slot.style.getPropertyValue(`--card-${property_name}`)
        );
      }
      slot.style.setProperty(
        "--axis-spread",
        `${Math.sign(parseFloat(slot.style.getPropertyValue("--card-x"))) * 80}px`
      );
      slot.toggleAttribute("data-axis-center", slot === current_slot);
    });
  }

  function setIdentity(career: boolean) {
    home.classList.toggle("axis-home-career", career);
    hero.inert = career;
    ancillary.forEach(element => {
      element.inert = career;
    });
    brand.setAttribute(
      "aria-label",
      career ? "Junggil Yun — Professional Experience" : original_brand_label
    );
    project_brand.setAttribute("aria-hidden", String(career));
    career_brand.setAttribute("aria-hidden", String(!career));
    if (home.isConnected)
      document.title = career
        ? "Professional Experience · Junggil Yun"
        : original_page_title;
  }

  function openExperience() {
    if (mode !== "projects") return;
    mode = "opening";
    gallery.dataset.axisMode = mode;
    syncGeometry();
    stopPreview();
    slots.forEach(slot => {
      slot.inert = true;
    });
    gallery.classList.add("axis-locked");
    setIdentity(true);
    panel.inert = false;
    panel.setAttribute("aria-hidden", "false");
    entry.setAttribute("aria-expanded", "true");
    return_gesture_armed = document_element.scrollTop <= 2;
    return_travel = 0;
    open_frame = requestAnimationFrame(() => {
      if (signal.aborted || mode === "projects" || mode === "closing") return;
      gallery.classList.add("is-career");
      document_element.focus({ preventScroll: true });
    });
    transition_timer = window.setTimeout(
      () => {
        mode = "career";
        gallery.dataset.axisMode = mode;
      },
      reduced_motion.matches ? 0 : 900
    );
  }

  function closeExperience(after?: () => void) {
    if (after) pending_project = after;
    if (mode === "projects") {
      pending_project?.();
      pending_project = undefined;
      return;
    }
    if (mode === "closing") return;
    clearTimeout(transition_timer);
    mode = "closing";
    gallery.dataset.axisMode = mode;
    gallery.classList.remove("is-career");
    setIdentity(false);
    panel.inert = true;
    panel.setAttribute("aria-hidden", "true");
    entry.setAttribute("aria-expanded", "false");
    transition_timer = window.setTimeout(
      () => {
        gallery.classList.remove("axis-locked");
        slots.forEach(slot => {
          slot.inert = slot.hasAttribute("data-outside");
        });
        mode = "projects";
        gallery.dataset.axisMode = mode;
        entry_cooldown_until = performance.now() + 450;
        wheel_travel = 0;
        const resume = pending_project;
        pending_project = undefined;
        if (resume) resume();
        else entry.focus({ preventScroll: true });
      },
      reduced_motion.matches ? 0 : 900
    );
  }

  function browseProjects(direction: number) {
    const index = getCurrentIndex() + direction;
    closeExperience(() => selectProject(index));
  }

  entry.addEventListener("click", openExperience, { signal });
  entry.addEventListener(
    "pointerleave",
    () => {
      wheel_travel = 0;
    },
    { signal }
  );
  close_buttons.forEach(button =>
    button.addEventListener("click", () => closeExperience(), { signal })
  );
  for (const event_name of [
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
  ]) {
    panel.addEventListener(event_name, event => event.stopPropagation(), {
      signal,
    });
    entry.addEventListener(event_name, event => event.stopPropagation(), {
      signal,
    });
  }
  home.addEventListener(
    "wheel",
    event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as Element;
      const now = performance.now();
      const wheel_scale =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
      if (mode !== "projects") {
        if (!gallery.contains(target)) return;
        event.stopImmediatePropagation();
        if (mode !== "career") {
          event.preventDefault();
          return;
        }
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();
          horizontal_travel =
            now - last_horizontal_wheel > 200
              ? event.deltaX * wheel_scale
              : horizontal_travel + event.deltaX * wheel_scale;
          last_horizontal_wheel = now;
          if (Math.abs(horizontal_travel) >= 50) {
            const direction = Math.sign(horizontal_travel);
            horizontal_travel = 0;
            browseProjects(direction);
          }
          return;
        }
        if (document_element.contains(target)) {
          if (document_element.scrollTop <= 2 && event.deltaY < 0) {
            event.preventDefault();
            if (now - last_document_wheel > 200) return_gesture_armed = true;
            if (return_gesture_armed)
              return_travel += -event.deltaY * wheel_scale;
            last_document_wheel = now;
            if (return_travel >= 70) closeExperience();
            return;
          }
          return_travel = 0;
          if (document_element.scrollTop > 2) return_gesture_armed = false;
          last_document_wheel = now;
          return;
        }
        const panel_rect = panel.getBoundingClientRect();
        const window_rect = window_element.getBoundingClientRect();
        const over_side =
          (event.clientX < panel_rect.left ||
            event.clientX > panel_rect.right) &&
          event.clientY >= window_rect.top + 44 &&
          event.clientY <= window_rect.bottom;
        if (over_side && Math.abs(event.deltaY * wheel_scale) >= 45) {
          event.preventDefault();
          browseProjects(Math.sign(event.deltaY));
        }
        return;
      }
      if (
        !entry.contains(target) ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      event.stopImmediatePropagation();
      if (event.deltaY <= 0) return;
      event.preventDefault();
      if (now < entry_cooldown_until) return;
      wheel_travel =
        now - last_wheel_time > 220
          ? event.deltaY * wheel_scale
          : wheel_travel + event.deltaY * wheel_scale;
      last_wheel_time = now;
      if (wheel_travel >= 45) {
        wheel_travel = 0;
        openExperience();
      }
    },
    { signal, capture: true, passive: false }
  );
  home.addEventListener(
    "pointerdown",
    event => {
      if (
        mode !== "projects" &&
        gallery.contains(event.target as Node) &&
        !panel.contains(event.target as Node) &&
        !entry.contains(event.target as Node) &&
        !controls.contains(event.target as Node)
      ) {
        side_pointer = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
        };
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { signal, capture: true }
  );
  home.addEventListener(
    "pointermove",
    event => {
      if (
        side_pointer &&
        side_pointer.id === event.pointerId &&
        mode === "career"
      ) {
        const dx = event.clientX - side_pointer.x;
        const dy = event.clientY - side_pointer.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          side_pointer = undefined;
          event.preventDefault();
          event.stopImmediatePropagation();
          browseProjects(dx < 0 ? 1 : -1);
        }
      }
    },
    { signal, capture: true }
  );
  for (const event_name of ["pointerup", "pointercancel"])
    home.addEventListener(
      event_name,
      () => {
        side_pointer = undefined;
      },
      { signal, capture: true }
    );
  home.addEventListener(
    "click",
    event => {
      if (mode === "projects") return;
      const target = event.target as Element;
      const navigation_link = target.closest("a");
      if (
        navigation_link &&
        (navigation_link.getAttribute("href") === "#project-gallery" ||
          navigation_link === brand)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeExperience();
      } else if (project_layer.contains(target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { signal, capture: true }
  );
  document.addEventListener(
    "keydown",
    event => {
      if (mode === "projects") return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeExperience();
        return;
      }
      if (!gallery.contains(event.target as Node)) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopImmediatePropagation();
        browseProjects(event.key === "ArrowRight" ? 1 : -1);
      } else if (
        !document_element.contains(event.target as Node) &&
        ["Home", "End", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(
          event.key
        )
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { signal, capture: true }
  );
  document_element.addEventListener(
    "keydown",
    event => {
      if (event.key === "ArrowUp" && document_element.scrollTop <= 2) {
        event.preventDefault();
        closeExperience();
      }
      if (
        ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(
          event.key
        )
      )
        event.stopPropagation();
    },
    { signal }
  );
  document_element.addEventListener(
    "touchstart",
    event => {
      touch_start = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        at_top: document_element.scrollTop <= 2,
      };
    },
    { signal, passive: true }
  );
  document_element.addEventListener(
    "touchmove",
    event => {
      if (mode !== "career" || !touch_start?.at_top) return;
      const dx = event.touches[0].clientX - touch_start.x;
      const dy = event.touches[0].clientY - touch_start.y;
      if (dy > 12 && dy > Math.abs(dx)) {
        event.preventDefault();
        if (dy > 90) {
          touch_start = undefined;
          closeExperience();
        }
      }
    },
    { signal, passive: false }
  );
  document_element.addEventListener(
    "scroll",
    () => {
      progress.textContent = `${Math.round((document_element.scrollTop / (document_element.scrollHeight - document_element.clientHeight)) * 100)}%`;
    },
    { signal, passive: true }
  );
  const resize_observer = new ResizeObserver(() => {
    if (mode !== "projects") {
      cancelAnimationFrame(resize_frame);
      resize_frame = requestAnimationFrame(syncGeometry);
    }
  });
  resize_observer.observe(window_element);
  signal.addEventListener(
    "abort",
    () => {
      clearTimeout(transition_timer);
      cancelAnimationFrame(open_frame);
      cancelAnimationFrame(resize_frame);
      resize_observer.disconnect();
      gallery.classList.remove("is-career", "axis-locked");
      setIdentity(false);
    },
    { once: true }
  );
  gallery.dataset.axisMode = mode;
  return { isActive: () => mode !== "projects", close: closeExperience };
}
