/* eslint-disable */
// BJL Studios — vanilla animation utilities.
// Depends on: GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Lenis (window.Lenis).
// Honors prefers-reduced-motion: degrades to no-op when set.

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasST = typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  if (hasGSAP && hasST) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // ---- Smooth scroll (Lenis) ------------------------------------------------
  function initSmoothScroll() {
    if (reducedMotion || !hasLenis) return null;
    const lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasST) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
    return lenis;
  }

  // ---- Text reveal: split chars/words and stagger them in -------------------
  function textReveal(selector, opts) {
    if (!hasGSAP) return;
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    const o = Object.assign({ unit: "char", stagger: 0.03, duration: 0.9, y: 30 }, opts || {});

    els.forEach((el) => {
      if (el.dataset.split === "1") return;
      const text = el.textContent;
      const parts = o.unit === "word" ? text.split(/(\s+)/) : Array.from(text);
      el.textContent = "";
      parts.forEach((p) => {
        if (/^\s+$/.test(p)) {
          el.appendChild(document.createTextNode(p));
          return;
        }
        const span = document.createElement("span");
        span.className = "reveal-unit";
        span.style.display = "inline-block";
        span.style.willChange = "transform, opacity";
        span.textContent = p;
        el.appendChild(span);
      });
      el.dataset.split = "1";

      if (reducedMotion) return;

      const units = el.querySelectorAll(".reveal-unit");
      window.gsap.from(units, {
        y: o.y,
        opacity: 0,
        duration: o.duration,
        stagger: o.stagger,
        ease: "expo.out",
        scrollTrigger: hasST
          ? { trigger: el, start: "top 85%", once: true }
          : undefined,
      });
    });
  }

  // ---- Magnetic cursor effect on buttons ------------------------------------
  function magneticButtons(selector, strength) {
    if (reducedMotion) return;
    const els = document.querySelectorAll(selector);
    const s = strength || 0.35;
    els.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * s;
        const y = (e.clientY - r.top - r.height / 2) * s;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  // ---- Marquee: clone children once for seamless infinite loop --------------
  function marquee(selector, speed) {
    if (reducedMotion || !hasGSAP) return;
    const els = document.querySelectorAll(selector);
    const s = speed || 40; // px per second
    els.forEach((el) => {
      const inner = el.firstElementChild;
      if (!inner || inner.dataset.cloned === "1") return;
      const clone = inner.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      el.appendChild(clone);
      inner.dataset.cloned = "1";
      const w = inner.getBoundingClientRect().width;
      window.gsap.to(el.children, {
        x: -w,
        duration: w / s,
        ease: "none",
        repeat: -1,
      });
    });
  }

  // ---- Scroll-pin section (horizontal scroll inside vertical) ---------------
  function scrollPin(triggerSel, trackSel) {
    if (reducedMotion || !hasGSAP || !hasST) return;
    const trigger = document.querySelector(triggerSel);
    const track = document.querySelector(trackSel);
    if (!trigger || !track) return;
    const dist = track.scrollWidth - window.innerWidth;
    window.gsap.to(track, {
      x: -dist,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: () => "+=" + dist,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
  }

  // ---- Fade + slide in on scroll (generic) ----------------------------------
  function fadeIn(selector, opts) {
    if (!hasGSAP) return;
    const o = Object.assign({ y: 40, duration: 0.9, stagger: 0.08 }, opts || {});
    const els = document.querySelectorAll(selector);
    if (reducedMotion) {
      els.forEach((el) => (el.style.opacity = 1));
      return;
    }
    els.forEach((el) => {
      window.gsap.from(el, {
        y: o.y,
        opacity: 0,
        duration: o.duration,
        ease: "expo.out",
        scrollTrigger: hasST
          ? { trigger: el, start: "top 88%", once: true }
          : undefined,
      });
    });
  }

  // ---- Public API -----------------------------------------------------------
  window.BJL = window.BJL || {};
  window.BJL.anim = {
    initSmoothScroll,
    textReveal,
    magneticButtons,
    marquee,
    scrollPin,
    fadeIn,
    reducedMotion,
  };
})();
