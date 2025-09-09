document.addEventListener("DOMContentLoaded", () => {
    const correctAnswersText = document.getElementById("correctAnsText");
    const wrongAnswersText = document.getElementById("wrongAnsText");
    const totalAnswersText = document.getElementsByClassName("totalAnsText");
    const cookieWarn = document.getElementById("cookieWarning");

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function logStats() {
        const correct = parseInt(getCookie("correctAnswers") || "0", 10);
        const wrong = parseInt(getCookie("wrongAnswers") || "0", 10);
        const total = correct + wrong;
        correctAnswersText.textContent = correct;
        wrongAnswersText.textContent = wrong;
        Array.from(totalAnswersText).forEach(element => {
            element.textContent = total;
        });
    }

    // Check cookie consent
    const cookieConsent = getCookie("cookieConsent");
    console.log("cookieConsent:", cookieConsent); // Debug cookie value
    if (cookieConsent === null || cookieConsent !== "true") {
        console.log("No consent, setting cookieWarning to firebrick");
        if (cookieWarn) {
            cookieWarn.style.color = "firebrick"; // Set warning color
            cookieWarn.title = "Cookies er slået fra for B-O-G, så dine stats kan ikke gemmes. Tryk på 'Det er fint!' nede i bunden for at aktivere cookies og gemme dine stats.";
        }
    } else {
        if (cookieWarn) {
            cookieWarn.style.color = "forestgreen"; // Set to green if cookies are enabled
            cookieWarn.title = "Dine cookies er slået til!"; // Cookies enabled tooltip
        }
        logStats();
    }
});