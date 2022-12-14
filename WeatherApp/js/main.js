const wrapper = document.querySelector('.wrapper'),
    inputGroup = wrapper.querySelector('.input-group'),
    infoText = inputGroup.querySelector('p'),
    inputField = inputGroup.querySelector('input'),
    locationBtn = inputGroup.querySelector('button'),
    weatherReport = wrapper.querySelector('.weather-report'),
    headIcon = wrapper.querySelector('header i'),
    weatherIcon = weatherReport.querySelector('img');

let apiKey = '54205b2edc8811af27bef1ec6b5819b8';

inputField.addEventListener('keyup', e => {
    if (e.key == 'Enter' && inputField.value != '') {
        requestApi(inputField.value);
    }
});

function requestApi(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    infoText.innerText = 'Getting weather details...';
    infoText.classList.add('pending');
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

headIcon.addEventListener('click', () => {
    headIcon.classList.add('d-none');
    inputGroup.classList.remove('d-none');
    weatherReport.classList.add('d-none');
    infoText.innerText = 'Please enter valid city name';
    inputField.value = null;
})

function weatherDetails(info) {
    if (info.cod == '404') {
        infoText.innerText = `'${inputField.value}' not found!`;
        infoText.classList.remove('pending');
        infoText.classList.add('error');
    }
    else {

        const city = info.name,
            country = info.sys.country,
            { description, id } = info.weather[0],
            { feels_like, humidity, temp } = info.main;

        if(id >= 200 && id <= 232){
            weatherIcon.src = 'assets/icons/thunder.svg';
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            weatherIcon.src = 'assets/icons/rainy-1.svg';
        }
        else if(id >= 600 && id <= 622){
            weatherIcon.src = 'assets/icons/snowy-1.svg';
        }
        else if((id >= 701 && id <= 781) || (id >= 801 && id <= 804)){
            weatherIcon.src = 'assets/icons/cloudy.svg';
        }
        else if(id == 800){
            weatherIcon.src = 'assets/icons/day.svg';
        }

        weatherReport.querySelector('.temp :first-child').innerText = Math.floor(temp);
        weatherReport.querySelector('.location span').innerText = `${city}, ${country}`;
        weatherReport.querySelector('.row .feels .container .details .temp :first-child').innerText = Math.floor(feels_like);
        weatherReport.querySelector('.row .humidity .container .details .d-flex span').innerText = `${humidity}%`;
        weatherReport.querySelector('p').innerText = toSentenceCase(description);

        infoText.classList.remove('error', 'pending');
        headIcon.classList.remove('d-none');
        inputGroup.classList.add('d-none');
        weatherReport.classList.remove('d-none');
    }

    console.log(info);
}


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setInterval(() => {  
        const date = new Date();
        weatherReport.querySelector('.live-clock').innerText =  `${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes()} ${date.getHours() > 12 ? 'PM' : 'AM'}`;

    }, 1000);

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }
    else {
        alert('Your broswer geolocation not supported')
    }
})

function onSucess(position) {
    //  console.log(position);

    // Get position value in similar parameters
    const { longitude, latitude } = position.coords;
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function onError(error) {
    infoText.innerText = error.message;
    infoText.classList.add('error');
    console.log(error);
}

function toSentenceCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        console.log(str[i]);
    }
    return str.join(' ');
}