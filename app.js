gsap.registerPlugin(ScrollTrigger);
document.body.classList.add("has-motion");

gsap.defaults({
  duration: 0.75,
  ease: "power2.out"
});

const mm = gsap.matchMedia();

gsap.from(".brand", {
  y: 24,
  autoAlpha: 0,
  duration: 0.9
});

gsap.from(".menu-item", {
  x: -18,
  autoAlpha: 0,
  stagger: 0.06,
  delay: 0.12
});

gsap.from(".masthead-copy > *", {
  y: 24,
  autoAlpha: 0,
  stagger: 0.08,
  delay: 0.18
});

gsap.from(".masthead-actions .button", {
  y: 20,
  autoAlpha: 0,
  stagger: 0.08,
  delay: 0.26
});

mm.add("(prefers-reduced-motion: no-preference)", () => {
  ScrollTrigger.batch(".reveal-item", {
    start: "top 84%",
    onEnter: (batch) => gsap.to(batch, {
      y: 0,
      autoAlpha: 1,
      stagger: 0.08,
      overwrite: true
    }),
    onLeaveBack: (batch) => gsap.set(batch, {
      y: 24,
      autoAlpha: 0,
      overwrite: true
    })
  });

  gsap.from(".kpi-card", {
    y: 18,
    autoAlpha: 0,
    stagger: 0.08,
    delay: 0.34
  });

  gsap.from(".signal-card", {
    y: 18,
    autoAlpha: 0,
    stagger: 0.06,
    delay: 0.44
  });

  gsap.to(".pulse-card", {
    y: -4,
    repeat: -1,
    yoyo: true,
    duration: 1.8,
    ease: "sine.inOut"
  });
});
