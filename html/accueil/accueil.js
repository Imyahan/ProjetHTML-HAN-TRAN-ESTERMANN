(function(){
    const track = document.querySelector('.carousel__track');
    if(!track) return;
    
    const origSlides = Array.from(track.children);
    const slideCount = origSlides.length;
    
    // Clone slides for infinite loop: add copies at end and beginning
    origSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });
    origSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    });
    
    const allSlides = Array.from(track.children);
    const prevButton = document.querySelector('.carousel__btn--prev');
    const nextButton = document.querySelector('.carousel__btn--next');
    
    let slideWidth = origSlides[0].getBoundingClientRect().width + 20; // includes margin
    let index = slideCount; // start at first "real" slide (after clones)
    let isDragging = false, startX = 0;
    let isTransitioning = false;
    let autoplayInterval = null;

    const updateSlideWidth = () => {
        slideWidth = origSlides[0].getBoundingClientRect().width + 20;
    };

    const startAutoplay = () => {
        if(autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if(!isDragging && !isTransitioning) {
                index++;
                setPosition(true);
                handleLoopReset();
            }
        }, 4000);
    };

    const pauseAutoplay = () => {
        if(autoplayInterval) clearInterval(autoplayInterval);
    };

    const setPosition = (smooth = true) => {
        if(smooth) {
            track.style.transition = 'transform 0.5s ease';
        }
        track.style.transform = `translateX(${ -index * slideWidth }px)`;
    };

    const handleLoopReset = () => {
        // After transition ends, if we're at a clone, jump to real slide without animation
        setTimeout(() => {
            if(index < slideCount) {
                index = slideCount + (slideCount - (slideCount - index));
                track.style.transition = 'none';
                track.style.transform = `translateX(${ -index * slideWidth }px)`;
            } else if(index >= slideCount + slideCount) {
                index = slideCount + (index - slideCount - slideCount);
                track.style.transition = 'none';
                track.style.transform = `translateX(${ -index * slideWidth }px)`;
            }
            isTransitioning = false;
        }, 500);
    };

    prevButton.addEventListener('click', ()=>{
        if(isTransitioning) return;
        isTransitioning = true;
        index--;
        setPosition(true);
        handleLoopReset();
        pauseAutoplay();
        startAutoplay();
    });
    
    nextButton.addEventListener('click', ()=>{
        if(isTransitioning) return;
        isTransitioning = true;
        index++;
        setPosition(true);
        handleLoopReset();
        pauseAutoplay();
        startAutoplay();
    });

    // touch / drag support
    track.addEventListener('pointerdown', (e)=>{
        if(isTransitioning) return;
        isDragging = true;
        startX = e.clientX;
        track.style.transition = 'none';
        pauseAutoplay();
    });
    
    window.addEventListener('pointerup', (e)=>{
        if(!isDragging) return;
        isDragging = false;
        const moved = startX - e.clientX;
        if(moved > 50) {
            index++;
        } else if(moved < -50) {
            index--;
        }
        isTransitioning = true;
        setPosition(true);
        handleLoopReset();
        startAutoplay();
    });
    
    window.addEventListener('pointermove', (e)=>{
        if(!isDragging) return;
        const moved = e.clientX - startX;
        track.style.transform = `translateX(${ -index * slideWidth + moved }px)`;
    });

    // responsive: update on resize
    window.addEventListener('resize', ()=>{
        updateSlideWidth();
        track.style.transition = 'none';
        setPosition(false);
    });

    // initial position
    updateSlideWidth();
    setPosition(false);
    
    // start autoplay
    startAutoplay();

})();