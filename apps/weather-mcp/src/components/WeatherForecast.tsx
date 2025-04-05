import React from 'react';
import { cn } from '../utils/cn';

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

// Helper function to get weather emoji
const getWeatherIcon = (forecast = '') => {
  const forecastLower = forecast.toLowerCase();
  
  if (forecastLower.includes('sunny') || forecastLower.includes('clear')) {
    return '☀️';
  } else if (forecastLower.includes('rain') || forecastLower.includes('shower')) {
    return '🌧️';
  } else if (forecastLower.includes('snow')) {
    return '❄️';
  } else if (forecastLower.includes('fog') || forecastLower.includes('mist')) {
    return '🌫️';
  } else if (forecastLower.includes('thunder') || forecastLower.includes('lightning')) {
    return '⚡';
  } else if (forecastLower.includes('drizzle')) {
    return '🌦️';
  } else if (forecastLower.includes('cloud')) {
    return '☁️';
  } else {
    return '🌤️';
  }
};

// Helper to get background gradient class
const getBackgroundClass = (forecast = '') => {
  const forecastLower = forecast.toLowerCase();
  
  if (forecastLower.includes('sunny') || forecastLower.includes('clear')) {
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  } else if (forecastLower.includes('rain') || forecastLower.includes('shower')) {
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  } else if (forecastLower.includes('snow')) {
    return 'bg-gradient-to-br from-blue-100 to-blue-300';
  } else if (forecastLower.includes('fog') || forecastLower.includes('mist')) {
    return 'bg-gradient-to-br from-gray-300 to-gray-500';
  } else if (forecastLower.includes('thunder') || forecastLower.includes('lightning')) {
    return 'bg-gradient-to-br from-gray-700 to-gray-900';
  } else if (forecastLower.includes('cloud')) {
    return 'bg-gradient-to-br from-gray-200 to-gray-400';
  } else {
    return 'bg-gradient-to-br from-blue-300 to-blue-500';
  }
};

// Helper to get text color class based on weather
const getTextColorClass = (forecast = '') => {
  const forecastLower = forecast.toLowerCase();
  
  if (forecastLower.includes('snow') || forecastLower.includes('cloud') || forecastLower.includes('fog')) {
    return 'text-gray-800';
  } else {
    return 'text-white';
  }
};

// Group periods by day (static approach)
const groupByDay = (periods: ForecastPeriod[]) => {
  const grouped: Record<string, ForecastPeriod[]> = {};
  
  periods.forEach(period => {
    if (!period.name) return;
    const day = period.name.split(' ')[0];
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(period);
  });
  
  return grouped;
};

export default function WeatherForecast({ latitude, longitude, periods }: WeatherForecastProps) {
  const locationName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
  const groupedPeriods = groupByDay(periods);
  const today = periods[0]?.name?.split(' ')[0] || 'Today';
  const currentPeriod = periods[0] || {};
  
  return (
    <div className="font-sans max-w-6xl mx-auto">
      {/* Header with current conditions */}
      <div className={cn(
        'rounded-xl p-6 mb-6 text-white shadow-lg', 
        getBackgroundClass(currentPeriod.shortForecast)
      )}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{locationName}</h1>
            <div className="text-xl opacity-90">{today}</div>
            <div className="mt-2 text-sm opacity-80">Weather Forecast</div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">{getWeatherIcon(currentPeriod.shortForecast)}</span>
            {currentPeriod.temperature && (
              <span className="text-3xl font-bold">
                {currentPeriod.temperature}°{currentPeriod.temperatureUnit}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="mr-1">💨</span>
            <span>{currentPeriod.windSpeed}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🧭</span>
            <span>{currentPeriod.windDirection}</span>
          </div>
          <div className="flex items-center">
            <span>{currentPeriod.shortForecast}</span>
          </div>
        </div>
      </div>
      
      {/* Forecast grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(groupedPeriods).map(([day, dayPeriods]) => {
          const period = dayPeriods[0];
          return (
            <div key={day} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className={cn(
                'p-4', 
                getBackgroundClass(period.shortForecast),
                getTextColorClass(period.shortForecast)
              )}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">{day}</h2>
                  <span className="text-3xl">{getWeatherIcon(period.shortForecast)}</span>
                </div>
                {period.temperature && (
                  <div className="mt-2 text-2xl font-bold">
                    {period.temperature}°{period.temperatureUnit}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white">
                <p className="font-medium mb-3">{period.shortForecast}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">💨</span>
                    <span>{period.windSpeed}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🧭</span>
                    <span>{period.windDirection}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Data provided by the National Weather Service API</p>
        <p className="mt-1">Updated at {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
