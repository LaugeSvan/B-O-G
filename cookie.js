document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookies");
  const cookieBtn = document.getElementById("cookies-btn");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function logStats() {
    const correct = parseInt(getCookie("correctAnswers") || "0", 10);
    const wrong   = parseInt(getCookie("wrongAnswers") || "0", 10);
    const total   = correct + wrong;

      console.group("All time stats:");
    console.log("Correct answers:", correct);
    console.log("Wrong answers:", wrong);
    console.log("Sum of all answers:", total);
  }

  // Show banner if cookie not present
  if (!document.cookie.includes("cookieConsent=true")) {
    cookieBanner.style.display = "block";
  } else {
    cookieBanner.style.display = "none";
    logStats(); // log totals immediately if consent already given
  }

  // On click, fade out and set cookie
  cookieBtn.addEventListener("click", () => {
    cookieBanner.classList.add("hidden");
    cookieBanner.addEventListener("transitionend", () => {
      cookieBanner.style.display = "none";
    }, { once: true });

    document.cookie = "cookieConsent=true; path=/; max-age=2592000";
    
    // log stats now that consent is given
    logStats();
    console.log("Cookie set:", document.cookie);
  });
});
