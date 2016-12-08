'use strict';
window.onload = function() {
    checkWidth();
};
window.addEventListener('resize', function() {
    checkWidth();
});

// let addBtn = document.querySelector('.info__btn'),
//     offerSection = document.querySelector('.offer__wrap'),

let shareBtn = document.querySelector('.btn__share');

document.addEventListener('click', function(e) {
    let shareIcon = document.querySelectorAll('.timestamp__svg.share');
    // pageNote = document.querySelectorAll('.page__note'),
    // pageWrap = document.querySelector('.page__wrap');

    if (e.target == shareBtn) {
        modalWindow();
    }

    for (let i = 0; i < shareIcon.length; i++) {
        if (e.target == shareIcon[i]) {
            modalWindow();
        }
    }

    // for (let v = 0; v < pageNote.length; v++) {
    //     Array.prototype.filter.call(e.target.parentNode.children, function(child) {
    //         if (e.target == pageWrap) {

    //             pageNote[v].style.display = 'block';
    //             shareBtn.style.display = 'block';
    //             offerSection.style.display = 'block';
    //             // addBtn.style.width = '140px';
    //             pageWrap.style.height = '';
    //         }

    //         if (e.target == pageNote[v]) {
    //             offerSection.style.display = 'none';
    //             shareBtn.style.display = 'none';
    //             addBtn.style.width = '100%';
    //             pageWrap.style.minHeight = '80vh';
    //             if (child !== e.target) {
    //                 child.style.display = 'none';

    //             }
    //         }
    //     });
    // }

});


function checkWidth() {
    let logoDesc = document.querySelector('.logo__description'),
        screenWidth = window.innerWidth,
        signupLink = document.querySelector('.header-signup__link');

    if (screenWidth < 767) {
        logoDesc.innerText = 'Free on the Google Play';
        signupLink.innerText = 'sign up';
        shareBtn.style.display = 'block';
    } else if (screenWidth > 767) {
        logoDesc.innerText = 'Download it for free on the App Store';
        signupLink.innerText = 'sign up for free';
        // addBtn.style.width = '140px';
        shareBtn.style.display = 'none';

    }
    // else if (screenWidth > 1199) {
    //    offerSection.style.display = 'none';
    // }
}

function modalWindow() {
    let modalBlock = document.querySelector('.modal__block'),
        closeBtn = document.querySelector('.modal__close');

    modalBlock.style.display = 'block';
    closeBtn.addEventListener('click', function() {
        modalBlock.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
        if (e.target == modalBlock) {
            modalBlock.style.display = 'none';
        }
    });
}
