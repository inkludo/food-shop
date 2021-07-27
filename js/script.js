'use strict';

import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import { openModal } from './modules/modal';

window.addEventListener("DOMContentLoaded", () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);


    calc();
    cards();
    forms('form', modalTimerId);
    modal("[data-modal]", '.modal', modalTimerId);
    slider({
        slide: '.offer__slide',
        container: '.offer__slider',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        currentCounter: '#current',
        totalCounter: '#total',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
    tabs(".tabheader__item", '.tabcontent', ".tabheader__items", 'tabheader__item_active');
    timer('.timer', '2021-07-31');
});