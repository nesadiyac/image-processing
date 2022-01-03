let file;
const brightness = document.querySelector('#brightness');
document.querySelector('#upload').addEventListener('change', event => {
    file = event.target.files[0];
    const urlCreator = window.URL || window.webkitURL;
    document.getElementById("input-image").src = urlCreator.createObjectURL(file);
    document.getElementById("input-image").style.height = '50vh';
    Caman("#input-image", function () {
        this.brightness(5).render();
    });
})
brightness.addEventListener('click', e => {
    Caman("#input-image", function () {
        this.brightness(500).render();
    });
    e.preventDefault();
})
