document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get("subject");
    const topic = urlParams.get("topic");
    const difficulty = urlParams.get("difficulty");

    // Validate params
    if (!subject || !topic || !difficulty) {
        document.getElementById("task-container").innerHTML = "<p>Mangler parametre i URL'en.</p>";
        return;
    }

    // Normalize topic
    const topicNormalized = topic.trim().toLowerCase();

    // Build path to JSON file
    const jsonPath = `/data/${subject}/${topic}/${difficulty}.json`;

    let questions = [];
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Filen blev ikke fundet.");
        questions = await response.json();
    } catch (err) {
        document.getElementById("task-container").innerHTML = `<p>Kunne ikke hente opgaver: ${err.message}</p>`;
        return;
    }

    // Fisher-Yates shuffle
    function shuffle(array) {
        let m = array.length, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            [array[m], array[i]] = [array[i], array[m]];
        }
        return array;
    }

    let selected = shuffle([...questions]).slice(0, 10);
    let current = 0;
    let answers = Array(selected.length).fill(null);
    const container = document.getElementById("task-container");
    if (!container) return;

    // Shared context for Enter/Shift+Enter/Ctrl+Enter
    let currentHandlerContext = null;

    // Global key handler
    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && currentHandlerContext) {
            e.preventDefault();

            if (e.ctrlKey) {
                showResult();
                return;
            }

            if (e.shiftKey) {
                const backBtn = document.getElementById("back");
                if (backBtn && !backBtn.disabled) backBtn.click();
            } else {
                const nextBtn = document.getElementById("next");
                if (nextBtn) nextBtn.click();
            }
        }
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/; max-age=2592000`;
    }

    function renderTask(idx) {
        if (!selected[idx]) {
            container.innerHTML = "<p>Ingen opgave fundet.</p>";
            return;
        }
        const q = selected[idx];

        // Determine input type
        let answerInputHtml = "";
        if (topicNormalized === "spelling" || topicNormalized === "numbers") {
            answerInputHtml = `
                <input 
                    type="text" 
                    id="answer-input" 
                    class="input" 
                    value="${answers[idx] !== null ? answers[idx] : ''}"
                >
            `;
        } else {
            answerInputHtml = `
                <label>
                    <input class="button" type="radio" name="answer" value="true" ${answers[idx] === true ? 'checked' : ''}> Ja
                </label>
                <label>
                    <input class="button" type="radio" name="answer" value="false" ${answers[idx] === false ? 'checked' : ''}> Nej
                </label>
            `;
        }

        container.innerHTML = `
            <div>
                <h3>Spørgsmål ${idx + 1} af ${selected.length}</h3>
                <p>${q.question}</p>
                ${answerInputHtml}
                <br>
                <button 
                    class="button" 
                    id="back" 
                    ${idx === 0 ? 'disabled' : ''} 
                    title="Tryk Shift+Enter for at gå tilbage til forrige opgave"
                >
                    Tilbage
                </button>
                <button 
                    class="button" 
                    id="next" 
                    title="Tryk Enter for at fortsætte til næste opgave, Ctrl+Enter for at afslutte"
                >
                    ${idx === selected.length - 1 ? 'Afslut' : 'Næste'}
                </button>
            </div>
        `;

        // Attach input listeners
        if (topicNormalized === "spelling" || topicNormalized === "numbers") {
            const input = document.getElementById("answer-input");
            input.focus();
            input.addEventListener("input", e => {
                answers[idx] = e.target.value;
            });
        } else {
            document.querySelectorAll('input[name="answer"]').forEach(input => {
                input.addEventListener('change', e => {
                    answers[idx] = (e.target.value === "true");
                });
            });
        }

        // Back/Next button handlers
        document.getElementById('back').onclick = () => {
            if (current > 0) {
                current--;
                renderTask(current);
            }
        };
        document.getElementById('next').onclick = () => {
            if (idx === selected.length - 1) {
                showResult();
            } else {
                current++;
                renderTask(current);
            }
        };

        // Update handler context
        currentHandlerContext = { idx };
    }

    function showResult() {
        let correct = 0;
        let resultDetails = "";

        for (let i = 0; i < selected.length; i++) {
            let wasCorrect = false;
            const userAnswer = answers[i];

            if (topicNormalized === "spelling" || topicNormalized === "numbers") {
                if (typeof userAnswer === "string" &&
                    userAnswer.trim().toLowerCase() === String(selected[i].answer).trim().toLowerCase()
                ) {
                    correct++;
                    wasCorrect = true;
                }
                resultDetails += `
                    <div>
                        <p><strong>Q${i + 1}:</strong> ${selected[i].question}</p>
                        <p>Dit svar: ${userAnswer ? userAnswer : "<em>Intet svar</em>"}</p>
                        <p>Korrekt svar: ${selected[i].answer}</p>
                        <p class="${wasCorrect ? "correct" : "wrong"}">${wasCorrect ? "✔ Rigtigt" : "✘ Forkert"}</p>
                        <hr>
                    </div>
                `;
            } else {
                if (userAnswer === selected[i].answer) {
                    correct++;
                    wasCorrect = true;
                }
                resultDetails += `
                    <div>
                        <p><strong>Q${i + 1}:</strong> ${selected[i].question}</p>
                        <p>Dit svar: ${userAnswer !== null ? userAnswer : "<em>Intet svar</em>"}</p>
                        <p>Korrekt svar: ${selected[i].answer}</p>
                        <p class="${wasCorrect ? "correct" : "wrong"}">${wasCorrect ? "✔ Rigtigt" : "✘ Forkert"}</p>
                        <hr>
                    </div>
                `;
            }
        }

        const wrong = selected.length - correct;

        // Save to cookies if consented
        if (getCookie("cookieConsent") === "true") {
            const prevCorrect = parseInt(getCookie("correctAnswers") || "0", 10);
            const prevWrong = parseInt(getCookie("wrongAnswers") || "0", 10);
            setCookie("correctAnswers", prevCorrect + correct);
            setCookie("wrongAnswers", prevWrong + wrong);
        }

        container.innerHTML = `
            <h3>Resultat</h3>
            <p>Du svarede rigtigt på ${correct} ud af ${selected.length} spørgsmål.</p>
            ${resultDetails}
            <button id="retry" title="Tryk Enter for at prøve igen">Prøv igen</button>
        `;

        document.getElementById('retry').onclick = () => {
            selected = shuffle([...questions]).slice(0, 10);
            current = 0;
            answers = Array(selected.length).fill(null);
            renderTask(current);
        };

        currentHandlerContext = null;

        // Enter key retry
        document.addEventListener("keydown", function retryHandler(e) {
            if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                document.getElementById("retry").click();
                document.removeEventListener("keydown", retryHandler);
            }
        });
    }

    renderTask(current);
});
