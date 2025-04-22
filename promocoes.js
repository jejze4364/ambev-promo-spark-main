
document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    initCarousel();
    
    // Countdown timer
    startCountdown();
    
    // Tab selection
    initTabs();
    
    // Notification modal
    initNotificationModal();
    
    // Filter modal
    initFilterModal();
    
    // Integration buttons
    initIntegrationButtons();
});

// Carousel functionality
function initCarousel() {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    
    // Set automatic rotation
    const carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Manual navigation with dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-index'));
            goToSlide(slideIndex);
        });
    });
    
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }
    
    function goToSlide(index) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Add active class to new slide and dot
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
}

// Countdown timer
function startCountdown() {
    // Set the countdown target (5 hours, 32 minutes, 18 seconds from now)
    const now = new Date();
    const targetTime = new Date(now.getTime() + (5 * 60 * 60 * 1000) + (32 * 60 * 1000) + (18 * 1000));
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetTime - now;
        
        if (diff <= 0) {
            // Countdown has ended
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Tab selection
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Here you would filter the promotions based on the category
            const category = tab.getAttribute('data-category');
            console.log(`Selected category: ${category}`);
            // filterPromotions(category);
        });
    });
}

// Notification modal
function initNotificationModal() {
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationModal = document.getElementById('notification-modal');
    const closeBtn = notificationModal.querySelector('.close-btn');
    
    notificationIcon.addEventListener('click', () => {
        notificationModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    closeBtn.addEventListener('click', () => {
        notificationModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close modal when clicking outside
    notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
            notificationModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Filter modal
function initFilterModal() {
    const filterBtn = document.querySelector('.filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const closeBtn = filterModal.querySelector('.close-btn');
    const applyBtn = filterModal.querySelector('.apply-btn');
    const resetBtn = filterModal.querySelector('.reset-btn');
    
    filterBtn.addEventListener('click', () => {
        filterModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    closeBtn.addEventListener('click', () => {
        filterModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    applyBtn.addEventListener('click', () => {
        // Apply the filters
        applyFilters();
        
        // Close the modal
        filterModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    resetBtn.addEventListener('click', () => {
        // Reset all checkboxes
        const checkboxes = filterModal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    });
    
    // Close modal when clicking outside
    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    function applyFilters() {
        // Get all checked filters
        const discountChecked = document.getElementById('discount').checked;
        const bundleChecked = document.getElementById('bundle').checked;
        const cashbackChecked = document.getElementById('cashback').checked;
        
        const brandsChecked = {
            brahma: document.getElementById('brahma').checked,
            skol: document.getElementById('skol').checked,
            budweiser: document.getElementById('budweiser').checked,
            corona: document.getElementById('corona').checked,
            stella: document.getElementById('stella').checked
        };
        
        const allMarketsChecked = document.getElementById('all-markets').checked;
        
        console.log('Applied filters:', {
            types: { discount: discountChecked, bundle: bundleChecked, cashback: cashbackChecked },
            brands: brandsChecked,
            allMarkets: allMarketsChecked
        });
        
        // Here you would filter the promotions based on the selected filters
        // filterPromotions(filters);
    }
}

// Integration buttons
function initIntegrationButtons() {
    const connectZeBtn = document.getElementById('connect-ze');
    const connectBeesBtn = document.getElementById('connect-bees');
    
    connectZeBtn.addEventListener('click', () => {
        // Simulate opening the Zé Delivery app or website
        alert('Redirecionando para o Zé Delivery...');
        // window.open('https://www.zedelivery.com.br', '_blank');
    });
    
    connectBeesBtn.addEventListener('click', () => {
        // Simulate opening the Bees app or website
        alert('Redirecionando para o app Bees...');
        // window.open('https://www.bees.com', '_blank');
    });
}

// Simulate loading of offers for each tab
function filterPromotions(category) {
    console.log(`Filtering promotions for category: ${category}`);
    // Here you would load or filter promotions based on the selected category
    // For now, we'll just log the selected category
}

// Add images for demonstration purposes
function loadPlaceholderImages() {
    // This function would load placeholder images for demonstration purposes
    // In a real application, these would be loaded from a server
    
    // Example: const beerImages = ['brahma.jpg', 'skol.jpg', 'budweiser.jpg'];
    // Then assign these images to the appropriate elements
}
