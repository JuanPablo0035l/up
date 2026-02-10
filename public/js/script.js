document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LÓGICA DEL MENÚ MOBILE (Prioridad Alta)
    // ==========================================
    const overlay = document.getElementById("menu-overlay");
    const menuOpenBtn = document.querySelector("#menu-open-button");
    const menuCloseBtn = document.querySelector("#menu-close-button");

    // Verificamos que los elementos existan antes de agregar eventos
    if (menuOpenBtn && menuCloseBtn) {

        const toggleMenu = () => {
            document.body.classList.toggle("show-mobile-menu");
        };

        const closeMenu = () => {
            document.body.classList.remove("show-mobile-menu");
        };

        // Eventos
        menuOpenBtn.addEventListener("click", toggleMenu);
        menuCloseBtn.addEventListener("click", closeMenu);

        if (overlay) {
            overlay.addEventListener("click", closeMenu);
        }
    }

    // ==========================================
    // 2. LÓGICA DEL CARRUSEL
    // ==========================================
    const track = document.getElementById('track');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Solo ejecutamos si el carrusel existe en esta página
    if (track && cards.length > 0 && prevBtn && nextBtn) {

        let autoPlayInterval;
        const autoPlayDelay = 3000;

        // --- DETECCIÓN DE TARJETA CENTRAL ---
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

        // --- CENTRAR TARJETA ---
        const centerCard = (targetCard) => {
            if (!targetCard) return;
            // Cálculo corregido para centrado exacto
            const scrollPosition = targetCard.offsetLeft - (track.offsetWidth / 2) + (targetCard.offsetWidth / 2);

            track.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        };

        // --- CLICK EN CARTAS ---
        cards.forEach((card) => {
            card.addEventListener('click', () => {
                stopAutoPlay();
                centerCard(card);
                // Reiniciar autoplay tras 5 segundos de inactividad
                setTimeout(startAutoPlay, 5000);
            });
        });

        // --- NAVEGACIÓN ---
        const getNextIndex = (direction) => {
            let currentIndex = Array.from(cards).findIndex(c => c.classList.contains('active'));
            if (currentIndex === -1) currentIndex = 0;

            let nextIndex = currentIndex + direction;
            // Loop infinito
            if (nextIndex < 0) nextIndex = cards.length - 1;
            if (nextIndex >= cards.length) nextIndex = 0;

            return nextIndex;
        };

        const navigate = (direction) => {
            const index = getNextIndex(direction);
            centerCard(cards[index]);
        };

        // --- AUTOPLAY ---
        const startAutoPlay = () => {
            stopAutoPlay(); // Limpiamos el anterior por seguridad
            autoPlayInterval = setInterval(() => navigate(1), autoPlayDelay);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };

        // --- EVENTOS DE CONTROLES ---
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            navigate(1);
            startAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            navigate(-1);
            startAutoPlay();
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { stopAutoPlay(); navigate(-1); startAutoPlay(); }
            if (e.key === 'ArrowRight') { stopAutoPlay(); navigate(1); startAutoPlay(); }
        });

        // Mouse / Scroll manual
        track.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveCard));
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);

        // --- MODO STANDBY (Ahorro de batería) ---
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });

        // --- INICIALIZACIÓN ---
        // Pequeño timeout para asegurar que el CSS ya cargó las dimensiones
        setTimeout(() => {
            updateActiveCard();
            startAutoPlay();
        }, 100);
    }
});