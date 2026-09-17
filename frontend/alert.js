async function getWeather(latitude, longitude) {
    try {
        const response = await fetch(
            `/api/weather?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
            throw new Error("Weather API request failed");
        }

        const data = await response.json();

        console.log("Weather data:", data);

        const current = data.current;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        document.getElementById("wind").textContent =
            `💨 Wind: ${current.wind_speed_10m} km/h`;

        document.getElementById("weather").textContent =
            getWeatherDescription(current.weather_code);

        createWarning(current);
        createForecast(data.daily);

    } catch (error) {
        console.error("Weather error:", error);

        document.getElementById("temperature").textContent =
            "Weather unavailable";

        document.getElementById("weather").textContent =
            "Unable to load weather information.";

        document.getElementById("wind").textContent =
            "💨 Wind: Unavailable";
    }
}


function getLocation() {

    if (!navigator.geolocation) {
        console.log("Geolocation not supported. Using Mumbai.");
        useDefaultLocation();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Location detected:", latitude, longitude);

            // Show coordinates immediately
            document.getElementById("location").textContent =
                `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

            // Get weather using detected coordinates
            await getWeather(latitude, longitude);

            // Try reverse geocoding separately
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );

                const data = await response.json();

                if (data.address) {

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.suburb ||
                        "Your Location";

                    const state =
                        data.address.state || "";

                    document.getElementById("location").textContent =
                        `${city}${state ? ", " + state : ""}`;
                }

            } catch (error) {
                console.log("Location name lookup failed:", error);
            }
        },

        function (error) {

            console.log("Geolocation failed:", error.message);

            // If browser location is unavailable,
            // use Mumbai as fallback
            useDefaultLocation();
        }
    );
}


function useDefaultLocation() {

    const latitude = 19.0760;
    const longitude = 72.8777;

    document.getElementById("location").textContent =
        "Mumbai, Maharashtra";

    getWeather(latitude, longitude);
}


function getWeatherDescription(code) {

    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    return descriptions[code] || "Unknown weather";
}


function createWarning(current) {

    const warningText = document.getElementById("warning-text");

    if (current.precipitation >= 10) {

        warningText.textContent =
            "⚠️ Heavy precipitation detected. Please stay alert.";

    } else if (current.wind_speed_10m >= 50) {

        warningText.textContent =
            "⚠️ Strong winds detected. Please take necessary precautions.";

    } else if (current.weather_code >= 95) {

        warningText.textContent =
            "⚠️ Thunderstorm detected. Please stay indoors.";

    } else {

        warningText.textContent =
            "✅ No severe weather conditions detected.";
    }
}


function createForecast(daily) {

    const container =
        document.getElementById("forecast-container");

    container.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${daily.time[i]}</h3>
            <p>🌡️ Max: ${daily.temperature_2m_max[i]} °C</p>
            <p>🌧️ Rain: ${daily.precipitation_sum[i]} mm</p>
            <p>💨 Wind: ${daily.wind_speed_10m_max[i]} km/h</p>
            <p>${getWeatherDescription(daily.weather_code[i])}</p>
        `;

        container.appendChild(card);
    }
}


// Start the weather system
getLocation();
