// Series Convergence Tests Data
const TESTS = {
    geometric: {
        name: "Geometric Series",
        criteria: "Converges when |r| < 1, otherwise diverges",
        inconclusive: "Never inconclusive",
        whenToUse: "When series is of the form ∑arⁿ",
        commonErrors: "Forgetting to check |r|, not just r"
    },
    telescoping: {
        name: "Telescoping Series",
        criteria: "A series where its general term is the difference of two terms of a sequence",
        inconclusive: "Never inconclusive",
        whenToUse: "When terms cancel out in partial sums",
        commonErrors: "Not recognizing the telescoping pattern"
    },
    divergence: {
        name: "Test for Divergence (nth term test)",
        criteria: "Diverges if lim aₙ ≠ 0, otherwise inconclusive",
        inconclusive: "When lim aₙ = 0 (series may still diverge)",
        whenToUse: "First test to try - quick check if series diverges",
        commonErrors: "Thinking lim aₙ = 0 means convergence"
    },
    pseries: {
        name: "P-series Test",
        criteria: "∑1/nᵖ converges for p > 1, otherwise diverges",
        inconclusive: "Never inconclusive",
        whenToUse: "When series is of the form ∑1/nᵖ",
        commonErrors: "Confusing p > 1 with p ≥ 1"
    },
    integral: {
        name: "Integral Test",
        criteria: "aₙ = f(n), f(x) positive, continuous, decreasing on [1,∞). ∫₁^∞ f(x)dx converges → series converges",
        inconclusive: "When conditions not met (f not positive/continuous/decreasing)",
        whenToUse: "When you can find a function f(x) = aₙ",
        commonErrors: "Not verifying f is decreasing"
    },
    directComparison: {
        name: "Direct Comparison Test",
        criteria: "0 ≤ aₙ ≤ bₙ, bₙ converges → aₙ converges. 0 ≤ bₙ ≤ aₙ, bₙ diverges → aₙ diverges",
        inconclusive: "When inequalities don't hold",
        whenToUse: "When you can compare to known convergent/divergent series",
        commonErrors: "Wrong direction of inequality"
    },
    limitComparison: {
        name: "Limit Comparison Test",
        criteria: "aₙ, bₙ > 0. L = lim(aₙ/bₙ). L ∈ (0,∞) → both converge or diverge",
        inconclusive: "When L = 0 or L = ∞",
        whenToUse: "When direct comparison fails but limit exists",
        commonErrors: "Forgetting L must be finite positive"
    },
    ratio: {
        name: "Ratio Test",
        criteria: "L = lim|aₙ₊₁/aₙ|. L < 1 converges, L > 1 diverges, L = 1 inconclusive",
        inconclusive: "When L = 1",
        whenToUse: "When series has factorials or exponentials",
        commonErrors: "Not taking absolute value"
    },
    alternating: {
        name: "Alternating Series Test",
        criteria: "∑(-1)ⁿbₙ converges if bₙ positive, decreasing, and lim bₙ = 0",
        inconclusive: "When conditions not met (may still converge conditionally)",
        whenToUse: "When series alternates signs",
        commonErrors: "Not checking if bₙ is decreasing"
    },
    absoluteConvergence: {
        name: "Absolute Convergence Test",
        criteria: "|aₙ| converges → aₙ converges absolutely. |aₙ| diverges → inconclusive",
        inconclusive: "When |aₙ| diverges (may converge conditionally)",
        whenToUse: "When checking absolute vs conditional convergence",
        commonErrors: "Thinking divergence of |aₙ| means divergence of aₙ"
    }
};

// Question types
const QUESTION_TYPES = [
    { type: "name", question: "What is the name of this test?", getAnswer: (test) => test.name },
    { type: "criteria", question: "What is the testing criteria?", getAnswer: (test) => test.criteria },
    { type: "inconclusive", question: "When is this test inconclusive?", getAnswer: (test) => test.inconclusive },
    { type: "whenToUse", question: "When do you use this test?", getAnswer: (test) => test.whenToUse },
    { type: "commonErrors", question: "What are common errors to avoid?", getAnswer: (test) => test.commonErrors }
];

let answer_idx = 0;
let is_handling_input = false;
let interval = null;
let streak = 0;
let TIME = 10000;

document.addEventListener('keydown', event => {
    if (event.code === 'Digit1') {
        choice(0);
    }
    if (event.code === 'Digit2') {
        choice(1);
    }
    if (event.code === 'Digit3') {
        choice(2);
    }
    if (event.code === 'Digit4') {
        choice(3);
    }
});

const openReview = () => {
    const overlay = document.getElementById("review-overlay");
    const content = document.getElementById("review-content");
    content.innerHTML = Object.values(TESTS).map(test => `
        <div class="test-block">
            <div class="test-name">${test.name}</div>
            <div class="test-field"><strong>Criteria:</strong> ${test.criteria}</div>
            <div class="test-field"><strong>Inconclusive when:</strong> ${test.inconclusive}</div>
            <div class="test-field"><strong>When to use:</strong> ${test.whenToUse}</div>
            <div class="test-field"><strong>Common errors:</strong> ${test.commonErrors}</div>
        </div>
    `).join("");
    overlay.classList.add("visible");
};

const closeReview = () => {
    document.getElementById("review-overlay").classList.remove("visible");
};

window.onload = () => {
    document.getElementById("review-btn").addEventListener("click", openReview);
    document.getElementById("review-close").addEventListener("click", closeReview);
    document.getElementById("review-overlay").addEventListener("click", (e) => {
        if (e.target.id === "review-overlay") closeReview();
    });

    document.getElementById("config-timer").addEventListener('input', event => {
        let elem = document.getElementById("config-timer");
        let p = document.getElementById("config-timer-text");
        p.innerText = elem.value + " sec";
    });
    let elems = document.getElementsByClassName("ans-button");
    elems[0].addEventListener('pointerdown', event => {
        choice(0);
    });
    elems[1].addEventListener('pointerdown', event => {
        choice(1);
    });
    elems[2].addEventListener('pointerdown', event => {
        choice(2);
    });
    elems[3].addEventListener('pointerdown', event => {
        choice(3);
    });
    generate();
}

const start_timer = () => {
    let bar = document.getElementById("timer");
    bar.value = "100";
    let rem = 100.0;
    let timer = () => {
        if (rem <= 0) {
            clearInterval(interval);
            choice(null);
        } else {
            rem -= 100 / (TIME / 10);
            bar.value = rem;
        }
    }
    interval = setInterval(timer, 10);
}

const generate = () => {
    // Select random test
    const testKeys = Object.keys(TESTS);
    const randomTestKey = testKeys[Math.floor(Math.random() * testKeys.length)];
    const selectedTest = TESTS[randomTestKey];
    
    // Select random question type
    const questionType = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
    
    const correctAnswer = questionType.getAnswer(selectedTest);
    
    // Generate question text
    let questionText = "";
    if (questionType.type === "name") {
        // For name questions, show criteria
        questionText = `Test: ${selectedTest.criteria}<br><br>${questionType.question}`;
    } else {
        // For other questions, show test name
        questionText = `Test: ${selectedTest.name}<br><br>${questionType.question}`;
    }
    
    document.getElementById("problem").innerHTML = questionText;
    
    // Generate answer choices
    const buttons = document.getElementsByClassName("ans-button");
    answer_idx = Math.floor(Math.random() * 4);
    buttons[answer_idx].textContent = correctAnswer;
    
    // Generate wrong answers from other tests
    const usedAnswers = [correctAnswer];
    const otherTests = testKeys.filter(key => key !== randomTestKey);
    
    for (let idx = 0; idx < 4; idx++) {
        if (idx === answer_idx) {
            continue;
        }
        
        let wrongAnswer;
        let attempts = 0;
        do {
            const randomOtherTestKey = otherTests[Math.floor(Math.random() * otherTests.length)];
            const otherTest = TESTS[randomOtherTestKey];
            wrongAnswer = questionType.getAnswer(otherTest);
            attempts++;
        } while (usedAnswers.includes(wrongAnswer) && attempts < 50);
        
        usedAnswers.push(wrongAnswer);
        buttons[idx].textContent = wrongAnswer;
    }
    
    // Update streak display
    document.getElementById("streak").innerText = "Streak: " + streak;
    
    // Update timer
    TIME = document.getElementById("config-timer").value * 1000;
    start_timer();
    
    // Render MathJax if needed
    if (typeof MathJax !== 'undefined' && MathJax.typeset) {
        MathJax.typeset();
    }
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const choice = async (n) => {
    if (is_handling_input) return;
    is_handling_input = true;
    clearInterval(interval);
    let buttons = document.getElementsByClassName("ans-button");
    if (n === null) {
        streak = 0;
        buttons[answer_idx].classList.add("correct");
        for (var i = 0; i < 4; i++) {
            if (i == answer_idx) continue;
            buttons[i].classList.add("wrong");
        }
        await sleep(1000);
        buttons[answer_idx].classList.remove("correct");
        for (var i = 0; i < 4; i++) {
            if (i == answer_idx) continue;
            buttons[i].classList.remove("wrong");
        }
    } else if (n === answer_idx) {
        streak++;
        buttons[n].classList.add("correct");
        await sleep(300);
        buttons[n].classList.remove("correct");
    } else {
        streak = 0;
        buttons[n].classList.add("wrong");
        buttons[answer_idx].classList.add("correct");
        await sleep(1000);
        buttons[n].classList.remove("wrong");
        buttons[answer_idx].classList.remove("correct");
    }
    generate();
    is_handling_input = false;
}
