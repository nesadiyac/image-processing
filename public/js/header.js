const title = document.querySelector('#title_val');
if (title && title.innerHTML) {
    const link = document.getElementById(title.innerHTML);
    if (link) {
        link.classList.add("active");
    }
}