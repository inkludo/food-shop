'use strict';

window.addEventListener("DOMContentLoaded", () => {

    //Tabs

    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, idx) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(idx);
                }
            });
        }
    });

    //Timer

    const deadline = '2021-07-25';

    function getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((total / (1000 * 60 * 60 * 24))),
            hours = Math.floor((total / (1000 * 60 * 60) % 24)),
            minutes = Math.floor(((total / 1000 / 60) % 60)),
            seconds = Math.floor(((total / 1000) % 60));

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInerval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInerval);
            }
        }
    }

    setClock('.timer', deadline);

    //Modal

    const modalTrigger = document.querySelectorAll("[data-modal]"),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalTrigger.forEach(btn => btn.addEventListener('click', openModal));

    modal.addEventListener('click', (event) => {
        if (event.target == modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', openModalByScroll);
        }
    }

    window.addEventListener('scroll', openModalByScroll);

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 27;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        render() {
            const elem = document.createElement('div');

            if (!this.classes.length) {
                this.classes.push('menu__item');
            }

            this.classes.forEach(className => elem.classList.add(className));

            elem.innerHTML = (`
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `);
            this.parent.append(elem);
        }
    }

    const getResources = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't not fetch ${url}, status ${res.status}`);
        }

        return await res.json();

    };

    // getResources('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({ img, altimg, title, descr, price, parent = '.menu .container' }) => {
    //             new MenuCard(img, altimg, title, descr, price, parent).render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu') //jshint ignore: line
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price, parent = '.menu .container' }) => {
                new MenuCard(img, altimg, title, descr, price, parent).render();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(form => bindPostData(form));

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = 'display: block; margin: 0 auto;';
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const data = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', data)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => showThanksModal(message.failure))
                .finally(() => form.reset());
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //**Slider */ 

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        currentSlide = document.querySelector('.offer__slider #current'),
        totalSlides = document.querySelector('.offer__slider #total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

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
            const dot = document.createElement('dot');
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


    //** */

});