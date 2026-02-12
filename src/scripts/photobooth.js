import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================
// GLOBAL VARIABLES
// ============================================

let splitInstance = null;
let mainTimeline = null;
let isInitialized = false;

// Dynamic check for SplitText
let SplitText;
async function loadSplitText() {
    try {
        const module = await import('gsap/SplitText');
        SplitText = module.SplitText;
        gsap.registerPlugin(SplitText);
    } catch (e) {
        console.warn('⚠️ SplitText not found, using manual fallback');
    }
}

// ============================================
// 1. ROADRUNNER TEXT ANIMATION
// ============================================

async function initRoadrunnerTitle() {
    const title = document.querySelector('.roadrunner-title');
    if (!title) return;

    if (!SplitText) await loadSplitText();

    let chars;

    if (SplitText) {
        splitInstance = new SplitText(title, {
            type: 'chars,words',
            charsClass: 'char-split'
        });
        chars = splitInstance.chars;

        // Add specific class to '0' digit
        chars.forEach(char => {
            if (char.textContent === '0') {
                char.classList.add('char-zero');
            }
        });
    } else {
        const text = title.textContent.trim();
        title.innerHTML = '';
        const words = text.split(' ');
        chars = [];

        words.forEach((word, wordIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';

            word.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'char-split';
                if (char === '0') span.classList.add('char-zero');
                wordSpan.appendChild(span);
                chars.push(span);
            });

            title.appendChild(wordSpan);

            if (wordIdx < words.length - 1) {
                const space = document.createTextNode('\u00A0');
                title.appendChild(space);
            }
        });
    }

    // Unified simple fade-in entrance for both Desktop and Mobile
    gsap.set(chars, { opacity: 0 });
    gsap.to(chars, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        onComplete: () => {
            startLetterFlicker(chars);
            // 2. Add ScrollTrigger to fade out as we scroll down
            gsap.to(title, {
                opacity: 0,
                y: -50,
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "60px top", // Very fast fade out
                    scrub: true,
                    onLeave: () => { flickerActive = false; },
                    onEnterBack: () => {
                        flickerActive = true;
                        if (window._flickerLoop) window._flickerLoop();
                    }
                }
            });
        }
    });
}

let flickerActive = true;

/**
 * Creates an infinite, random flickering neon effect on letters (Purple theme)
 */
function startLetterFlicker(chars) {
    if (!chars || chars.length === 0) return;

    const flickerLoop = () => {
        if (!flickerActive) return;

        // Randomly pick How many chars to flicker (1 to 3)
        const count = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < count; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];

            // Skip the "0" if it has the special class to keep its specific styling
            if (char.classList.contains('char-zero')) continue;

            gsap.to(char, {
                textShadow: "0 0 8px #783e8c, 0 0 15px #783e8c",
                color: "#783e8c",
                duration: Math.random() * 0.4 + 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
        }

        // Schedule next flicker with random delay
        gsap.delayedCall(Math.random() * 2 + 0.5, flickerLoop);
    };

    flickerLoop();

    // Store for standby resume
    window._flickerLoop = flickerLoop;
}

// ============================================
// 2. SCROLL EXPERIENCE (Auto-play + Pin)
// ============================================

function initScrollExperience() {
    const video = document.querySelector('#scrolly-video');
    const container = document.querySelector('#pin-container');
    const videoWrapper = document.querySelector('.video-wrapper');
    const staticLayer = document.querySelector('.static-image-layer');
    const infoLayer = document.querySelector('.info-layer');

    if (!video || !container) return;

    const setupTimeline = () => {
        if (mainTimeline) mainTimeline.kill();

        const videoDuration = video.duration || 10;
        const isMobile = window.innerWidth < 900;

        // Reset video state
        video.currentTime = 0;
        video.pause();

        mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                // The duration of the pin will depend on the video plus animations
                // On mobile we make it feel "locked" until sequence finishes
                end: `+=${videoDuration * (isMobile ? 150 : 200)}`,
                pin: true,
                scrub: false, // NO SCRUB = NO LAG
                anticipatePin: 1,
                onEnter: () => {
                    video.play();
                },
                onLeaveBack: () => {
                    video.pause();
                    video.currentTime = 0;
                },
                onEnterBack: () => {
                    video.play();
                }
            }
        });

        // STAGE 1: Video Playback (timed to duration)
        // We use an empty tween to represent the video duration in the timeline
        mainTimeline.to({}, {
            duration: videoDuration,
            onUpdate: () => {
                // Fallback ensure playback if onEnter missed
                if (video.paused && mainTimeline.progress() > 0 && mainTimeline.progress() < 1) {
                    video.play().catch(() => { });
                }
            }
        });

        // STAGE 2: Zoom in (Starts after video)
        mainTimeline.to(videoWrapper, {
            scale: isMobile ? 3 : 4.5,
            y: isMobile ? '12%' : '18%',
            duration: 1.5,
            ease: "power2.inOut",
            force3D: true // Ensure GPU usage
        });

        // STAGE 3: Show Static Image (Overlapping to hide zoom effort)
        mainTimeline.to(staticLayer, {
            autoAlpha: 1, // Handles both opacity and visibility
            duration: 0.8,
            force3D: true,
            onStart: () => {
                gsap.set(staticLayer, { visibility: 'visible' });
            },
            onComplete: () => {
                // Completely hide video to save resources
                gsap.set(videoWrapper, { visibility: 'hidden' });
            }
        }, "-=0.7"); // Bigger overlap

        // STAGE 4: Info Bubbles Entrance
        mainTimeline.to(infoLayer, {
            opacity: 1,
            duration: 1,
            force3D: true
        }, ">");

        const leftBubbles = document.querySelectorAll('.bubble-left');
        const rightBubbles = document.querySelectorAll('.bubble-right');

        mainTimeline.from([...leftBubbles, ...rightBubbles], {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power2.out",
            force3D: true
        }, "<");

        // STAGE 5: Parallax vertical movement (automatic after entrance)
        const parallaxDuration = 2;
        const parallaxSpeed = isMobile ? 0.4 : 0.8;

        leftBubbles.forEach((b, i) => {
            mainTimeline.to(b, {
                y: -(i + 1) * (100 * parallaxSpeed),
                duration: parallaxDuration,
                ease: "none"
            }, ">-0.5");
        });

        rightBubbles.forEach((b, i) => {
            mainTimeline.to(b, {
                y: -(i + 1) * (80 * parallaxSpeed),
                duration: parallaxDuration,
                ease: "none"
            }, "<");
        });
    };

    if (video.readyState >= 1) {
        setupTimeline();
    } else {
        video.onloadedmetadata = setupTimeline;
        setTimeout(() => { if (!mainTimeline) setupTimeline(); }, 2000);
    }
}

// ============================================
// 3. PERFORMANCE UTILS
// ============================================

function initPerformanceHandlers() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // --- MENU STATE OBSERVER (Pause flicker/Resource saving) ---
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isMenuOpen = document.body.classList.contains('show-mobile-menu');
                if (isMenuOpen) {
                    flickerActive = false;
                    gsap.killDelayedCallsTo(window._flickerLoop);
                } else {
                    flickerActive = true;
                    if (window._flickerLoop) window._flickerLoop();
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });

    document.addEventListener('visibilitychange', () => {
        const video = document.querySelector('#scrolly-video');
        if (document.hidden) {
            flickerActive = false;
            gsap.killDelayedCallsTo(window._flickerLoop);
            ScrollTrigger.getAll().forEach(t => t.disable());
            if (video) video.pause();
        } else {
            flickerActive = true;
            if (window._flickerLoop) window._flickerLoop();
            ScrollTrigger.getAll().forEach(t => t.enable());
            ScrollTrigger.refresh();
        }
    });
}

// ============================================
// MAIN EXPORT
// ============================================

export async function init360Experience() {
    if (isInitialized) return;
    isInitialized = true;

    gsap.registerPlugin(ScrollTrigger);

    await initRoadrunnerTitle();
    initScrollExperience();
    initPerformanceHandlers();

    setTimeout(() => ScrollTrigger.refresh(), 1000);
}

// Cleanup
window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (splitInstance) splitInstance.revert();
});

if (typeof window !== 'undefined') {
    if (document.readyState !== 'loading') {
        init360Experience();
    } else {
        document.addEventListener('DOMContentLoaded', init360Experience);
    }
}