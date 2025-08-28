document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get("subject");
    const topic = urlParams.get("topic");
    const difficulty = urlParams.get("difficulty");

    // Fetch all questions
    const response = await fetch("../tasks.json");
    const allQuestions = await response.json();

    // Filter questions by subject, topic, difficulty
    const filtered = allQuestions.filter(q =>
        (!subject || q.subject === subject) &&
        (!topic || q.topic === topic) &&
        (!difficulty || q.difficulty === difficulty)
    );

    // Pick 10 random questions
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, 10);

    let current = 0;
    let answers = Array(questions.length).fill(null);

    const container = document.getElementById("task-container");
    if (!container) return;

    function renderTask(idx) {
        if (!questions[idx]) {
            container.innerHTML = "<p>Ingen opgave fundet.</p>";
            return;
        }
        const q = questions[idx];
        container.innerHTML = `
            <div>
                <h3>Spørgsmål ${idx + 1} af ${questions.length}</h3>
                <p>${q.question}</p>
                <label>
                    <input class="button" type="radio" name="answer" value="true" ${answers[idx] === true ? 'checked' : ''}> Sandt
                </label>
                <label>
                    <input class="button" type="radio" name="answer" value="false" ${answers[idx] === false ? 'checked' : ''}> Falsk
                </label>
                <br>
                <button class="button" id="back" ${idx === 0 ? 'disabled' : ''}>Tilbage</button>
                <button class="button" id="next">${idx === questions.length - 1 ? 'Afslut' : 'Næste'}</button>
            </div>
        `;
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', e => {
                answers[idx] = (e.target.value === "true");
            });
        });
        document.getElementById('back').onclick = () => {
            if (current > 0) {
                current--;
                renderTask(current);
            }
        };
        document.getElementById('next').onclick = () => {
            if (idx === questions.length - 1) {
                showResult();
            } else {
                current++;
                renderTask(current);
            }
        };
    }

    function showResult() {
        let correct = 0;
        for (let i = 0; i < questions.length; i++) {
            if (answers[i] === questions[i].answer) correct++;
        }
        container.innerHTML = `
            <h3>Resultat</h3>
            <p>Du svarede rigtigt på ${correct} ud af ${questions.length} spørgsmål.</p>
            <button id="retry">Prøv igen</button>
        `;
        document.getElementById('retry').onclick = () => {
            current = 0;
            answers = Array(questions.length).fill(null);
            renderTask(current);
        };
    }

    renderTask(current);
});