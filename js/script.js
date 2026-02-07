//Cerar con click en cualquier parte de la pantalla
const overlay = document.getElementById("menu-overlay");

overlay.addEventListener("click", () => {
  document.body.classList.remove("show-mobile-menu");
});


const menuOpenbutton = document.querySelector("#menu-open-button");
const menuClosebutton = document.querySelector("#menu-close-button");

menuOpenbutton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});

//Cerror con click
menuClosebutton.addEventListener("click", () => menuOpenbutton.click(
));






//CARRUSEL
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let autoPlayInterval;
    const autoPlayDelay = 3000;

    // --- 1. LÓGICA DE DETECCIÓN DE TARJETA CENTRAL ---
    const updateActiveCard = () => {
        const trackCenter = track.scrollLeft + (track.offsetWidth / 2);
        let closestCard = null;
        let minDistance = Number.MAX_VALUE;

        cards.forEach((card) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        cards.forEach(card => {
            if (card === closestCard) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    };

    // --- 2. FUNCIÓN PARA CENTRAR UNA TARJETA ESPECÍFICA ---
    const centerCard = (targetCard) => {
        const scrollPosition = targetCard.offsetLeft - (track.offsetWidth / 2) + (targetCard.offsetWidth / 2);
        
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    };

    // ---EVENT LISTENER PARA CLIC EN CARTAS ---
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            stopAutoPlay(); // El usuario tomó el control manual
            centerCard(card);
            // Reanudamos autoplay después de unos segundos de inactividad si deseas
            setTimeout(startAutoPlay, 5000); 
        });
    });

    // --- 4. NAVEGACIÓN POR BOTONES Y TECLADO ---
    const getNextIndex = (direction) => {
        let currentIndex = Array.from(cards).findIndex(c => c.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;
        
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = cards.length - 1;
        if (nextIndex >= cards.length) nextIndex = 0;
        
        return nextIndex;
    };

    const navigate = (direction) => {
        const index = getNextIndex(direction);
        centerCard(cards[index]);
    };

    // --- 5. CONTROLES Y AUTOPLAY ---
    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => navigate(1), autoPlayDelay);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    };

    // Eventos de botones
    nextBtn.addEventListener('click', () => { stopAutoPlay(); navigate(1); startAutoPlay(); });
    prevBtn.addEventListener('click', () => { stopAutoPlay(); navigate(-1); startAutoPlay(); });

    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { stopAutoPlay(); navigate(-1); startAutoPlay(); }
        if (e.key === 'ArrowRight') { stopAutoPlay(); navigate(1); startAutoPlay(); }
    });

    // Eventos de Scroll y Mouse
    track.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveCard));
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Inicialización
    updateActiveCard();
    startAutoPlay();
});