document.addEventListener('DOMContentLoaded', () => {
    const btnTerms = document.getElementById('btn-terms');
    const btnPrivacy = document.getElementById('btn-privacy');
    const footerModalOverlay = document.getElementById('footer-modal-overlay');
    const closeFooterModal = document.getElementById('close-footer-modal');
    const footerModalIframe = document.getElementById('footer-modal-iframe');

    function openModal(url) {
        if (footerModalIframe && footerModalOverlay) {
            footerModalIframe.src = url;
            footerModalOverlay.classList.remove('hidden');
        }
    }

    function closeModal() {
        if (footerModalOverlay) {
            footerModalOverlay.classList.add('hidden');
            footerModalIframe.src = '';
        }
    }

    if (btnTerms) {
        btnTerms.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('/terms.html');
        });
    }

    if (btnPrivacy) {
        btnPrivacy.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('/privacy.html');
        });
    }

    if (closeFooterModal) {
        closeFooterModal.addEventListener('click', closeModal);
    }

    // 모달 외부 클릭 시 닫기
    if (footerModalOverlay) {
        footerModalOverlay.addEventListener('click', (e) => {
            if (e.target === footerModalOverlay) {
                closeModal();
            }
        });
    }
});
