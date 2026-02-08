export function initAnimations() {
    window.addEventListener('load', () => {
        // 1. Registro de Plugins (Asumiendo que ScriptsGSAP ya los cargó)
        gsap.registerPlugin(SplitText, Physics2DPlugin, ScrollTrigger, ScrollSmoother);

        // 2. Configurar ScrollSmoother (Opcional: solo si usas el wrapper en el layout)
        if (document.getElementById('smooth-wrapper')) {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 2,
                effects: true
            });
        }

        // 3. Efecto WOW para el Título (SplitText + Physics2D)
        const heroTitle = new SplitText(".hero-details .title", { type: "chars" });
        
        gsap.from(heroTitle.chars, {
            duration: 1.5,
            opacity: 0,
            y: 100,
            rotation: () => Math.random() * 90 - 45,
            physics2D: {
                velocity: () => Math.random() * 200 + 100,
                angle: () => Math.random() * 60 + 240,
                gravity: 500
            },
            stagger: 0.05,
            ease: "back.out(1.7)"
        });

        // 4. Animación de las Cards del Carousel al hacer Scroll
        gsap.from(".card", {
            scrollTrigger: {
                trigger: "#track",
                start: "top 80%",
            },
            scale: 0.8,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1,
            ease: "expo.out"
        });

        // 5. Parallax suave para la imagen del Photo Booth
        gsap.to(".hero-image", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                scrub: true
            }
        });
    });
}