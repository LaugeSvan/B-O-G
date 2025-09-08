document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookies");
  const cookieBtn = document.getElementById("cookies-btn");

  // Show banner if cookie not present
  if (!document.cookie.includes("cookieConsent=true")) {
    cookieBanner.style.display = "block";
  } else {
    cookieBanner.style.display = "none";
  }

  // On click, fade out and set cookie
  cookieBtn.addEventListener("click", () => {
    cookieBanner.classList.add("hidden");

    cookieBanner.addEventListener("transitionend", () => {
      cookieBanner.style.display = "none";
    }, { once: true });

    // Create cookie for 30 days
    document.cookie = "cookieConsent=true; path=/; max-age=2592000";
    
    // Optional: log to verify
    console.log("Cookie set:", document.cookie);
  });
});
