function handleRightClick() {
    const options = document.querySelector('.list-opiton');
    window.addEventListener('contextmenu', (e) => {
        if (e.target.matches('.cousres-card')) {
            options.style = `
            display:block;
            top: ${e.pageY}px;
            left: ${e.pageX}px;`;
            e.preventDefault();
            return false;
        }
        return false;
    });
    document.addEventListener('click', (e) => {
        options.style = `display:none`;
        return false;
    });
    return false;
}
handleRightClick();
