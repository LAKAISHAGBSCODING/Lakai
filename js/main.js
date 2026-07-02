document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. FUNGSI UNTUK MENGAMBIL FILE HTML (FETCH)
    // =========================================================
    function loadPage(url, elementId) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Gagal memuat file: " + url);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => {
                console.error("❌ Masalah saat fetch:", error);
            });
    }

    // =========================================================
    // 2. LOAD SEMUA HALAMAN SEKALIGUS
    // =========================================================
    Promise.all([
        loadPage('pages/skills.html', 'skills'),
        loadPage('pages/languages.html', 'languages'),
        loadPage('pages/achievements.html', 'achievements'),
        loadPage('pages/projects.html', 'projects'),
        loadPage('pages/experience.html', 'experience')
    ]).then(() => {
        
        // =========================================================
        // 3. LIVE SCROLL TRACKING SYSTEM (SUPER AKURAT & ANTI-BLANK)
        // =========================================================
        function cekAnimasiScroll() {
            const fadeElements = document.querySelectorAll('.fade-in');
            const tinggiLayar = window.innerHeight;

            fadeElements.forEach(el => {
                // Ambil koordinat elemen secara live dari atas layar browser saat ini
                const posisiTopEl = el.getBoundingClientRect().top;

                // Jika elemen sudah berjarak dekat dengan bagian bawah layar (ditambah jarak aman 60px)
                if (posisiTopEl < tinggiLayar - 60) {
                    
                    // A. Jalankan animasi fade-in & slide-up CSS
                    el.classList.add('visible');

                    // B. Jalankan animasi bar warna progress (khusus halaman skills)
                    const progressFill = el.querySelector('.mini-progress-fill');
                    if (progressFill) {
                        const targetWidth = progressFill.getAttribute('data-width');
                        if (targetWidth && progressFill.style.width !== targetWidth) {
                            progressFill.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                            progressFill.style.width = targetWidth;
                        }
                    }

                    // C. Jalankan animasi angka counter persen (khusus halaman skills)
                    const percentText = el.querySelector('.skill-percent');
                    if (percentText && percentText.innerText === '0%') {
                        const targetNum = parseInt(percentText.getAttribute('data-target'));
                        let currentNum = 0;
                        const duration = 1200;
                        const interval = 20;
                        const step = (targetNum / duration) * interval;
                        
                        const counter = setInterval(() => {
                            currentNum += step;
                            if (currentNum >= targetNum) {
                                currentNum = targetNum;
                                clearInterval(counter);
                            }
                            percentText.innerText = Math.round(currentNum) + '%';
                        }, interval);
                    }
                }
            });
        }

        // Jalankan sekali di awal dengan sedikit delay biar loading pembuka beres
        setTimeout(cekAnimasiScroll, 200);

        // Pasang pelacakan live setiap kali user meng-scroll layar laptop / HP
        window.addEventListener('scroll', cekAnimasiScroll);

        // =========================================================
        // 4. LOGIKA FILTER PROJECT
        // =========================================================
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-item');

        if (filterButtons.length > 0 && projectItems.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const filterValue = e.target.getAttribute('data-filter');
                    
                    projectItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        if (filterValue === 'all' || filterValue === itemCategory) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1) translateY(0)';
                            }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.9) translateY(20px)';
                            setTimeout(() => { item.style.display = 'none'; }, 500); 
                        }
                    });
                });
            });
        }

    });
});