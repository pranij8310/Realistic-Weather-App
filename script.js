const apiKey = "9b6f739d209fd463c416ca4469271a81";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("weatherIcon");

const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const weatherInfo = document.getElementById("weatherInfo");

// Fetch weather
async function getWeather(city) {
loading.classList.remove("hidden");
errorMsg.classList.add("hidden");
weatherInfo.classList.add("hidden");

try {
const res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
);

if (!res.ok) throw new Error("City not found");

const data = await res.json();

showWeather(data);
} catch (err) {
errorMsg.classList.remove("hidden");
} finally {
loading.classList.add("hidden");
}
}

// Display weather
function showWeather(data) {
cityName.textContent = data.name;
temperature.textContent = Math.round(data.main.temp) + "°C";
condition.textContent = data.weather[0].main;
humidity.textContent = data.main.humidity + "%";
wind.textContent = data.wind.speed + " m/s";

setTheme(data.weather[0].main.toLowerCase());
setIcon(data.weather[0].main.toLowerCase());

weatherInfo.classList.remove("hidden");
}

// Change background theme
function setTheme(weather) {
document.body.className = "";

if (weather.includes("clear")) document.body.classList.add("sunny");
else if (weather.includes("rain")) document.body.classList.add("rain");
else if (weather.includes("cloud")) document.body.classList.add("clouds");
else if (weather.includes("snow")) document.body.classList.add("snow");
else document.body.classList.add("night");
}

// Animated icon
function setIcon(weather) {
if (weather.includes("clear")) icon.textContent = "☀️";
else if (weather.includes("rain")) icon.textContent = "🌧";
else if (weather.includes("cloud")) icon.textContent = "☁️";
else if (weather.includes("snow")) icon.textContent = "❄️";
else icon.textContent = "🌙";
}

// Search click
searchBtn.addEventListener("click", () => {
if (cityInput.value) getWeather(cityInput.value);
});

// Enter key support
cityInput.addEventListener("keypress", e => {
if (e.key === "Enter") getWeather(cityInput.value);
});