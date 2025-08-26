const API_KEY = "766d7141326473321e65c24a26e51ea9"; // Înlocuiește cu cheia ta reală

const translations = {
  en: {
    title: "Weather Forecast",
    placeholder: "Enter city...",
    search: "Search",
    detect: "📍 Detect Location",
    theme: "🌙 Toggle Theme",
    forecast: "5-Day Forecast",
    notFound: "City not found.",
    footer: "© 2025 Dragos | Weather App"
  },
  ro: {
    title: "Prognoza Meteo",
    placeholder: "Introdu orașul...",
    search: "Caută",
    detect: "📍 Detectează locația",
    theme: "🌙 Schimbă tema",
    forecast: "Prognoză pe 5 zile",
    notFound: "Orașul nu a fost găsit.",
    footer: "© 2025 Dragos | Aplicație Meteo"
  }
};

// Selectăm elementele din DOM
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const detectBtn = document.getElementById("detectBtn");
const toggleTheme = document.getElementById("toggleTheme");
const cityName = document.getElementById("cityName");
const weatherContainer = document.getElementById("weatherContainer");
const forecastContainer = document.getElementById("forecastContainer");
const languageSelect = document.getElementById("languageSelect");

// Actualizăm limba
function updateLanguage(lang) {
  document.querySelector("h1").textContent = translations[lang].title;
  cityInput.placeholder = translations[lang].placeholder;
  searchBtn.textContent = translations[lang].search;
  detectBtn.textContent = translations[lang].detect;
  toggleTheme.textContent = translations[lang].theme;
  document.querySelector("footer").textContent = translations[lang].footer;

  const forecastTitle = document.querySelector("#forecastContainer h3");
  if (forecastTitle) {
    forecastTitle.textContent = translations[lang].forecast;
  }
}

// Căutare manuală
searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  localStorage.setItem("preferredCity", city);
  fetchWeather(city);
  fetchForecast(city);
});

// Detectare locație
detectBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude);
  });
});

// Comutare temă
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Schimbare limbă
languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;
  localStorage.setItem("preferredLang", lang);
  updateLanguage(lang);
});

// La încărcare
window.onload = () => {
  const savedCity = localStorage.getItem("preferredCity");
  const savedLang = localStorage.getItem("preferredLang") || "en";
  languageSelect.value = savedLang;
  updateLanguage(savedLang);

  if (savedCity) {
    cityInput.value = savedCity;
    fetchWeather(savedCity);
    fetchForecast(savedCity);
  }
};

// Funcții API
function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        cityName.textContent = translations[languageSelect.value].notFound;
        weatherContainer.innerHTML = "";
        return;
      }

      cityName.textContent = data.name;
      weatherContainer.innerHTML = `
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}" />
        <p>${Math.round(data.main.temp)}°C</p>
        <p>${data.weather[0].description}</p>
      `;
    });
}

function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      forecastContainer.innerHTML = `<h3>${translations[languageSelect.value].forecast}</h3>`;
      const days = [];
      data.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        if (!days.includes(day) && days.length < 5) {
          days.push(day);
          forecastContainer.innerHTML += `
            <div class="forecast-day">
              <h4>${day}</h4>
              <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
              <p>${Math.round(item.main.temp)}°C</p>
              <p>${item.weather[0].description}</p>
            </div>
          `;
        }
      });
    });
}

function getWeatherByCoordinates(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      cityName.textContent = data.name;
      fetchWeather(data.name);
      fetchForecast(data.name);
    });
}