/**
 * Header desplegable con scroll
 */
function initSmartHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScrollTop = 0;
    const threshold = 100; // Only start hiding after 100px of scroll
    let isTicking = false;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Avoid negative values (iOS elastic scroll)
        const currentScroll = scrollTop <= 0 ? 0 : scrollTop;

        // 2. Hide only after passing the threshold
        if (currentScroll > threshold) {
            if (currentScroll > lastScrollTop) {
                // Scrolling DOWN - Hide
                header.classList.add('header-hidden');
            } else {
                // Scrolling UP - Show
                header.classList.remove('header-hidden');
            }
        } else {
            // Near TOP - Always show
            header.classList.remove('header-hidden');
        }

        lastScrollTop = currentScroll;
        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(handleScroll);
            isTicking = true;
        }
    }, { passive: true });
}

// Initialize on load
if (document.readyState !== 'loading') {
    initSmartHeader();
} else {
    document.addEventListener('DOMContentLoaded', initSmartHeader);
}
