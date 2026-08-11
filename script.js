document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    if (menuToggle && nav) {

        menuToggle.onclick = function () {
            nav.classList.toggle("active");
        };

    }