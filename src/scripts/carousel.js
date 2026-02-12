
export function initCarousels() {
    initSplitCarousel();
    initPhotoboothCarousel();
}

// 1. SPLIT CAROUSEL INTEGRATION (50/50 Section)
function initSplitCarousel() {
    const track = document.getElementById('splitTrack');
    const prevBtn = document.getElementById('splitPrev');
    const nextBtn = document.getElementById('splitNext');
    const dotsContainer = document.getElementById('splitDots');

    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;

    // Create Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = slides.map((_, i) =>
            `<button class="split-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
        ).join('');
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;
        track.scrollTo({
            left: track.clientWidth * index,
            behavior: 'smooth'
        });
        updateDots(index);
    }

    // Scroll Detection for Syncing Dots
    track.addEventListener('scroll', () => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        if (index !== currentIndex) {
            currentIndex = index;
            updateDots(index);
        }
    }, { passive: true });

    // Click Events
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Auto Play
    let autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

    // Pause on hover
    track.parentNode.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.parentNode.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });
}

// 2. PHOTOBOOTH CAROUSEL (Center Reveal & B&W)
function initPhotoboothCarousel() {
    const track = document.getElementById('track');
    const cards = document.querySelectorAll('.card');
    if (!track || cards.length === 0) return;

    // Center Reveal Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // B&W Logic handled by CSS (.active filter: grayscale(0))
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        root: track,
        threshold: 0.7 // Trigger when 70% visible (centerish)
    });

    cards.forEach(card => observer.observe(card));

    // Auto Scroll Logic
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollDelay = 20; // smoothness

    // Optional: Only auto-scroll if user is idle? 
    // For now, let's keep it manual as 'autoplay' on a scroll container interferes with UX.
    // Instead, let's auto-scroll slowly 

    let autoScrollInterval;
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth) {
                track.scrollLeft = 0; // Loop back
            } else {
                track.scrollLeft += scrollStep;
            }
        }, scrollDelay);
    };

    // startAutoScroll(); // Uncomment for continuous flow

    // Better Approach: Snap to next card every few seconds
    setInterval(() => {
        const cardWidth = 280; // card + gap
        const currentScroll = track.scrollLeft;
        const nextScroll = currentScroll + cardWidth;

        if (nextScroll > track.scrollWidth - track.clientWidth) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
    }, 3000);
}
