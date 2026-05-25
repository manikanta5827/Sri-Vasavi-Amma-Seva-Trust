// === Initialize Lucide Icons ===
lucide.createIcons();

// === Navbar scroll state ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
}, { passive: true });

// === Mobile Menu ===
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileBtn.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
    lucide.createIcons();
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
        document.body.style.overflow = '';
    });
});

// === Smooth scrolling for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// === Copy to clipboard for bank details ===
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const value = btn.dataset.copy;
        try {
            await navigator.clipboard.writeText(value);
            showToast(`Copied: ${value}`);
            // Visual feedback
            btn.innerHTML = '<i data-lucide="check"></i>';
            lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = '<i data-lucide="copy"></i>';
                lucide.createIcons();
            }, 1600);
        } catch {
            showToast('Press Ctrl/Cmd+C to copy');
        }
    });
});

// === FAQ — close others when one opens (accordion behaviour) ===
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.open = false;
            });
        }
    });
});

// === Pause hero video on tab blur (save resources) ===
const heroVideo = document.querySelector('.hero-card-main video');
document.addEventListener('visibilitychange', () => {
    if (!heroVideo) return;
    if (document.hidden) heroVideo.pause();
    else heroVideo.play().catch(() => {});
});

// === Scroll-triggered fade-in animations ===
// Use a generous rootMargin so animations fire well before the element enters view.
// Critical content (donation, pricing, FAQ) is intentionally NOT animated to guarantee
// visibility on direct anchor navigation and slower devices.
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: '0px 0px 200px 0px' });

const animateTargets = [
    '.support-card',
    '.temple-tile',
    '.recent-item',
    '.programs-list li',
];

document.querySelectorAll(animateTargets.join(',')).forEach((el, i) => {
    el.classList.add('fade-in-element');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    observer.observe(el);
});

// Safety net — after 3s, force any leftover fade-in elements visible
setTimeout(() => {
    document.querySelectorAll('.fade-in-element:not(.visible)').forEach(el => {
        el.classList.add('visible');
    });
}, 3000);

// === Hide floating donate when in donate section ===
const donateSection = document.getElementById('donate');
const fab = document.querySelector('.fab-donate');
if (donateSection && fab) {
    const fabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            fab.style.opacity = entry.isIntersecting ? '0' : '1';
            fab.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        });
    }, { threshold: 0.15 });
    fabObserver.observe(donateSection);
}
