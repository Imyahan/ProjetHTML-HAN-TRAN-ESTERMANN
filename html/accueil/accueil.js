(function(){
    const track = document.querySelector('.carousel__track');
    if(!track) return;
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('.carousel__btn--prev');
    const nextButton = document.querySelector('.carousel__btn--next');
    const slideWidth = slides[0].getBoundingClientRect().width + 20; // includes margin
    let index = 0;
    let isDragging = false, startX = 0, currentTranslate = 0;

    // arrange slides next to one another
    const setPosition = () => {
        track.style.transform = `translateX(${ -index * slideWidth }px)`;
        slides.forEach((s,i)=> s.setAttribute('aria-hidden', i!==index));
    };

    prevButton.addEventListener('click', ()=>{
        index = Math.max(0, index-1);
        setPosition();
    });
    nextButton.addEventListener('click', ()=>{
        index = Math.min(slides.length-1, index+1);
        setPosition();
    });

    // touch / drag support
    track.addEventListener('pointerdown', (e)=>{
        isDragging = true; startX = e.clientX; track.style.transition = 'none';
    });
    window.addEventListener('pointerup', (e)=>{
        if(!isDragging) return; isDragging = false; track.style.transition = '';
        const moved = startX - e.clientX;
        if(moved > 50) index = Math.min(slides.length-1, index+1);
        if(moved < -50) index = Math.max(0, index-1);
        setPosition();
    });
    window.addEventListener('pointermove', (e)=>{
        if(!isDragging) return;
        const moved = e.clientX - startX;
        track.style.transform = `translateX(${ -index * slideWidth + moved }px)`;
    });

    // responsive: recompute width on resize
    window.addEventListener('resize', ()=>{
        const w = slides[0].getBoundingClientRect().width + 20;
        // update slideWidth used by setPosition closure by replacing function
        setPosition();
    });

    // initial position
    setPosition();

})();