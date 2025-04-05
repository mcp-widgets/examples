import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Compass,
  Moon,
  Sun,
  Wind,
} from 'lucide-react';
import React from 'react';

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface WeatherForecastProps {
  latitude: number;
  longitude: number;
  periods: ForecastPeriod[];
}

// Helper function to get the appropriate weather icon based on the forecast
const getWeatherIcon = (forecast = '', isNight = false) => {
  const forecastLower = forecast.toLowerCase();

  if (forecastLower.includes('sunny') || forecastLower.includes('clear')) {
    return isNight ? (
      <Moon className="icon icon-moon" />
    ) : (
      <Sun className="icon icon-sun" />
    );
  } else if (
    forecastLower.includes('rain') ||
    forecastLower.includes('shower')
  ) {
    return <CloudRain className="icon icon-rain" />;
  } else if (forecastLower.includes('snow')) {
    return <CloudSnow className="icon icon-snow" />;
  } else if (forecastLower.includes('fog') || forecastLower.includes('mist')) {
    return <CloudFog className="icon icon-fog" />;
  } else if (
    forecastLower.includes('thunder') ||
    forecastLower.includes('lightning')
  ) {
    return <CloudLightning className="icon icon-lightning" />;
  } else if (forecastLower.includes('drizzle')) {
    return <CloudDrizzle className="icon icon-drizzle" />;
  } else {
    return <Cloud className="icon icon-cloud" />;
  }
};

// Helper function to get background class based on the forecast
const getBackgroundClass = (forecast = '', isNight = false) => {
  const forecastLower = forecast.toLowerCase();

  if (isNight) {
    return 'bg-gradient-night';
  }

  if (forecastLower.includes('sunny') || forecastLower.includes('clear')) {
    return 'bg-gradient-day';
  } else if (
    forecastLower.includes('rain') ||
    forecastLower.includes('shower')
  ) {
    return 'bg-gradient-rain';
  } else if (forecastLower.includes('snow')) {
    return 'bg-gradient-snow';
  } else if (forecastLower.includes('fog') || forecastLower.includes('mist')) {
    return 'bg-gradient-fog';
  } else if (
    forecastLower.includes('thunder') ||
    forecastLower.includes('lightning')
  ) {
    return 'bg-gradient-thunder';
  } else if (forecastLower.includes('cloud')) {
    return 'bg-gradient-cloudy';
  } else {
    return 'bg-gradient-day';
  }
};

// Helper to check if a period is at night
const isNightTime = (periodName = '') => {
  return periodName.toLowerCase().includes('night');
};

// Helper function to format the current time
const formatCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function to get the current day name
const getCurrentDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

export default function WeatherForecast({
  latitude,
  longitude,
  periods,
}: WeatherForecastProps) {
  // Get current period
  const currentPeriod = periods[0] || {};
  const isNight = isNightTime(currentPeriod.name || '');

  // Format location display
  const displayLocation = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

  // Get current time (server time)
  const timeString = formatCurrentTime();
  
  // Get current day name
  const currentDay = getCurrentDayName();

  // Group periods by day for daily forecast
  const dailyPeriods = periods.reduce(
    (acc, period) => {
      if (!period.name) return acc;

      // Extract day from period name (assuming format like "Monday Night", "Tuesday")
      const day = period.name.split(' ')[0];

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(period);
      return acc;
    },
    {} as Record<string, ForecastPeriod[]>,
  );
  
  // Get all days as an array, and skip the first one (today)
  const forecastDays = Object.entries(dailyPeriods);
  const futureDays = forecastDays.slice(1);
  
  return (
    <div className={`weather-widget ${getBackgroundClass(currentPeriod.shortForecast, isNight)}`}>
      {/* Location and Time Header */}
      <div className="weather-header">
        <h1 className="location-display">{displayLocation}</h1>
        <p className="time-display">{timeString}</p>
      </div>

      {/* Current Weather */}
      <div className="current-weather">
        <div className="icon-container">{getWeatherIcon(currentPeriod.shortForecast, isNight)}</div>
        <h2 className="temperature-display">
          {currentPeriod.temperature}°
        </h2>
        <p className="forecast-text">{currentPeriod.shortForecast}</p>

        <div className="wind-info">
          <div className="wind-item">
            <Wind className="icon-wind" />
            <span>{currentPeriod.windSpeed}</span>
          </div>
          <div className="wind-item">
            <Compass className="icon-compass" />
            <span>{currentPeriod.windDirection}</span>
          </div>
        </div>
      </div>

      {/* Multi-Day Forecast */}
      <div className="forecast-section">
        <h3 className="forecast-title">{futureDays.length} Day Forecast</h3>
        <div className="forecast-card">
          {futureDays.map(
            ([day, dayPeriods], index, array) => {
              // Use the daytime period for each day if available
              const dayPeriod =
                dayPeriods.find((p) => !isNightTime(p.name || '')) ||
                dayPeriods[0];
              const nightPeriod = dayPeriods.find((p) =>
                isNightTime(p.name || ''),
              );

              const dayTemp = dayPeriod?.temperature;
              const nightTemp = nightPeriod?.temperature;

              return (
                <div
                  key={day}
                  className={`forecast-day ${
                    index !== array.length - 1 ? 'forecast-day-border' : ''
                  }`}
                >
                  <div className="day-abbrev">
                    <p>{day}</p>
                  </div>
                  <div className="day-icon">
                    {getWeatherIcon(dayPeriod.shortForecast, false)}
                  </div>
                  <div className="temp-range">
                    <div className="temp-bar temp-bar-day">
                      <div className="temp-bar-track">
                        <div
                          className="temp-bar-fill"
                          style={{ width: '70%' }}
                        />
                      </div>
                      {dayTemp && (
                        <span className="temp-value">
                          {dayTemp}°
                        </span>
                      )}
                    </div>
                    <div className="temp-bar">
                      <div className="temp-bar-track">
                        <div
                          className="temp-bar-fill"
                          style={{ width: '40%' }}
                        />
                      </div>
                      {nightTemp && (
                        <span className="temp-value temp-value-night">
                          {nightTemp}°
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Additional Weather Info */}
      <div className="additional-info">
        <div className="info-card">
          <h4 className="info-title">Wind</h4>
          <div className="info-content">
            <Wind className="icon-wind" />
            <div className="info-value">
              <p className="info-value-primary">{currentPeriod.windSpeed}</p>
              <p className="info-value-secondary">
                {currentPeriod.windDirection}
              </p>
            </div>
          </div>
        </div>
        <div className="info-card">
          <h4 className="info-title">Feels Like</h4>
          <p className="info-value-primary">{currentPeriod.temperature}°</p>
          <p className="info-value-secondary">Similar to actual temperature</p>
        </div>
      </div>
       {/* Footer */}
      <div className="footer">
        <p>Data provided by the National Weather Service API</p>
        <p>Updated at {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
