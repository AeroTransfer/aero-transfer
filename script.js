document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".header nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }
});

// ===== SUPABASE + EMAIL BOOKING =====
const SUPABASE_URL = "https://bfevvtwqbfsdmpsimihg.supabase.co";
const SUPABASE_KEY = "sb_publishable_aCUZDAl_ZLqlfyynLI0O7w_Baf_zJp8";

// YAHAN WAHI EMAIL HAI JIS PAR FORMSUBMIT EMAIL AATI HAI
const BOOKING_EMAIL = "aerotransfer001@gmail.com";

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
if (bookingForm.dataset.bookingHandlerAttached === "true") {
    return;
}
bookingForm.dataset.bookingHandlerAttached = "true";

const submitButton = bookingForm.querySelector('button[type="submit"]');
    bookingForm.addEventListener("submit", async function (event) {
if (bookingForm.dataset.submitting === "true") {
    return;
}

bookingForm.dataset.submitting = "true";

if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
}
        event.preventDefault();

        const data = {
            name: document.getElementById("name")?.value?.trim() || "",
            phone: document.getElementById("phone")?.value?.trim() || "",
            email: document.getElementById("email")?.value?.trim() || "",
            pickup: document.getElementById("pickup")?.value?.trim() || "",
            drop: document.getElementById("drop")?.value?.trim() || "",
            date: document.getElementById("date")?.value || null,
            time: document.getElementById("time")?.value || null,
            passengers: Number(document.getElementById("passengers")?.value || 0),
            vehicle: document.getElementById("vehicle")?.value?.trim() || "",
            flight: document.getElementById("flight")?.value?.trim() || "",
            message: document.getElementById("message")?.value?.trim() || ""
        };

        try {

            // ===== 1. SAVE TO SUPABASE =====
            const response = await fetch(
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

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Supabase error:", errorText);
                alert("Booking save nahi hui.");
                return;
            }

            console.log("Supabase booking saved.");

            // ===== 2. SEND BOOKING EMAIL =====
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
                console.error(
                    "Email failed:",
                    await emailResponse.text()
                );

                alert(
                    "Booking Supabase mein save ho gayi, " +
                    "lekin email send nahi hui."
                );

                bookingForm.reset();
                return;
            }

            console.log("Booking email sent.");

            // ===== SUCCESS =====
            alert("Booking successfully submitted! ✅");
            bookingForm.reset();
bookingForm.dataset.submitting = "false";

if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Booking";
}
        } catch (error) {

            console.error("Booking error:", error);

            alert(
                "Booking connection failed. " +
                "Internet connection check karo."
            );
        }
    });
}