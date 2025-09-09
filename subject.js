document.addEventListener("DOMContentLoaded", () => {
  // Get the subject parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

  // List of valid subject IDs
  const validSubjects = ["dk", "en", "de", "math", "404"];

  // Select the subject div to show
  let subjectToShow = "404"; // Default subject if none is specified
  if (subject && validSubjects.includes(subject)) {
    subjectToShow = subject;
  }

  // Remove 'active' class from all subject divs
  document.querySelectorAll(".subject").forEach((div) => {
    div.classList.remove("active");
  });

  // Add 'active' class to the selected subject div
  const selectedSubject = document.getElementById(subjectToShow);
  if (selectedSubject) {
    selectedSubject.classList.add("active");
  }

  // Update difficulty links if present (optional, as no such links exist in your HTML)
  const topic = urlParams.get("topic");
  document.querySelectorAll("a[data-difficulty]").forEach((link) => {
    const difficulty = link.getAttribute("data-difficulty");
    link.href = `../task/?subject=${encodeURIComponent(subject || "")}&topic=${encodeURIComponent(topic || "")}&difficulty=${encodeURIComponent(difficulty)}`;
  });
});