document.addEventListener('DOMContentLoaded', () => {
    // --- Project filtering functionality ---
    const filterButtons = document.querySelectorAll('#projects .projects-filter .filter-btn'); // More specific selector
    const projectCardsToFilter = document.querySelectorAll('#projects .projects-grid .project-card'); // More specific selector

    if (filterButtons.length > 0 && projectCardsToFilter.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all filter buttons in this specific filter group
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Show/hide projects based on filter
                projectCardsToFilter.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                    if (shouldShow) {
                        card.style.display = 'block'; // Or 'flex' if using flexbox for card layout
                        // Using a timeout to allow display:block to take effect before transition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10); // Short delay
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Should match CSS transition duration
                    }
                });
            });
        });
    }

    // --- Smooth scroll for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // Do nothing if href is just "#"

            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Aligns the top of the target element to the top of the viewport
                    });
                } else {
                    console.warn(`Smooth scroll target "${targetId}" not found.`);
                }
            } catch (error) {
                // Catch invalid selectors, e.g. if href is not a valid ID
                console.error(`Invalid selector for smooth scroll: "${targetId}"`, error);
            }
        });
    });

    // --- Scroll animations with Intersection Observer ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation a bit before element is fully in view
    };

    const observerCallback = (entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optional: unobserve after animation if it should only happen once
                // obs.unobserve(entry.target); 
            } else {
                // Optional: Reset if you want animation to replay when scrolling out and back in
                // This part is commented out as per original script's behavior
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(30px)';
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all designated elements for scroll animation
    document.querySelectorAll('.section, .project-card, .skill-category').forEach(el => {
        // Set initial state for animation for elements that are not the header
        // The header's initial state is handled separately to ensure it's visible on load
        if (!el.classList.contains('header')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Ensure transition is set
        observer.observe(el);
    });
    
    // Ensure header is visible initially and animated if desired (or just set to visible)
    const headerSection = document.querySelector('.header');
    if (headerSection) {
        // If header is also to be animated in by observer, it's already covered by '.section'
        // If it should be visible immediately without animation by observer:
        headerSection.style.opacity = '1';
        headerSection.style.transform = 'translateY(0)';
        // If you still want the observer to potentially re-trigger or manage it:
        // observer.observe(headerSection); 
    }


    // --- NEW: Blog Post Card Expansion Functionality ---
    const blogPostCards = document.querySelectorAll('.blog-post-card');

    blogPostCards.forEach(card => {
        const toggleButton = card.querySelector('.blog-toggle-button');
        const descriptionSnippet = card.querySelector('.project-description');
        const fullContent = card.querySelector('.blog-full-content');


        if (toggleButton && descriptionSnippet && fullContent) {
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const isCurrentlyExpanded = card.classList.contains('expanded');

                // If it's expanded and we are about to collapse it, 
                // and the card's top is above the viewport, scroll to it.
                if (isCurrentlyExpanded) {
                    const cardTop = card.getBoundingClientRect().top;
                    // A threshold, e.g., if card top is more than 100px above viewport top
                    if (cardTop < -100) { 
                        // card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // A slight delay for scroll before class toggle can sometimes help
                        // Or just let CSS handle the visual collapse.
                    }
                }
                
                card.classList.toggle('expanded');
                
                // Update button text based on the new state
                if (card.classList.contains('expanded')) {
                    toggleButton.textContent = 'Show Less';
                } else {
                    toggleButton.textContent = 'Read More';
                }
            });
        }
    });
    // --- END NEW: Blog Post Card Expansion Functionality ---

}); // End of DOMContentLoaded