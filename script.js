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


// 🌍 Initialize map ONLY ONCE
let map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker;


// 📍 Update map
function updateMap(lat, lon, city) {
  map.setView([lat, lon], 10);

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lon])
    .addTo(map)
    .bindPopup(`<b>${city}</b>`)
    .openPopup();
}


// 🌡 Display weather + CHANGE BACKGROUND
function showWeather(data) {
  cityName.textContent = data.name;
  temperature.textContent = Math.round(data.main.temp) + "°C";
  condition.textContent = data.weather[0].main;
  humidity.textContent = data.main.humidity + "%";
  wind.textContent = data.wind.speed + " m/s";

  setIcon(data.weather[0].main.toLowerCase());

  /* 🌈 Dynamic gradient background */
  const w = data.weather[0].main.toLowerCase();
  const gradient = document.querySelector(".gradient-bg");

  if (w.includes("clear"))
    gradient.style.background = "linear-gradient(45deg, #f6d365, #fda085)";
  else if (w.includes("rain"))
    gradient.style.background = "linear-gradient(45deg, #4b6cb7, #182848)";
  else if (w.includes("cloud"))
    gradient.style.background = "linear-gradient(45deg, #bdc3c7, #2c3e50)";
  else if (w.includes("snow"))
    gradient.style.background = "linear-gradient(45deg, #e6dada, #274046)";
  else
    gradient.style.background = "linear-gradient(45deg, #0f2027, #203a43, #2c5364)";

  weatherInfo.classList.remove("hidden");
}


// 🌤 Fetch weather
async function getWeather(city) {
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  weatherInfo.classList.add("hidden");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const data = await res.json();
    if (data.cod !== 200) throw new Error();

    showWeather(data);                 // ✅ IMPORTANT
    updateMap(data.coord.lat, data.coord.lon, data.name);

  } catch {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}


// 🌦 Weather icons
function setIcon(weather) {
  if (weather.includes("clear")) icon.textContent = "☀️";
  else if (weather.includes("rain")) icon.textContent = "🌧️";
  else if (weather.includes("cloud")) icon.textContent = "☁️";
  else if (weather.includes("snow")) icon.textContent = "❄️";
  else icon.textContent = "🌙";
}


// 🔍 Search
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim()) getWeather(cityInput.value.trim());
});

cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather(cityInput.value.trim());
});


// 📍 Auto-load current location
navigator.geolocation.getCurrentPosition(async position => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const data = await res.json();

    showWeather(data);
    updateMap(lat, lon, data.name);

  } catch {}
});
