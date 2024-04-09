async function fetchWeatherData() {
    const apiInfo =
      'https://api.open-meteo.com/v1/forecast?latitude=51.0501&longitude=-114.0853&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m';
    document.getElementById('loading-spinner').style.display = 'block';
    try {
      const response = await fetch(apiInfo);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayWeatherData(data.current);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      // Hide the loading spinner whether the fetch was successful or not
      document.getElementById('loading-spinner').style.display = 'none';
    }
  }
  
  function getWeatherCondition(weatherCode) {
    console.log(weatherCode);
    const weatherConditions = {
      0: { description: 'Clear sky', icon: 'fa-regular fa-sun' },
      2: {
        description: 'Partly cloudy',
        icon: 'fas fa-cloud-sun',
      },
      3: { description: 'Overcast', icon: 'fas  fa-cloud' },
      61: {
        description: 'Slight rain',
        icon: 'fas fa-cloud-rain',
      },
      65: {
        description: 'Heavy rain',
        icon: 'fas fa-cloud-showers-heavy',
      },
      71: {
        description: 'Slight snow fall',
        icon: 'fas fa-snowflake',
      },
      95: {
        description: 'Thunderstorm',
        icon: 'fas fa-bolt',
      },
    };
  
    return (
      weatherConditions[weatherCode] || {
        description: 'Unknown weather condition',
        icon: 'fa-smog',
      }
    );
  }
  
  function displayWeatherData(weather) {
    const weatherDiv = document.getElementById('weather');
    const weatherCondition = getWeatherCondition(weather.weather_code);
    const isDayIcon = weather.is_day ? 'fa-sun' : 'fa-moon';
    const isDayColor = weather.is_day ? '#F2ED6F' : '#587792';
    const isDayText = weather.is_day ? 'Day' : 'Night';
    document.body.style.backgroundColor = isDayColor;
  
    weatherDiv.innerHTML = `
      <div class="icons">
        <i class="icon fas ${isDayIcon}" style="color:  ${isDayColor}"  data-tooltip="${isDayText}"></i>
        <i class="icon ${weatherCondition.icon}" style="color:  ${isDayColor}" data-tooltip="${weatherCondition.description}"></i>
       </div>
      <div class="weather-info"><strong>Weather Condition:</strong> ${weatherCondition.description}</div>
      <div class="weather-info"><strong>Temperature:</strong> ${weather.temperature_2m}°C</div>
      <div class="weather-info"><strong>Humidity:</strong> ${weather.relative_humidity_2m}%</div>
      <div class="weather-info"><strong>Apparent Temperature:</strong> ${weather.apparent_temperature}°C</div>
      <div class="weather-info"><strong>Cloud Cover:</strong> ${weather.cloud_cover}%</div>
      <div class="weather-info"><strong>Wind Speed:</strong> ${weather.wind_speed_10m} km/h</div>
      <div class="weather-info"><strong>Wind Direction:</strong> ${weather.wind_direction_10m}°</div>
  `;
  }
  
  function applyWeatherConditionStyle(weatherCode) {
    const body = document.body;
    body.classList.remove('sunny', 'rainy', 'cloudy', 'unknown'); // Remove existing weather condition class
  
    if ([0, 1, 2].includes(weatherCode)) {
      // Sunny conditions
      body.classList.add('sunny');
    } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
      // Rainy conditions
      body.classList.add('rainy');
    } else if ([3, 45, 48].includes(weatherCode)) {
      // Cloudy / Foggy conditions
      body.classList.add('cloudy');
    } else {
      // Unknown or other conditions
      body.classList.add('unknown');
    }
  }
  
  fetchWeatherData();