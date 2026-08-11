document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    if (menuToggle && nav) {

        menuToggle.onclick = function () {
            nav.classList.toggle("active");
        };

    }

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            alert("Thank you! Your booking request has been submitted successfully.");

            bookingForm.reset();
        });
    }

});