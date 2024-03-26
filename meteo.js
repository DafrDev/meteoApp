const conf = "conf.json";
const date = getActualDate();

displayWeather(date);

setInterval(()=>{
    const currentDate = getActualDate();
    document.querySelector(".hour").textContent = `${String(currentDate.hour).padStart(2, '0')} : ${String(currentDate.minuts).padStart(2, '0')}`;
}, 1000 - date.seconds);

setInterval(()=>{
    displayWeather(date);
},3600000 - date.seconds);

async function displayWeather(date)
{
    const confData = await getConfData(conf);
    const city = confData.city;
    const apiKey = confData.key;
    
    const cityCoordinates = await getCityCoordinates(city, apiKey);
    const weatherData = await getWeatherData(cityCoordinates, apiKey);

    document.querySelector(".city").textContent = cityCoordinates.name;
    document.querySelector(".cityState").textContent = cityCoordinates.state + ", "+ cityCoordinates.country;
    document.querySelector(".city").textContent = cityCoordinates.name;
    document.querySelector(".day").textContent = `${date.day} ${date.month} ${date.year}`;
    document.querySelector(".hour").textContent = `${String(date.hour).padStart(2, '0')} : ${String(date.minuts).padStart(2, '0')}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    document.querySelector(".weatherDescription").textContent = weatherData.weather[0].description;
    document.querySelector(".weatherTemp").textContent = Math.round(weatherData.main.temp) + "°";
}

function getActualDate()
{
    const date = new Date();
    const day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minuts = date.getMinutes();
    const seconds = date.getSeconds();

    switch(month)
    {
        case 1:
            month = "janvier"
            break;
        case 2:
            month = "février"
            break;
        case 3:
            month = "mars"
            break;
        case 4:
            month = "avril"
            break;
        case 5:
            month = "mai"
            break;
        case 6:
            month = "juin"
            break;
        case 7:
            month = "juillet"
            break;
        case 8:
            month = "août"
            break;
        case 9:
            month = "septembre"
            break;
        case 10:
            month = "octobre"
            break;
        case 11:
            month = "novembre"
            break;
        case 12:
            month = "décembre"
            break;
    }
    return {day, month, year, hour, minuts, seconds}
}

async function getConfData(conf)
{
    try 
    {
        const res = await fetch(conf);
        const data = await res.json();

        return data;
    }
    catch(error)
    {
        console.error("Error fetching config file.", error);
    }
}

async function getCityCoordinates(city, apiKey)
{
    try
    {
        const apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const resGeocoding = await fetch(apiURL);
        const geocodingData = await resGeocoding.json();
        const data = geocodingData[0];
        
        return {lat: data.lat, lon: data.lon, name: data.name, state: data.state, country: data.country};
    }
    catch(error)
    {
        console.error("Error fetching Geocoding API.", error);
    }
}

async function getWeatherData(cityCoordinates, apiKey)
{
    try
    {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lon}&appid=${apiKey}&lang=fr&units=metric`;
        const resData = await fetch(apiUrl);
        const data = await resData.json();

        return data;
    }
    catch (error)
    {
        console.error("Error fetching weather API.", error);
    }
}