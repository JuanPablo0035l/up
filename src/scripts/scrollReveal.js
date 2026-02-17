/**
 * ── MODULE: Scroll Reveal ──
 * @description Animates step cards, FAQ, and footer elements
 *   into view on scroll using GSAP ScrollTrigger.
 * @requires gsap, gsap/ScrollTrigger
 * @see ../components/HowItWorks.astro
 * @see ../components/FAQ.astro
 * @see ../components/Footer.astro
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setupScrollReveal() {
    // Reveal Step Cards (How It Works)
    gsap.from(".step-card", {
        scrollTrigger: {
            trigger: ".how-it-works",
            start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Reveal FAQ Container
    gsap.from(".faq-container", {
        scrollTrigger: {
            trigger: ".faq-section",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // Subtly reveal Footer
    gsap.from(".footer-grid > div", {
        scrollTrigger: {
            trigger: ".main-footer",
            start: "top 90%",
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power1.out"
    });
}
