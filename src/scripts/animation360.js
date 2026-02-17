/**
 * ── MODULE: 360° Scroll Experience ──
 * @description Creates a pinned scroll-video experience where
 *   the video plays/pauses based on scroll position, then zooms
 *   into info "bubbles" with parallax entrance.
 * @requires gsap, gsap/ScrollTrigger
 * @see ../styles/photobooth.css (.experience-container, .bubble)
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function init360Experience() {
  console.log("Iniciando experiencia 360...");

  // 1. SPLIT TEXT MANUAL (Estilo Correcaminos)
  const title = document.querySelector('.roadrunner-title');
  if (title) {
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'char-split';
      title.appendChild(span);
    });

    // Animación de entrada "Correcaminos"
    gsap.from(".char-split", {
      y: 150,           // Sube desde abajo
      skewX: -45,       // Inclinación fuerte (velocidad)
      scaleY: 0.5,      // Aplastado al inicio
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,    // Efecto ola
      ease: "back.out(2)", // Rebote final
      delay: 0.2
    });
  }

  // 2. CONFIGURACIÓN DEL VIDEO Y SCROLL
  const video = document.querySelector("#scrolly-video");
  const container = document.querySelector("#pin-container");

  if (!video || !container) return;

  // Esperar a que el video cargue sus metadatos para saber duración
  video.onloadedmetadata = function () {

    // Timeline principal atada al scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=5000",   // Longitud del scroll (ajusta para más/menos velocidad)
        scrub: 1,        // Suavizado (1seg de delay)
        pin: true,       // Fija el contenedor
        anticipatePin: 1
      }
    });

    // FASE A: Reproducción del video (0s a 10s)
    // Asumiendo que el video tiene keyframes suficientes
    tl.to(video, {
      currentTime: 10, // Avanza hasta el segundo 10
      ease: "none",    // Lineal
      duration: 10     // Peso relativo en el timeline (más duración = más tramo de scroll)
    });

    // FASE B: Zoom hacia el piso/centro
    // Ocurre justo después de los 10s del video
    tl.to(".video-wrapper", {
      scale: 3.5,      // Zoom in
      y: "10%",        // Ajuste vertical si el centro no está perfecto
      duration: 4,     // Peso relativo
      ease: "power2.inOut"
    }, ">"); // ">" significa: encadenar inmediatamente

    // FASE C: Entrada de Info (Parallax Bubbles)
    // Ocurre durante el zoom final
    const infoTl = gsap.timeline();

    // Fade in del contenedor de info
    tl.to(".info-layer", { opacity: 1, duration: 2 }, "<+=1");

    // Burbujas Izquierda (Entran desde la izq)
    tl.from(".bubble-left", {
      x: -300,
      opacity: 0,
      stagger: 0.2,
      duration: 3,
      ease: "power2.out"
    }, "<"); // Al mismo tiempo que el fade in

    // Burbujas Derecha (Entran desde la der)
    tl.from(".bubble-right", {
      x: 300,
      opacity: 0,
      stagger: 0.2,
      duration: 3,
      ease: "power2.out"
    }, "<");
  };
}