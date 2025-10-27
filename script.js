// --- Wait for the entire page to load before running scripts ---
window.addEventListener('load', () => {

    // --- Preloader Functionality ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Use setTimeout to ensure the fade-out is visible even on fast loads
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 100); // A small delay
    }

    // --- 3D Cube Automatic Rotation ---
    const cubeRotator = document.querySelector('.cube-rotator');
    const cubeFaces = document.querySelectorAll('.cube-face');

    // Check if the cube elements exist on the page
    if (cubeRotator && cubeFaces.length > 0) {
        const rotations = [0, -90, -180, 90]; // Corresponds to front, right, back, left
        const faceSelectors = [
            '.cube-face-front',
            '.cube-face-right',
            '.cube-face-back',
            '.cube-face-left'
        ];
        let currentFaceIndex = 0;
        let rotationInterval;

        // Set the first face as active initially
        const initialFace = document.querySelector(faceSelectors[0]);
        if (initialFace) {
            initialFace.classList.add('active');
        }

        const startRotation = () => {
            rotationInterval = setInterval(() => {
                // Move to the next face index, looping back to the start
                currentFaceIndex = (currentFaceIndex + 1) % rotations.length;

                const rotation = rotations[currentFaceIndex];
                const activeFaceSelector = faceSelectors[currentFaceIndex];

                // Apply rotation to the rotator div
                cubeRotator.style.transform = `rotateY(${rotation}deg)`;

                // Remove active class from all faces first
                cubeFaces.forEach(face => face.classList.remove('active'));

                // Activate the corresponding cube face for text animation after a delay
                const activeFace = document.querySelector(activeFaceSelector);
                if (activeFace) {
                    setTimeout(() => {
                        activeFace.classList.add('active');
                    }, 500); // Delay allows the cube to start spinning before text appears
                }
            }, 6000); // 6000 milliseconds = 6 seconds
        };

        startRotation(); // Start the rotation
    }


    // --- Scroll Reveal Animations (UPGRADED to IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        };

        const revealOptions = {
            root: null, // relative to the viewport
            threshold: 0.1, // 10% of the element needs to be visible
            rootMargin: "0px 0px -50px 0px" // Start loading 50px before it's fully in view
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }


    // --- Testimonial Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    function startSlideShow() {
        // Clear any existing interval to prevent speeding up
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 8000); // Auto-advance every 8 seconds
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow(); // Reset interval on manual click
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Reset interval on manual click
        });

        showSlide(currentSlide); // Show the first slide
        startSlideShow(); // Start the automatic slideshow
    }

    // --- FAQ Accordion (UPGRADED LOGIC) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Check if the clicked item is already active
                const wasActive = item.classList.contains('active');
                
                // First, close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Then, toggle the clicked item
                // If it wasn't active, it will open. If it was active, it will close.
                item.classList.toggle('active');
            });
        }
    });

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Theme Switcher (Dark/Light Mode) ---
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        // Check for saved theme in localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Animated Particles in Hero Section ---
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        // Increased particle count for more bubbles
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 8 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 25}s`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;

            particlesContainer.appendChild(particle);
        }
    }

    // --- Lightbox Modal (MOVED FROM HTML & UPGRADED) ---
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    if (modal && modalImg && captionText && closeBtn && galleryImages.length > 0) {
        
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = "block";      // Show the modal
                modalImg.src = this.src;         // Set the modal image source
                captionText.innerHTML = this.alt;  // Set the caption from the image's alt text
            });
        });

        // Add click listener to the close button
        closeBtn.addEventListener('click', function() {
            modal.style.display = "none"; // Hide the modal
        });

        // Optional: Close modal when clicking outside the image
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        // Optional: Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.key === 'Esc') {
                modal.style.display = "none";
            }
        });
    }

});
