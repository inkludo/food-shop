function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {

    const modalTrigger = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => btn.addEventListener('click', () => openModal(modalSelector, modalTimerId)));

    modal.addEventListener('click', (event) => {
        if (event.target == modal || event.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });


    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', openModalByScroll);
        }
    }

    window.addEventListener('scroll', openModalByScroll);

}

export default modal;
export { openModal, closeModal };