document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");
  const topic = urlParams.get("topic");
  // Update difficulty links if present
  document.querySelectorAll('a[data-difficulty]').forEach(link => {
    const difficulty = link.getAttribute('data-difficulty');
    link.href = `../task/?subject=${encodeURIComponent(subject || "")}&topic=${encodeURIComponent(topic || "")}&difficulty=${encodeURIComponent(difficulty)}`;
  });
});
