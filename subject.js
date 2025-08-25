document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

  // find desc element
  const desc = document.getElementById("desc");
  if (!desc) {
    console.error("No element with id='desc' found!");
    return; // stop if desc is missing
  }

  if (subject) {
    desc.textContent = subject;
  }

  if (subject) {
    const section = document.getElementById(subject);
    if (section) {
      section.classList.add("active");
    } else {
      desc.textContent = "Unknown Subject";
    }
  }
});
