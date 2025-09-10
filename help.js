const helpBtn = document.getElementById("helpBtn");
const tipsBtn = document.getElementById("tipsBtn");
const helpContent = document.getElementById("helpContent");
const tipsContent = document.getElementById("tipsContent");
    
helpBtn.onclick = function() {
    if (helpContent.style.display === "none") {
        helpContent.style.display = "block";
    } else {
        helpContent.style.display = "none";
    }
};

tipsBtn.onclick = function() {
    if (tipsContent.style.display === "none") {
        tipsContent.style.display = "block";
    } else {
        tipsContent.style.display = "none";
    }
};

if (cookieDesc) {
cookieDesc.textContent = "Cookies bruges i Oversigten til at gemme dine svar. Hvis du ikke tillader cookies, kan dine svar ikke gemmes, og Oversigten vil derfor ikke fungere korrekt.";
}