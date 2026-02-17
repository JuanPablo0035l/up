/**
 * ── MODULE: Interactive Animations ──
 * @description GSAP-powered scroll animations for the homepage.
 *   - Hero parallax background
 *   - Hero title/subtitle/buttons entrance
 *   - Impact section parallax
 *   - Smooth section reveals on scroll
 * @requires gsap, gsap/ScrollTrigger
 * @see ../styles/pages/home/hero.css
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHighEndAnimations() {
    // 1. Hero Title Animation & Parallax
    // Parallax for Hero BG
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) {
        gsap.to(heroBg, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Hero Content Entrance
    const heroTitle = document.querySelector(".hero-section .title");
    if (heroTitle) {
        gsap.from(heroTitle, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1.2,
            ease: "power3.out",
        });
    }

    const heroSubtitle = document.querySelector(".hero-section .subtitle");
    if (heroSubtitle) {
        gsap.from(heroSubtitle, {
            opacity: 0,
            x: -30,
            duration: 1,
            delay: 0.4,
            ease: "power2.out",
        });
    }

    const heroButtons = document.querySelector(".hero-section .buttons");
    if (heroButtons) {
        gsap.from(heroButtons, {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.6,
            ease: "power2.out",
        });
    }

    // Mascot Tooltip Pop
    const tooltip = document.querySelector(".mascot-tooltip");
    if (tooltip) {
        gsap.to(tooltip, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 1.5,
            ease: "elastic.out(1, 0.5)"
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
