import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHighEndAnimations() {
    // 1. Hero Title Animation (Xiaomi Style)
    // We try to find SplitText dynamicly or use a fallback
    const heroTitle = document.querySelector(".hero-section .title");
    if (heroTitle) {
        // Simple reveal if SplitText is missing
        gsap.from(heroTitle, {
            opacity: 0,
            y: 50,
            duration: 1.5,
            ease: "expo.out",
        });
    }

    const heroSubtitle = document.querySelector(".hero-section .subtitle");
    if (heroSubtitle) {
        gsap.from(heroSubtitle, {
            opacity: 0,
            x: -50,
            duration: 1,
            delay: 0.3,
            ease: "power2.out",
        });
    }

    // 2. Impact Section Parallax
    gsap.to(".impact-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".impact-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. Smooth Reveals for all sections
    gsap.utils.toArray('section').forEach((section) => {
        if (section.classList.contains('hero-section')) return;

        gsap.from(section, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}
