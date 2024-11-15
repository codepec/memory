function openModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <span id="close-modal">&times;</span>
        ${content}
    `;

    modal.style.display = 'block';

    document.getElementById('close-modal').onclick = closeModal;

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
