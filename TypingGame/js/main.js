const textArea = document.querySelector('.typing-text p'),
    inputField = document.querySelector('.wrapper #input-field'),
    mistakeTag = document.querySelector('.mistake span'),
    timeTag = document.querySelector('.time span b'),
    wpmTag = document.querySelector('.wpm span'),
    cpmTag = document.querySelector('.cpm span'),
    tryAgain = document.querySelector('button');

let charIndex = mistake = isTyping = 0, timer, maxTime = 60, timeLeft = maxTime;

function randomParagraph() {
    let randIndex = Math.floor(Math.random() * paragraphs.length);

    textArea.innerHTML = '';
    paragraphs[randIndex].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        textArea.innerHTML += spanTag;
    });

    textArea.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => inputField.focus());
    textArea.addEventListener('click', () => inputField.focus());
}

function initTyping() {
    const char = textArea.querySelectorAll('span');
    let typedChar = inputField.value.split('')[charIndex];

    if (charIndex < char.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    timeTag.innerText = timeLeft;
                }
                else {
                    clearInterval(timer);
                }
            }, 1000);

            isTyping = true;
        }

        if (typedChar == null) {
            if (char[charIndex].classList.contains('incorrect')) {
                mistake--;
            }

            charIndex--;
            char[charIndex].classList.remove('correct', 'incorrect');
        }
        else {
            if (char[charIndex].innerText === typedChar) {
                char[charIndex].classList.add('correct');
            }
            else {
                mistake++;
                char[charIndex].classList.add('incorrect');
            }
            charIndex++;
        }

        char.forEach(span => span.classList.remove('active'));
        char[charIndex].classList.add('active');

        let wpm = Math.round((((charIndex - mistake) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;

        mistakeTag.innerText = mistake;
        cpmTag.innerText = charIndex - mistake;
    } else {
        inputField.value = '';
        clearInterval(timer);
    }
}

randomParagraph();
inputField.addEventListener('input', initTyping);

tryAgain.addEventListener('click', () => {
    randomParagraph();
    charIndex = mistake = isTyping = 0, timer, maxTime = 10;
    timeTag.innerText = 0;
    mistakeTag.innerText = mistake;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    inputField.value = '';
    clearInterval(timer);
});