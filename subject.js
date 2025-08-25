document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");
  const topic = urlParams.get("topic");

  // find desc element
  const desc = document.getElementById("desc");
  if (!desc) {
    console.error("No element with id='desc' found!");
    // continue, don't return
  } else {
    if (subject) {
      desc.textContent = subject;
    }
  }

  if (subject) {
    const section = document.getElementById(subject);
    if (section) {
      section.classList.add("active");
    } else if (desc) {
      desc.textContent = "Unknown Subject";
    }
  }

  // Update difficulty links if present
  document.querySelectorAll('a[data-difficulty]').forEach(link => {
    const difficulty = link.getAttribute('data-difficulty');
    link.href = `../task/?subject=${encodeURIComponent(subject || "")}&topic=${encodeURIComponent(topic || "")}&difficulty=${encodeURIComponent(difficulty)}`;
  });
});
