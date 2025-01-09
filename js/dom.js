import {geoKey, weatherKey} from './config.js';

export const handleSearch = () => {
    const searchValue = document.querySelector('.search-bar--search').value.toLowerCase();

    const geocodingApiKey = geoKey;
    const geocodingApiUrl = 'https://api.opencagedata.com/geocode/v1/json';

    const request_url = geocodingApiUrl + '?' + `key=${geocodingApiKey}` + `&q=${encodeURIComponent(searchValue)}` + '&pretty=1' + '&no_annotations=1';

    if(searchValue) {

        fetch(request_url)
        .then(res => res.json())
        .then(data => {
            const lat = data.results[0].geometry.lat;
            const long = data.results[0].geometry.lng;

            renderCurrentWeather(lat, long);
            renderforecast(lat, long);
            console.log(lat, long);
        })
        .catch(err => {
            console.log(err);
        })
    }

    else {
        console.log('Search bar cannot be empty!');
    }
    
}

const renderCurrentWeather = (latitude, longitude) => {
    const weatherApiKey = weatherKey;
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}&aqi=no`;

    const locationParentElem = document.querySelector('.current-weather--location');
    const temperatureParentElem = document.querySelector('.current-weather--temperature');
    const humidityParentElem = document.querySelector('.conditions--humidity');
    const windSpeedParentElem = document.querySelector('.conditions--wind-speed');
    const pressureParentElem = document.querySelector('.conditions--pressure');
    const uvParentElem = document.querySelector('.conditions--uv');

    locationParentElem.innerHTML = "";
    temperatureParentElem.innerHTML = "";
    humidityParentElem.innerHTML = "";
    windSpeedParentElem.innerHTML = "";
    pressureParentElem.innerHTML = "";
    uvParentElem.innerHTML = "";
    
    fetch(weatherApiUrl)
    .then(res => res.json())
    .then(data => {
        // Render location data
        const locationName = document.createElement('h2');
        locationName.classList.add('location--location');
        locationName.textContent = data.location.name;

        const locationTime = document.createElement('span');
        locationTime.classList.add('location--time')
        locationTime.textContent = data.location.localtime.split(" ")[1];

        const locationDate = document.createElement('p');
        locationDate.classList.add('location--date');
        locationDate.textContent = data.location.localtime.split(" ")[0];

        locationParentElem.appendChild(locationName);
        locationParentElem.appendChild(locationTime);
        locationParentElem.appendChild(locationDate);

        //Render Weather 

        //Temperature data 
        const iconImg = document.createElement('img');
        iconImg.src = data.current.condition.icon;
        iconImg.classList.add('current-weather--icon');

        const mainTemp = document.createElement('h1');
        mainTemp.classList.add('temperature--temperature');
        mainTemp.textContent = `Temp : ${data.current.temp_c} ° C`;

        const feelsLike = document.createElement('h2');
        feelsLike.classList.add('temperature--feels-like');
        feelsLike.textContent = `Feels Like : ${data.current.feelslike_c} ° C`;

        temperatureParentElem.appendChild(iconImg);
        temperatureParentElem.appendChild(mainTemp);
        temperatureParentElem.appendChild(feelsLike);

        //humidity

        const humidityIcon = document.createElement('i');
        humidityIcon.classList.add('fa-solid');
        humidityIcon.classList.add('fa-water');

        const humidityNumber = document.createElement('p');
        humidityNumber.classList.add('humidity--number');
        humidityNumber.textContent = `${data.current.humidity}%`;

        const humidityText = document.createElement('p');
        humidityText.classList.add('humidity--text');
        humidityText.textContent = 'Humidity';

        humidityParentElem.appendChild(humidityIcon);
        humidityParentElem.appendChild(humidityNumber);
        humidityParentElem.appendChild(humidityText);

        //wind Speed

        const windSpeedIcon = document.createElement('i');
        windSpeedIcon.classList.add('fa-solid');
        windSpeedIcon.classList.add('fa-wind');

        const windSpeedNumber = document.createElement('p');
        windSpeedNumber.classList.add('windSpeed--number');
        windSpeedNumber.textContent = `${data.current.wind_kph} km/h`;

        const windSpeedText = document.createElement('p');
        windSpeedText.classList.add('windSpeed--text');
        windSpeedText.textContent = 'Wind Speed';

        windSpeedParentElem.appendChild(windSpeedIcon);
        windSpeedParentElem.appendChild(windSpeedNumber);
        windSpeedParentElem.appendChild(windSpeedText);


        //pressure

        const pressureIcon = document.createElement('i');
        pressureIcon.classList.add('fa-solid');
        pressureIcon.classList.add('fa-gauge');

        const pressureNumber = document.createElement('p');
        pressureNumber.classList.add('pressure--number');
        pressureNumber.textContent = `${data.current.pressure_mb} hpa`;

        const pressureText = document.createElement('p');
        pressureText.classList.add('pressure--text');
        pressureText.textContent = 'Pressure';

        pressureParentElem.appendChild(pressureIcon);
        pressureParentElem.appendChild(pressureNumber);
        pressureParentElem.appendChild(pressureText);


        //uv

        const uvIcon = document.createElement('i');
        uvIcon.classList.add('fa-solid');
        uvIcon.classList.add('fa-sun');

        const uvNumber = document.createElement('p');
        uvNumber.classList.add('uv--number');
        uvNumber.textContent = `${data.current.uv}`;

        const uvText = document.createElement('p');
        uvText.classList.add('uv--text');
        uvText.textContent = 'UV';

        uvParentElem.appendChild(uvIcon);
        uvParentElem.appendChild(uvNumber);
        uvParentElem.appendChild(uvText);
    })
}


const renderforecast = (latitude, longitude) => {
    const weatherForecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${latitude},${longitude}&days=3&aqi=no&alerts=no`;

    const forecastParent = document.querySelector('.forecast--three-day')
    forecastParent.innerHTML = ''; 

    fetch(weatherForecastUrl)
    .then(res => res.json())
    .then(data => {
        const forecastDays = data.forecast.forecastday;
        const heading = document.createElement('h2');
        heading.textContent = 'Three Day Forecast';
        forecastParent.appendChild(heading);
        
        forecastDays.forEach((forecast) => {
            const parent = document.createElement('div');
            parent.classList.add('three-day--weather')

            const forecastIcon = document.createElement('img');
            forecastIcon.src = forecast.day.condition.icon;
            forecastIcon.classList.add('weather--icon');

            const forecastTemp = document.createElement('p');
            forecastTemp.classList.add('weather--temperature');
            forecastTemp.textContent = `${forecast.day.avgtemp_c}° C`;

            const forecastDate = document.createElement('p');
            forecastDate.classList.add('weather--date');
            forecastDate.textcontent = forecast.day.date;

            parent.appendChild(forecastIcon);
            parent.appendChild(forecastTemp);
            parent.appendChild(forecastDate);

            forecastParent.appendChild(parent);
            
        })
    })
}

