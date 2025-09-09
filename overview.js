document.addEventListener("DOMContentLoaded", () => {
    const correctAnswersText = document.getElementById("correctAnsText");
    const wrongAnswersText = document.getElementById("wrongAnsText");
    const totalAnswersText = document.getElementsByClassName("totalAnsText");
    const cookieWarn = document.getElementById("cookieWarning");
    const praiseText = document.getElementById("praiseText");

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    function logStats() {
        const correct = parseInt(getCookie("correctAnswers") || "0", 10);
        const wrong = parseInt(getCookie("wrongAnswers") || "0", 10);
        const total = correct + wrong;

        if (correctAnswersText) correctAnswersText.textContent = correct;
        if (wrongAnswersText) wrongAnswersText.textContent = wrong;
        Array.from(totalAnswersText).forEach(element => {
            element.textContent = total;
        });

        // Praise logic
        if (correct === 0 && wrong !== 0) {
            praiseText.textContent = "Wow, så svært troede jeg altså ikke det var!";
        }
        
        else if (correct !== 0 && wrong === 0) {
            praiseText.textContent = "Fantastisk! Du har svaret rigtigt på alle spørgsmål!";
        }

        else if (correct / total >= 0.8) {
            praiseText.textContent = "Super godt klaret! Du har svaret rigtigt på over 80% af spørgsmålene!";
        }

        else {
            praiseText.textContent = "Du har ikke svaret på nogle spørgsmål endnu.";
        }
    }

    // Check cookie consent
    const cookieConsent = getCookie("cookieConsent");
    console.log("cookieConsent:", cookieConsent); // Debug cookie value
    if (cookieConsent === null || cookieConsent !== "true") {
        console.log("No consent, setting cookieWarning to firebrick");
        alert("Oversigten virker ikke hvis du ikke har slået cookies til. Hvis du ikke ved hvordan man slår cookies til, så tjek inde på 'Hjælp og tips' siden.");
        if (cookieWarn) {
            cookieWarn.style.color = "firebrick"; // Set warning color
            cookieWarn.title =
                "Cookies er slået fra for B-O-G, så dine stats kan ikke gemmes. Tryk på 'Det er fint!' nede i bunden for at aktivere cookies og gemme dine stats.";
        }
    } else {
        if (cookieWarn) {
            cookieWarn.style.color = "forestgreen"; // Set to green if cookies are enabled
            cookieWarn.title = "Dine cookies er slået til!"; // Cookies enabled tooltip
            praiseText.textContent = ""; // Clear praise text if cookies are enabled
        }
        logStats();
    }
});
