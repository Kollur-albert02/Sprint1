const express=require('express');
const path=require('path');
const app=express();  //creates an Express application object
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','home.html'))
});

app.get('/api/weather', async (req, res) => {

    try {

        const latitude = req.query.latitude;
        const longitude = req.query.longitude;


        if (!latitude || !longitude) {

            return res.status(400).json({
                error: 'Location is required'
            });

        }

        const response = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
                params: {
                    latitude: latitude,
                    longitude: longitude,

                    current:
                        'temperature_2m,precipitation,rain,weather_code,wind_speed_10m',

                    daily:
                        'weather_code,temperature_2m_max,precipitation_sum,wind_speed_10m_max',

                    timezone: 'Asia/Kolkata',
                         forecast_days: 5
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error:'unable to get weather data'
        });
    }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

});
