import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "d090c101e36e949eb93baa301d047a5b"; // Replace this with your actual OpenWeatherMap API key

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);

        // Current weather data
        const weatherResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(weatherResponse.data);

        // 5-day forecast
        const forecastResponse = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const dailyForecast = forecastResponse.data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecastData(dailyForecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="app-container">
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
        className="city-input"
      />
      {loading && <p>Loading...</p>}
      {!loading && weatherData ? (
        <>
          {/* Current Weather */}
          <div className="current-weather">
            <h2>{weatherData.name}</h2>
            <p>{new Date().toLocaleDateString()}</p>
            <p className="temperature">{weatherData.main.temp}°C</p>
            <p className="condition">{weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>

          {/* 5-Day Forecast */}
          <div className="forecast">
            <h2>5-Day Forecast</h2>
            <div className="forecast-cards">
              {forecastData.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <p>{day.main.temp}°C</p>
                  <p>{day.weather[0].description}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        !loading && <p>No data available. Check your input or API key.</p>
      )}
    </div>
  );
}

export default App;
