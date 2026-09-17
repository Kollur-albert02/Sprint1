// ========================================
// WEATHER - MUMBAI
// ========================================

const weatherAPI =
    "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata";

fetch(weatherAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load weather");
        }
        return response.json();
    })
    .then(data => {
        const temperature = data.current.temperature_2m;
        const weatherCode = data.current.weather_code;
        const wind = data.current.wind_speed_10m;

        let weatherDescription;

        if (weatherCode === 0) {
            weatherDescription = "☀️ Clear Sky";
        } else if (weatherCode >= 1 && weatherCode <= 3) {
            weatherDescription = "⛅ Partly Cloudy";
        } else if (weatherCode >= 51 && weatherCode <= 67) {
            weatherDescription = "🌧️ Rain";
        } else if (weatherCode >= 71 && weatherCode <= 77) {
            weatherDescription = "❄️ Snow";
        } else if (weatherCode >= 80 && weatherCode <= 82) {
            weatherDescription = "🌦️ Rain Showers";
        } else if (weatherCode >= 95) {
            weatherDescription = "⛈️ Thunderstorm";
        } else {
            weatherDescription = "🌤️ Weather conditions";
        }

        document.getElementById("weather").textContent =
            `${temperature}°C | ${weatherDescription} | Wind ${wind} km/h`;
    })
    .catch(error => {
        console.error("Weather Error:", error);
        document.getElementById("weather").textContent =
            "Weather information unavailable.";
    });


// ========================================
// EARTHQUAKES - INDIA
// ========================================

const earthquakeAPI =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

fetch(earthquakeAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load earthquake data");
        }
        return response.json();
    })
    .then(data => {
        const earthquakes = data.features;

        // =====================================
        // INDIA EARTHQUAKE FILTER
        // =====================================
        const indiaEarthquakes = earthquakes.filter(earthquake => {
            const coordinates = earthquake.geometry.coordinates;
            const longitude = coordinates[0];
            const latitude = coordinates[1];
            const location = earthquake.properties.place || "";
            const lowerLocation = location.toLowerCase();

            const insideIndiaRegion =
                longitude >= 68 &&
                longitude <= 97 &&
                latitude >= 8 &&
                latitude <= 35;

            const outsideIndia =
                lowerLocation.includes("xizang") ||
                lowerLocation.includes("tibet") ||
                lowerLocation.includes("nepal") ||
                lowerLocation.includes("pakistan") ||
                lowerLocation.includes("bangladesh") ||
                lowerLocation.includes("myanmar") ||
                lowerLocation.includes("bhutan") ||
                lowerLocation.includes("afghanistan");

            return insideIndiaRegion && !outsideIndia;
        });

        console.log("India earthquakes:", indiaEarthquakes);

        // =====================================
        // EARTHQUAKE COUNT
        // =====================================
        const count = document.getElementById("earthquake-count");
        count.textContent = indiaEarthquakes.length + " events detected";

        // =====================================
        // EARTHQUAKE CONTAINER
        // =====================================
        const container = document.getElementById("earthquake-container");
        container.innerHTML = "";

        // =====================================
        // NO EARTHQUAKES
        // =====================================
        if (indiaEarthquakes.length === 0) {
            container.innerHTML = `
                <p>
                    No earthquakes detected in India during the current feed period.
                </p>
            `;
            return;
        }

        // =====================================
        // DISPLAY LATEST 5
        // =====================================
        indiaEarthquakes.slice(0, 5).forEach(earthquake => {
            const properties = earthquake.properties;
            const magnitude = properties.mag;
            const location = properties.place;
            const time = new Date(properties.time);

            const card = document.createElement("div");
            card.className = "earthquake-card";

            card.innerHTML = `
                <h3>🌍 Magnitude ${magnitude}</h3>
                <p>📍 ${location}</p>
                <p>🕒 ${time.toLocaleString()}</p>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Earthquake Error:", error);

        document.getElementById("earthquake-container").innerHTML =
            "<p>Unable to load earthquake data.</p>";

        document.getElementById("earthquake-count").textContent =
            "Data unavailable";
    });


// ========================================
// GDACS DISASTER ALERTS - INDIA
// ========================================

const disasterAPI =
    "https://www.gdacs.org/gdacsapi/api/Events/geteventlist/latest";

fetch(disasterAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load disaster data");
        }
        return response.json();
    })
    .then(data => {
        console.log("GDACS data:", data);

        const container = document.getElementById("alerts-container");
        const alertCount = document.getElementById("alert-count");

        const events = data.features || data;

        // =====================================
        // FILTER INDIA
        // =====================================
        const indiaEvents = events.filter(event => {
            const properties = event.properties || event;
            const country = properties.country || "";
            return country.toLowerCase().includes("india");
        });

        console.log("India GDACS events:", indiaEvents);

        // =====================================
        // ALERT COUNT
        // =====================================
        alertCount.textContent = indiaEvents.length + " alerts detected";
        container.innerHTML = "";

        // =====================================
        // NO ALERTS
        // =====================================
        if (indiaEvents.length === 0) {
            container.innerHTML = `
                <p>
                    No active disaster alerts for India were found in the current feed.
                </p>
            `;
            return;
        }

        // =====================================
        // DISPLAY LATEST 5
        // =====================================
        indiaEvents.slice(0, 5).forEach(event => {
            const properties = event.properties || event;
            const card = document.createElement("div");
            card.className = "alert-card";

            const eventName =
                properties.name ||
                properties.eventname ||
                properties.eventName ||
                properties.description ||
                "Disaster Alert";

            const country = properties.country || "India";

            const alertLevel =
                properties.alertlevel ||
                properties.alertLevel ||
                "Unknown";

            card.innerHTML = `
                <h3>🚨 ${eventName}</h3>
                <p>📍 ${country}</p>
                <p>⚠️ Alert Level: ${alertLevel}</p>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error("GDACS Error:", error);

        document.getElementById("alerts-container").innerHTML = `
            <p>
                Unable to load India disaster alerts right now.
            </p>
        `;

        document.getElementById("alert-count").textContent =
            "Unable to load alerts";
    });