async function getWeather() {

    try {

        const response =
            await fetch("/api/weather");

        const data =
            await response.json();


        /* CURRENT WEATHER */

        const current =
            data.current;


        document.getElementById("temperature").textContent =
            current.temperature_2m + "°C";


        document.getElementById("wind").textContent =
            current.wind_speed_10m;


        document.getElementById("weather").textContent =
            getWeatherDescription(current.weather_code);


        /* LOCATION */

        getLocation();


        /* WARNING */

        createWarning(current);


        /* FORECAST */

        createForecast(data.daily);


    }

    catch (error) {

        console.log(error);

        document.getElementById("weather").textContent =
            "Unable to load weather information.";

    }

}


/* GET CURRENT LOCATION */

function getLocation() {

    const locationElement =
        document.getElementById("location");


    if (!navigator.geolocation) {

        locationElement.textContent =
            "📍 Location unavailable";

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                /*
                 * Reverse geocoding converts
                 * latitude and longitude
                 * into a readable location.
                 */

                const response =
                    await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );


                const data =
                    await response.json();


                const address =
                    data.address;


                const city =
                    address.city ||
                    address.town ||
                    address.village ||
                    address.suburb ||
                    "Unknown location";


                const state =
                    address.state ||
                    "";


                locationElement.textContent =
                    `📍 ${city}${state ? ", " + state : ""}`;


            }

            catch (error) {

                console.log(error);

                locationElement.textContent =
                    `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

            }

        },


        function (error) {

            console.log(error);

            locationElement.textContent =
                "📍 Location permission denied";

        }

    );

}


/* WEATHER DESCRIPTION */

function getWeatherDescription(code) {

    if (code === 0) {
        return "☀️ Clear sky";
    }

    if (code >= 1 && code <= 3) {
        return "☁️ Partly cloudy";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️ Rain showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Weather conditions";

}


/* CREATE WARNING */

function createWarning(current) {

    const warning =
        document.getElementById("warning-text");


    if (current.precipitation >= 10) {

        warning.textContent =
            "Heavy precipitation is currently being recorded. " +
            "Residents should remain alert and follow official " +
            "local weather and emergency instructions.";

    }

    else if (current.wind_speed_10m >= 50) {

        warning.textContent =
            "Strong winds are currently being recorded. " +
            "Avoid unnecessary travel and stay away from " +
            "unsafe structures.";

    }

    else if (current.weather_code >= 95) {

        warning.textContent =
            "Thunderstorm conditions are currently being " +
            "reported. Stay indoors and avoid exposed areas.";

    }

    else {

        warning.textContent =
            "No major weather hazard detected by this " +
            "weather-data check. Continue monitoring official " +
            "emergency warnings.";

    }

}


/* CREATE FORECAST */

function createForecast(daily) {

    const container =
        document.getElementById("forecast-container");


    container.innerHTML = "";


    for (let i = 0; i < 5; i++) {

        const date =
            new Date(daily.time[i]);


        const day =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const description =
            getWeatherDescription(
                daily.weather_code[i]
            );


        const item =
            document.createElement("div");


        item.className =
            "forecast-item";


        item.innerHTML = `

            <h3>${day}</h3>

            <div class="forecast-icon">
                ${description.split(" ")[0]}
            </div>

            <p>
                ${description}
            </p>

            <p>
                🌡️ Max:
                ${daily.temperature_2m_max[i]}°C
            </p>

            <p>
                🌧️ Rain:
                ${daily.precipitation_sum[i]} mm
            </p>

        `;


        container.appendChild(item);

    }

}


/* RUN */

getWeather();