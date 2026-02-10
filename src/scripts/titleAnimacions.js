import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

// Registramos los plugins
gsap.registerPlugin(SplitText, Physics2DPlugin);

export function animateHeroTitle() {
  const title = document.querySelector(".hero-section .hero-details .title");
  
  // Si no encuentra el título, paramos para evitar errores
  if (!title) return;

  // 1. Aseguramos que sea visible antes de empezar
  gsap.set(title, { visibility: "visible" });

  // 2. Dividimos el texto. 'words, chars' protege mejor los espacios y gradientes
  const split = new SplitText(title, { type: "words, chars" });

  // 3. La Animación
  gsap.from(split.chars, {
    duration: 2.5,
    opacity: 0,
    y: -200, // Empieza más arriba
    transformOrigin: "50% 50%",
    rotation: () => Math.random() * 100 - 50, // Rotación caótica inicial
    
    // Stagger random hace que parezca una lluvia de letras
    stagger: {
      each: 0.02,
      from: "random"
    },
    
    // Física: Velocidad inicial hacia arriba + Gravedad fuerte hacia abajo
    physics2D: {
      velocity: () => Math.random() * 300 + 150,
      angle: () => Math.random() * 40 + 250, // Ángulo entre 250 y 290 grados
      gravity: 900 // Gravedad pesada para un rebote seco
    },
    
    // El rebote final
    ease: "bounce.out",
    
    // IMPORTANTE: Al terminar, revertimos el HTML a su estado original
    // para que tu animación CSS de 'gradient' vuelva a fluir en todo el texto
    onComplete: () => {
      split.revert();
    }
  });
}