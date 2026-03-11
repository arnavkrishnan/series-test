const DEGREE = ["0^\\circ", "30^\\circ", "45^\\circ", "60^\\circ", "90^\\circ", "120^\\circ", "135^\\circ", "150^\\circ", "180^\\circ", "210^\\circ", "225^\\circ", "240^\\circ", "270^\\circ", "300^\\circ", "315^\\circ", "330^\\circ"];
const RADIAN = ["0", "\\frac{1}{6}\\pi", "\\frac{1}{4}\\pi", "\\frac{1}{3}\\pi", "\\frac{1}{2}\\pi", "\\frac{2}{3}\\pi", "\\frac{3}{4}\\pi", "\\frac{5}{6}\\pi", "\\pi", "\\frac{7}{6}\\pi", "\\frac{5}{4}\\pi", "\\frac{4}{3}\\pi", "\\frac{3}{2}\\pi", "\\frac{5}{3}\\pi", "\\frac{7}{4}\\pi", "\\frac{11}{6}\\pi"];
const SIN = ["0", "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "1", "\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{1}{2}", "0", "-\\frac{1}{2}", "-\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{3}}{2}", "-1", "-\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{2}}{2}", "-\\frac{1}{2}"];
const COS = ["1", "\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{1}{2}", "0", "-\\frac{1}{2}", "-\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{3}}{2}", "-1", "-\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{2}}{2}", "-\\frac{1}{2}", "0", "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}"];
const TAN = ["0", "\\frac{\\sqrt{3}}{3}", "1", "\\sqrt{3}", "\\varnothing", "-\\sqrt{3}", "-1", "-\\frac{\\sqrt{3}}{3}", "0", "\\frac{\\sqrt{3}}{3}", "1", "\\sqrt{3}", "\\varnothing", "-\\sqrt{3}", "-1", "-\\frac{\\sqrt{3}}{3}"];

// Inverse trigonometric values
const INVERSE_SIN = ["0", "\\frac{\pi}{6}", "\\frac{\pi}{4}", "\\frac{\pi}{3}", "\\frac{\pi}{2}", "-\\frac{\pi}{3}", "-\\frac{\pi}{4}", "-\\frac{\pi}{6}", "0"];
const INVERSE_COS = ["0", "\\frac{\pi}{3}", "\\frac{\pi}{4}", "\\frac{\pi}{6}", "0", "-\\frac{\pi}{6}", "-\\frac{\pi}{4}", "-\\frac{\pi}{3}", "0"];
const INVERSE_TAN = ["0", "\\frac{\pi}{6}", "\\frac{\pi}{4}", "\\frac{\pi}{3}", "\\varnothing", "-\\frac{\pi}{3}", "-\\frac{\pi}{4}", "-\\frac{\pi}{6}", "0"];

let answer_idx = 0;
let is_handling_input = false;
let interval = null;
let streak = 0;

let TIME = 2000;

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

window.onload = () => {
    document.getElementById("config-timer").addEventListener('input', event => {
        let elem = document.getElementById("config-timer");
        let p = document.getElementById("config-timer-text");
        p.innerText = elem.value + " secs";
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

const generate_prob = (prob, ans, prefix, postfix) => {
    let problem = document.getElementById("problem");
    let i = Math.floor(Math.random() * 16);
    problem.textContent = "\\[" + prefix + prob[i] + postfix + "\\]";
    let ans_idx = Math.floor(Math.random() * 4);
    answer_idx = ans_idx;
    var buttons = document.getElementsByClassName("ans-button")
    buttons[ans_idx].textContent = "\\[" + ans[i] + "\\]";
    let used = [ans[i]];

    for (let idx = 0; idx < 4; idx++) {
        if (idx == ans_idx) {
            continue
        }
        while (used.indexOf(ans[i]) != -1) {
            i = Math.floor(Math.random() * 16);
        }
        used.push(ans[i]);
        buttons[idx].textContent = "\\[" + ans[i] + "\\]";
    }
    MathJax.typeset();
}

const generate = () => {
    let tmp = Math.random() * 12;
    if (tmp < 2) {
        generate_prob(DEGREE, RADIAN, "", "");
    } else if (tmp < 4) {
        generate_prob(RADIAN, DEGREE, "", "");
    } else if (tmp < 5) {
        generate_prob(DEGREE, SIN, "\\sin{(", ")}");
    } else if (tmp < 6) {
        generate_prob(RADIAN, SIN, "\\sin{(", ")}");
    } else if (tmp < 7) {
        generate_prob(DEGREE, COS, "\\cos{(", ")}");
    } else if (tmp < 8) {
        generate_prob(RADIAN, COS, "\\cos{(", ")}");
    } else if (tmp < 9) {
        generate_prob(DEGREE, TAN, "\\tan{(", ")}");
    } else if (tmp < 10) {
        generate_prob(RADIAN, TAN, "\\tan{(", ")}");
    } else if (tmp < 11) {
        generate_prob(DEGREE, INVERSE_SIN, "\\sin^{-1}{(", ")}");
    } else if (tmp < 12) {
        generate_prob(RADIAN, INVERSE_SIN, "\\sin^{-1}{(", ")}");
    }
    document.getElementById("streak").innerText = "Streak: " + streak;
    TIME = document.getElementById("config-timer").value * 1000;
    start_timer();
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
        await sleep(500);
        buttons[answer_idx].classList.remove("correct");
        for (var i = 0; i < 4; i++) {
            if (i == answer_idx) continue;
            buttons[i].classList.remove("wrong");
        }
    } else if (n === answer_idx) {
        streak++;
        buttons[n].classList.add("correct");
        await sleep(100);
        buttons[n].classList.remove("correct");
    } else {
        streak = 0;
        buttons[n].classList.add("wrong");
        buttons[answer_idx].classList.add("correct");
        await sleep(500);
        buttons[n].classList.remove("wrong");
        buttons[answer_idx].classList.remove("correct");
    }
    generate();
    is_handling_input = false;
}
