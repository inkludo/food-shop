function slider({ container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field }) {
    const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container),
        prev = document.querySelector(prevArrow),
        next = document.querySelector(nextArrow),
        currentSlide = document.querySelector(currentCounter),
        totalSlides = document.querySelector(totalCounter),
        slidesWrapper = document.querySelector(wrapper),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector(field);

    let slideIdx = 1;
    let offset = 0;
    const dots = [];



    function addZero(data, parent) {
        if (data < 10) {
            parent.textContent = `0${data}`;
        } else {
            parent.textContent = data;
        }
    }

    function initSlidesCounter() {
        addZero(slides.length, totalSlides);
        addZero(slideIdx, currentSlide);
    }

    initSlidesCounter();

    function initSliderStyles() {
        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = 'flex';
        slidesField.style.transition = '0.5s all';

        slidesWrapper.style.overflow = 'hidden';

        slides.forEach(slide => slide.style.width = width);

        slider.style.position = 'relative';

    }


    initSliderStyles();

    //**Slider indicators */

    function createIndicators() {
        const indicators = document.createElement('ol');
        indicators.classList.add('carousel-indicators');
        slider.append(indicators);
        createDots(indicators, dots);
    }


    function createDots(indicators, arr) {
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add('dot');
            indicators.append(dot);
            if (i == 0) { dot.style.opacity = 1; }
            arr.push(dot);
        }
    }

    function changeActiveDot() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIdx - 1].style.opacity = 1;
    }

    createIndicators();

    //** */

    function removeNotDigits(str) {
        return parseInt(str.replace(/\D/g, ''));
    }

    next.addEventListener('click', () => {
        if (offset == removeNotDigits(width) * (slides.length - 1)) { //cut px from width
            offset = 0;
        } else {
            offset += removeNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIdx == slides.length) {
            slideIdx = 1;
        } else {
            slideIdx++;
        }

        addZero(slideIdx, currentSlide);
        changeActiveDot();
    });

    prev.addEventListener('click', () => {

        if (offset == 0) {
            offset += removeNotDigits(width) * (slides.length - 1);
        } else {
            offset -= removeNotDigits(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIdx == 1) {
            slideIdx = slides.length;
        } else {
            slideIdx--;
        }

        addZero(slideIdx, currentSlide);
        changeActiveDot();
    });

    function dotClickHandler() {
        dots.forEach(dot => {
            dot.addEventListener('click', e => {
                const slideTo = e.target.getAttribute('data-slide-to');

                slideIdx = slideTo;
                offset = removeNotDigits(width) * (slideTo - 1);

                slidesField.style.transform = `translateX(-${offset}px)`;

                addZero(slideIdx, currentSlide);
                changeActiveDot();
            });
        });
    }

    dotClickHandler();
}

export default slider;