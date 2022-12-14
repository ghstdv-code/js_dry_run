const qouteText = document.querySelector('.qoute-area p'),
qouteBtn = document.querySelector('.buttons button'),
author = document.querySelector('.author-area .name'),
btnSound = document.querySelector('.sound'),
btnCopy = document.querySelector('.copy'),
btnFbShare = document.querySelector('.fb-share');


function getRandomQoute(){
    qouteBtn.innerText = "Loading Qoute...";
    qouteBtn.classList.add('loading');
    fetch('https://api.quotable.io/random').then(res => res.json()).then(result => {
        qouteText.innerText = result.content;
        author.innerText = result.author; 
        qouteBtn.classList.remove('loading');
        qouteBtn.innerText = "New Qoute";
    });
}

qouteBtn.addEventListener('click', getRandomQoute);

btnSound.addEventListener('click', () =>{
    let utterance = new SpeechSynthesisUtterance(`${qouteText.innerText} by ${author.innerText}`);
    speechSynthesis.speak(utterance);
});

btnCopy.addEventListener('click', () =>{
    navigator.clipboard.writeText(qouteText.innerText);
});

btnFbShare.addEventListener('click', () =>{
    let fbUrl = `https://www.facebook.com/sharer/sharer.php?${qouteText.innerText};`;
    window.open(fbUrl, '_blank');
});