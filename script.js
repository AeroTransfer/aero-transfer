document.addEventListener("DOMContentLoaded", function () {

    // ===== MOBILE MENU =====
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }

    // ===== SUPABASE + EMAIL BOOKING =====

    const SUPABASE_URL = "https://bfevvtwqbfsdmpsimihg.supabase.co";
    const SUPABASE_KEY = "sb_publishable_aCUZDAl_ZLqlfyynLI0O7w_Baf_zJp8";
    const BOOKING_EMAIL = "aerotransfer001@gmail.com";

    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) {
        console.error("Booking form not found.");
        return;
    }

    const submitButton = bookingForm.querySelector(
        'button[type="submit"]'
    );

    let isSubmitting = false;

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Prevent double booking
        if (isSubmitting) {
            return;
        }

        isSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        // ===== GET FORM DATA =====

        const data = {
            name: document.getElementById("name")?.value?.trim() || "",
            phone: document.getElementById("phone")?.value?.trim() || "",
            email: document.getElementById("email")?.value?.trim() || "",
            pickup: document.getElementById("pickup")?.value?.trim() || "",
            drop: document.getElementById("drop")?.value?.trim() || "",
            date: document.getElementById("date")?.value || null,
            time: document.getElementById("time")?.value || null,
            passengers: Number(
                document.getElementById("passengers")?.value || 0
            ),
            vehicle: document.getElementById("vehicle")?.value?.trim() || "",
            flight: document.getElementById("flight")?.value?.trim() || "",
            message: document.getElementById("message")?.value?.trim() || ""
        };

        try {

            // ===== 1. SAVE TO SUPABASE =====

            const supabaseResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/bookings`,
                {
                    method: "POST",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": `Bearer ${SUPABASE_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!supabaseResponse.ok) {

                const errorText = await supabaseResponse.text();

                console.error(
                    "SUPABASE ERROR:",
                    errorText
                );

                alert(
                    "Booking save nahi hui. Please try again."
                );

                isSubmitting = false;

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Booking";
                }

                return;
            }

            console.log("SUPABASE: Booking saved successfully.");

            // ===== 2. SEND EMAIL =====

            const emailResponse = await fetch(
                `https://formsubmit.co/ajax/${BOOKING_EMAIL}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        _subject: "🚗 New AERO TRANSFER Booking",

                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        pickup: data.pickup,
                        drop: data.drop,
                        date: data.date,
                        time: data.time,
                        passengers: data.passengers,
                        vehicle: data.vehicle,
                        flight: data.flight,
                        message: data.message
                    })
                }
            );

            if (!emailResponse.ok) {

                const emailError =
                    await emailResponse.text();

                console.error(
                    "EMAIL ERROR:",
                    emailError
                );

                alert(
                    "Booking save ho gayi hai, " +
                    "lekin email send nahi hui."
                );

                bookingForm.reset();

                isSubmitting = false;

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Booking";
                }

                return;
            }

            // ===== SUCCESS =====

            console.log(
                "SUPABASE: Saved"
            );

            console.log(
                "EMAIL: Sent"
            );

            alert(
                "Booking successfully submitted! ✅"
            );

            bookingForm.reset();

            isSubmitting = false;

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Booking";
            }

        } catch (error) {

            console.error(
                "BOOKING ERROR:",
                error
            );

            alert(
                "Booking connection failed. " +
                "Please check your internet connection."
            );

            isSubmitting = false;

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Booking";
            }
        }

    });

});