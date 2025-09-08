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

    const selected = shuffle([...questions]).slice(0, 10);

    let current = 0;
    let answers = Array(selected.length).fill(null);

    const container = document.getElementById("task-container");
    if (!container) return;

    // shared context for Enter/Shift+Enter/Ctrl+Enter
    let currentHandlerContext = null;

    // one global key handler
    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && currentHandlerContext) {
            e.preventDefault();

            if (e.ctrlKey) {
                // Ctrl+Enter = finish immediately
                showResult();
                return;
            }

            if (e.shiftKey) {
                // Shift+Enter = back
                const backBtn = document.getElementById("back");
                if (backBtn && !backBtn.disabled) backBtn.click();
            } else {
                // Enter = next
                const nextBtn = document.getElementById("next");
                if (nextBtn) nextBtn.click();
            }
        }
    });

    function renderTask(idx) {
        if (!selected[idx]) {
            container.innerHTML = "<p>Ingen opgave fundet.</p>";
            return;
        }
        const q = selected[idx];

        let answerInputHtml = "";
        if (topic === "spelling") {
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
                    title="Genvej: Shift+Enter"
                >
                    Tilbage
                </button>
                <button 
                    class="button" 
                    id="next" 
                    title="${idx === selected.length - 1 ? 'Genvej: Ctrl+Enter' : 'Tryk Enter for at fortsætte til næste opgave, Ctrl+Enter for at afslutte'}"
                >
                    ${idx === selected.length - 1 ? 'Afslut' : 'Næste'}
                </button>
            </div>
        `;

        if (topic === "spelling") {
            const input = document.getElementById("answer-input");
            input.focus(); // auto-focus spelling box
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

        // update handler context for Enter logic
        currentHandlerContext = { idx };
    }

    function showResult() {
        let correct = 0;
        let resultDetails = "";

        for (let i = 0; i < selected.length; i++) {
            let wasCorrect = false;

            if (topic === "spelling") {
                if (
                    typeof answers[i] === "string" &&
                    answers[i].trim().toLowerCase() === String(selected[i].answer).trim().toLowerCase()
                ) {
                    correct++;
                    wasCorrect = true;
                }

                resultDetails += `
                    <div>
                        <p><strong>Q${i + 1}:</strong> ${selected[i].question}</p>
                        <p>Dit svar: ${answers[i] ? answers[i] : "<em>Intet svar</em>"}</p>
                        <p>Korrekt svar: ${selected[i].answer}</p>
                        <p class="${wasCorrect ? "correct" : "wrong"}">
                            ${wasCorrect ? "✔ Rigtigt" : "✘ Forkert"}
                        </p>
                        <hr>
                    </div>
                `;
            } else {
                if (answers[i] === selected[i].answer) {
                    correct++;
                    wasCorrect = true;
                }

                resultDetails += `
                    <div>
                        <p><strong>Q${i + 1}:</strong> ${selected[i].question}</p>
                        <p>Dit svar: ${answers[i]}</p>
                        <p>Korrekt svar: ${selected[i].answer}</p>
                        <p class="${wasCorrect ? "correct" : "wrong"}">
                            ${wasCorrect ? "✔ Rigtigt" : "✘ Forkert"}
                        </p>
                        <hr>
                    </div>
                `;
            }
        }

        container.innerHTML = `
            <h3>Resultat</h3>
            <p>Du svarede rigtigt på ${correct} ud af ${selected.length} spørgsmål.</p>
            ${resultDetails}
            <button id="retry" title="Genvej: Enter">Prøv igen</button>
        `;

        document.getElementById('retry').onclick = () => {
            current = 0;
            answers = Array(selected.length).fill(null);
            renderTask(current);
        };

        // clear context so Enter doesn't try to click hidden buttons
        currentHandlerContext = null;
    }

    renderTask(current);
});
