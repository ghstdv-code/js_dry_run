const wrapper = document.querySelector('.wrapper');
searchSection = wrapper.querySelector('.search'),
    tbSearch = searchSection.querySelector('input'),
    infoText = document.querySelector('p.info-text'),
    soundBtn = wrapper.querySelector("ul .word i");

let audio, synonyms;
// Animation Function
tbSearch.addEventListener('focus', () => {
    searchSection.classList.add('onFocus');
    searchSection.querySelector('i').classList.add('onFocus');
});

tbSearch.addEventListener('focusout', () => {
    searchSection.classList.remove('onFocus');
    searchSection.querySelector('i').classList.remove('onFocus');
});

searchSection.querySelector('span').addEventListener('click', () => {
    tbSearch.value = '';
    wrapper.classList.remove('active');
    wrapper.querySelector('ul').classList.remove('active');
    infoText.innerText = 'Type the word and press enter to see the definitions';
});

// Logic

function returnData(result, word) {

    if (result.title) {
        wrapper.classList.remove('active');
        wrapper.querySelector('ul').classList.remove('active');
        infoText.innerHTML = `Can't find the meaning of '${word}'`;
    } else {
        wrapper.classList.add('active');
        wrapper.querySelector('ul').classList.add('active');

        // console.log(result);

        let def = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text === undefined ? "" : result[0].phonetics[0].text}`;
        wrapper.querySelector('.word p').innerText = result[0].word;
        wrapper.querySelector('.word span').innerText = phonetics;

        let content = wrapper.querySelector('.content');
        content.querySelector('.meaning .details span').innerText = def.definition;

        // if (def.example === undefined) {
        //     content.querySelector('.example .details span').innerHTML = (def.example === undefined ? "<p class='errFetch'>Oppss no example found!<p>" : def.example);
        // }


        content.querySelector('.synonyms .details .list').innerHTML = '';


        audio = new Audio(result[0].phonetics[0].audio);


        let _synonyms = result[0].meanings[0].synonyms, maxIndex = _synonyms.length;
        if (maxIndex > 0) {
            for(let i = 0; i < maxIndex; i++){
                
                content.querySelector('.synonyms .details .list').innerHTML += `<span>${_synonyms[i]}${i === (maxIndex -1) ? '' : ', '}</span>`;
            }
            synonyms = document.querySelectorAll('.list span');
            addListener(synonyms);
        } else {
            content.querySelector('.synonyms .details .list').innerHTML += `<p class="errFetch">No synonyms found for '${word}'</p>`;
        }

    }
}

function fetchApi(word) {
    infoText.innerHTML = `Searching <span>${word}</span> ...`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => returnData(result, word));
}

tbSearch.addEventListener('keyup', e => {
    if (e.key === 'Enter' && e.target.value) {
        fetchApi(e.target.value);
    }
});

soundBtn.addEventListener('click', () => {
    audio.style.color = "#c31432";
    audio.play();
    setTimeout(() =>{
        audio.style.color = "#999";
    }, 800);
});


function addListener(synLinks) {
    synLinks.forEach((syn) => {
        syn.addEventListener('click', () => {
            tbSearch.value = syn.innerText.split(',')[0];
            fetchApi(tbSearch.value);
        });
    });
}
