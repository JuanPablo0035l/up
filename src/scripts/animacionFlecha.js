/**
 * ── MODULE: Arrow / Scroll Hint Animation ──
 * @description Animates the "scroll down" hint arrow at the
 *   bottom of the photobooth hero. Fades out on scroll.
 *   Includes battery-saving pause when tab is hidden.
 * @requires gsap, gsap/ScrollTrigger
 * @see ../styles/photobooth.css (.scroll-hint, .arrow)
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setupScrollAnimation() {
    const container = document.querySelector('.scroll-wrapper');
    const hint = document.querySelector('.scroll-hint');
    const arrow = document.querySelector('.arrow');

    if (!container || !hint || !arrow) return;

    // 1. Animación de Color e Intermitencia (Loop infinito)
    const colorTl = gsap.timeline({ repeat: -1 });
    colorTl.to(hint, {
        color: "#ffffff",
        duration: 0.4,
        ease: "power2.out"
    })
        .to(hint, {
            color: "rgba(255, 255, 255, 0.2)",
            duration: 0.8,
            ease: "power2.in"
        }, "+=1.8");

    // 2. Animación de la Flecha (Salto capcioso)
    gsap.to(arrow, {
        y: 10,
        scaleY: 0.7,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "back.inOut(3)",
    });

    // 3. EFECTO DESAPARECER (ScrollTrigger)
    gsap.to(container, {
        opacity: 0,
        y: -20, // Se desplaza un poco hacia arriba al irse
        scrollTrigger: {
            trigger: "body",   // Empieza a contar desde el inicio del body
            start: "top top",  // Cuando el tope del body está en el tope del viewport
            end: "+=150",      // Se completa tras bajar 150px
            scrub: true,       // La desaparición va al ritmo del dedo/rueda
        }
    });

    // 4. MODO STANDBY (Ahorro de batería)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            colorTl.pause();
            gsap.getTweensOf(arrow).forEach(t => t.pause());
        } else {
            colorTl.play();
            gsap.getTweensOf(arrow).forEach(t => t.play());
        }
    });
}