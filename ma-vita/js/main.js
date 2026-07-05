/* ═══════════════════════════════════════════════════════
   MaVita — Interactive Features
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════
    // Loading Screen
    // ═══════════════════════════════════════════════════

    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1200);
    });

    // Fallback: hide loading even if load event fires early
    setTimeout(() => {
        if (!loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 3000);

    // ═══════════════════════════════════════════════════
    // Custom Cursor
    // ═══════════════════════════════════════════════════

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instant dot
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower with requestAnimationFrame
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Enlarge follower on interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .nav-toggle, .product-card, .match-item, .product-overlay, input, textarea, select, .btn-outline, .btn-gold, .btn-reset'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover');
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover');
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // ═══════════════════════════════════════════════════
    // Navbar Scroll Effect
    // ═══════════════════════════════════════════════════

    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });

    // ═══════════════════════════════════════════════════
    // Mobile Menu
    // ═══════════════════════════════════════════════════

    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isOpen = navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ═══════════════════════════════════════════════════
    // Scroll Reveal (Intersection Observer)
    // ═══════════════════════════════════════════════════

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════════════
    // Product Card Reveal
    // ═══════════════════════════════════════════════════

    const productCards = document.querySelectorAll('.product-card');

    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the reveals
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 120);
                productObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    productCards.forEach(card => productObserver.observe(card));

    // ═══════════════════════════════════════════════════
    // Step Reveal (Atelier)
    // ═══════════════════════════════════════════════════

    const steps = document.querySelectorAll('.step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                stepObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    steps.forEach(step => stepObserver.observe(step));

    // Value items reveal
    const valueItems = document.querySelectorAll('.value-item');
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                valueObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    valueItems.forEach(item => valueObserver.observe(item));

    // ═══════════════════════════════════════════════════
    //  Maç Atölyesi — Product Match Game
    // ═══════════════════════════════════════════════════

    const matchItems = document.querySelectorAll('.match-item');
    const slotLeft = document.getElementById('slotLeft');
    const slotRight = document.getElementById('slotRight');
    const matchResult = document.getElementById('matchResult');
    const matchReset = document.getElementById('matchReset');

    let leftSelection = null;
    let rightSelection = null;

    // Harmony pairing descriptions
    const harmonyPairs = {
        // Each pair key uses data-name values
        'Indigo Kase-Kum Keten Örtü': {
            text: 'Kintsugi kasenin altın çatlakları, keten örtünün doğal dokusuyla buluşuyor. Ege sofrası için kusursuz.',
            score: '★ ★ ★ ★ ★'
        },
        'Indigo Kase-Meltem Perde': {
            text: 'İndigo porselenin derinliği, meltem perdenin havadar dokusuyla ferahlıyor. Sakin bir köşe hayali.',
            score: '★ ★ ★ ★'
        },
        'Indigo Kase-LuceBlu Vazo': {
            text: 'İki Japon-İtalyan eseri yan yana. Kase ve vazo, mavinin iki tonuyla bütünleşiyor.',
            score: '★ ★ ★ ★ ★'
        },
        'Indigo Kase-Giunto Yüzük': {
            text: 'Mavi porselenin dinginliği, altın çatlaklı yüzüğün enerjisiyle tamamlanıyor.',
            score: '★ ★ ★ ★'
        },
        'Kırık Hat Kolye-Kum Keten Örtü': {
            text: 'Altın çatlak formu, ketenin ham dokusu üzerinde parlıyor. Kontrastların dansı.',
            score: '★ ★ ★ ★'
        },
        'Kırık Hat Kolye-Meltem Perde': {
            text: 'Pencereden süzülen ışık, kolyenin altın çatlağında kırılıyor. Büyüleyici.',
            score: '★ ★ ★ ★ ★'
        },
        'Kırık Hat Kolye-LuceBlu Vazo': {
            text: 'Kolyedeki altın çizgi, vazodaki altın damarla aynı dili konuşuyor. Kintsugi imzası.',
            score: '★ ★ ★ ★ ★'
        },
        'Kırık Hat Kolye-Giunto Yüzük': {
            text: 'Boyun ve parmakta iki Kintsugi eseri. MaVita takı koleksiyonunun zirvesi.',
            score: '★ ★ ★ ★ ★'
        },
        'Günbatımı Tabak-Kum Keten Örtü': {
            text: 'Amalfi günbatımı renkleri, Ege keteniyle sıcak bir sofra kuruyor.',
            score: '★ ★ ★ ★ ★'
        },
        'Günbatımı Tabak-Meltem Perde': {
            text: 'Günbatımı sıcaklığı ve meltem serinliği. Dengeli bir Akdeniz kompozisyonu.',
            score: '★ ★ ★ ★'
        },
        'Günbatımı Tabak-LuceBlu Vazo': {
            text: 'İtalyan güneşi ve Ege mavisi aynı masada. Sofranın iki yıldızı.',
            score: '★ ★ ★ ★ ★'
        },
        'Günbatımı Tabak-Giunto Yüzük': {
            text: 'Sofradaki altın rim, parmaktaki altın çatlakla selamlaşıyor.',
            score: '★ ★ ★ ★'
        },
        'Dalga Bilezik-Kum Keten Örtü': {
            text: 'Bilezikteki dalga formu, ketenin doğal dokusuyla Ege\'nin iki halini taşıyor.',
            score: '★ ★ ★ ★ ★'
        },
        'Dalga Bilezik-Meltem Perde': {
            text: 'Dalgalar ve meltem — Ege\'nin en saf iki ritmi bir arada.',
            score: '★ ★ ★ ★ ★'
        },
        'Dalga Bilezik-LuceBlu Vazo': {
            text: 'Gümüş dalgalar ve camdaki altın damar. Suyun ve ışığın buluşması.',
            score: '★ ★ ★ ★'
        },
        'Dalga Bilezik-Giunto Yüzük': {
            text: 'Bilekte dalga, parmakta bağ. MaVita takılarının tamamlayıcı gücü.',
            score: '★ ★ ★ ★ ★'
        }
    };

    function getHarmonyKey(leftName, rightName) {
        // Try both orderings
        const key1 = `${leftName}-${rightName}`;
        const key2 = `${rightName}-${leftName}`;
        return harmonyPairs[key1] || harmonyPairs[key2] || null;
    }

    function renderSlot(slot, itemData) {
        slot.innerHTML = `
            <div class="slot-content">
                <span class="match-emoji">${itemData.emoji}</span>
                <span class="match-label">${itemData.name}</span>
            </div>
        `;
        slot.classList.add('filled');
    }

    function clearSlot(slot) {
        slot.innerHTML = `
            <span class="slot-placeholder">?</span>
            <span class="slot-hint">${slot === slotLeft ? 'Sol parça' : 'Sağ parça'}</span>
        `;
        slot.classList.remove('filled');
    }

    function updateMatchResult(leftData, rightData) {
        const harmony = getHarmonyKey(leftData.name, rightData.name);

        if (harmony) {
            matchResult.innerHTML = `
                <div class="match-result-content">
                    <p class="match-result-text match-found">${harmony.text}</p>
                    <span class="match-score">${harmony.score}</span>
                </div>
            `;
        } else {
            matchResult.innerHTML = `
                <p class="match-result-text match-found">
                    ✦ ${leftData.name} & ${rightData.name} — <br>beklenmedik ama ilham verici bir eşleşme.
                </p>
            `;
        }
    }

    function resetGame() {
        leftSelection = null;
        rightSelection = null;
        clearSlot(slotLeft);
        clearSlot(slotRight);
        matchResult.innerHTML = `
            <p class="match-result-text">İki parça seç, uyumlarını gör.</p>
        `;
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected');
        });
    }

    // Item click handlers
    matchItems.forEach(item => {
        item.addEventListener('click', () => {
            const side = item.closest('.match-left') ? 'left' :
                         item.closest('.match-right') ? 'right' : null;
            if (!side) return;

            const itemData = {
                name: item.dataset.name,
                emoji: item.querySelector('.match-emoji').textContent,
                cat: item.querySelector('.match-cat').textContent,
                matchId: item.dataset.match
            };

            if (side === 'left') {
                // Deselect previous left item
                document.querySelectorAll('.match-left .match-item').forEach(i => i.classList.remove('selected'));

                if (leftSelection && leftSelection.matchId === itemData.matchId) {
                    // Clicking same item — deselect
                    leftSelection = null;
                    clearSlot(slotLeft);
                    matchResult.innerHTML = `<p class="match-result-text">İki parça seç, uyumlarını gör.</p>`;
                    return;
                }

                item.classList.add('selected');
                leftSelection = itemData;
                renderSlot(slotLeft, itemData);

            } else if (side === 'right') {
                document.querySelectorAll('.match-right .match-item').forEach(i => i.classList.remove('selected'));

                if (rightSelection && rightSelection.matchId === itemData.matchId) {
                    rightSelection = null;
                    clearSlot(slotRight);
                    matchResult.innerHTML = `<p class="match-result-text">İki parça seç, uyumlarını gör.</p>`;
                    return;
                }

                item.classList.add('selected');
                rightSelection = itemData;
                renderSlot(slotRight, itemData);
            }

            // If both slots filled, show harmony
            if (leftSelection && rightSelection) {
                updateMatchResult(leftSelection, rightSelection);
            }
        });
    });

    // Click on filled slot to clear it
    slotLeft.addEventListener('click', () => {
        if (leftSelection) {
            document.querySelectorAll('.match-left .match-item').forEach(i => i.classList.remove('selected'));
            leftSelection = null;
            clearSlot(slotLeft);
            if (!rightSelection) {
                matchResult.innerHTML = `<p class="match-result-text">İki parça seç, uyumlarını gör.</p>`;
            } else {
                matchResult.innerHTML = `<p class="match-result-text">Sol parçayı seç, uyumu tamamla.</p>`;
            }
        }
    });

    slotRight.addEventListener('click', () => {
        if (rightSelection) {
            document.querySelectorAll('.match-right .match-item').forEach(i => i.classList.remove('selected'));
            rightSelection = null;
            clearSlot(slotRight);
            if (!leftSelection) {
                matchResult.innerHTML = `<p class="match-result-text">İki parça seç, uyumlarını gör.</p>`;
            } else {
                matchResult.innerHTML = `<p class="match-result-text">Sağ parçayı seç, uyumu tamamla.</p>`;
            }
        }
    });

    // Reset button
    matchReset.addEventListener('click', resetGame);

    // ═══════════════════════════════════════════════════
    // Contact Form
    // ═══════════════════════════════════════════════════

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.textContent;

        // Simulate sending
        btn.textContent = 'Gönderiliyor...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Mesajınız Ulaştı ✦';
            btn.style.background = '#2A5580';
            btn.style.color = '#FAF7F2';

            // Reset form
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });

    // ═══════════════════════════════════════════════════
    // Smooth Scroll for Nav Links
    // ═══════════════════════════════════════════════════

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════
    // Parallax Effect on Hero
    // ═══════════════════════════════════════════════════

    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY < window.innerHeight) {
            const parallax = scrollY * 0.3;
            heroContent.style.transform = `translateY(${parallax}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));

            if (heroBg) {
                heroBg.style.transform = `scale(${1 + scrollY * 0.0003})`;
            }
        }
    });

    // ═══════════════════════════════════════════════════
    // Crack Animation Replay on Logo Hover
    // ═══════════════════════════════════════════════════

    const heroLogoWrap = document.querySelector('.hero-logo-wrap');
    if (heroLogoWrap) {
        heroLogoWrap.addEventListener('mouseenter', () => {
            const cracks = document.querySelectorAll('.crack-path-main, .crack-path-branch, .crack-path-tiny, .crack-wordmark');
            cracks.forEach(crack => {
                crack.style.animation = 'none';
                crack.offsetHeight; // trigger reflow
                crack.style.animation = '';
            });
        });
    }

}); // End DOMContentLoaded
