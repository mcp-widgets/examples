import { renderToString } from 'react-dom/server';
import WeatherForecast from '../components/WeatherForecast';
import fs from 'node:fs';
import path from 'node:path';

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface RenderOptions {
  latitude: number;
  longitude: number;
  periods: ForecastPeriod[];
}

/**
 * Server-side renders the WeatherForecast component to an HTML string
 */
export function renderWeatherForecast(options: RenderOptions): string {
  return renderToString(
    WeatherForecast({
      latitude: options.latitude,
      longitude: options.longitude,
      periods: options.periods,
    }),
  );
}

/**
 * Creates a serialized JSON string of the component props
 * that can be used for client-side hydration
 */
export function createPropsJSON(options: RenderOptions): string {
  return JSON.stringify(options);
}

/**
 * Get CSS content, either from the built file or fallback to embedded CSS
 */
function getCSS(): string {
  try {
    // Try to read the built CSS file
    const cssPath = path.join(process.cwd(), 'build', 'styles.css');
    if (fs.existsSync(cssPath)) {
      return fs.readFileSync(cssPath, 'utf8');
    }
  } catch (error) {
    console.error('Error reading CSS file:', error);
  }

  // Fallback to embedded CSS
  return `
    /* Base styles for weather widget */
    .weather-widget {
      min-height: 100vh;
      color: white;
      overflow: hidden;
    }
    
    /* Background gradients */
    .bg-gradient-day { background: linear-gradient(to bottom, #3b82f6, #60a5fa, #2563eb); }
    .bg-gradient-night { background: linear-gradient(to bottom, #111827, #1e3a8a, #111827); }
    .bg-gradient-rain { background: linear-gradient(to bottom, #374151, #4b5563, #1f2937); }
    .bg-gradient-snow { background: linear-gradient(to bottom, #9ca3af, #93c5fd, #6b7280); }
    .bg-gradient-fog { background: linear-gradient(to bottom, #6b7280, #9ca3af, #4b5563); }
    .bg-gradient-thunder { background: linear-gradient(to bottom, #1f2937, #374151, #111827); }
    .bg-gradient-cloudy { background: linear-gradient(to bottom, #6b7280, #9ca3af, #4b5563); }
    
    /* Layout elements */
    .weather-header {
      padding-top: 3rem;
      padding-bottom: 1rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      text-align: center;
    }
    
    .location-display {
      font-size: 1.875rem;
      line-height: 2.25rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .time-display {
      font-size: 1.25rem;
      line-height: 1.75rem;
      opacity: 0.9;
    }
    
    .current-weather {
      text-align: center;
      padding: 2rem 1.5rem;
    }
    
    .temperature-display {
      font-size: 4.5rem;
      line-height: 1;
      font-weight: 200;
      margin-bottom: 0.5rem;
    }
    
    .forecast-text {
      font-size: 1.5rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }
    
    .wind-info {
      display: flex;
      justify-content: center;
      gap: 1rem;
      font-size: 1.125rem;
      line-height: 1.75rem;
      opacity: 0.8;
    }
    
    .wind-item {
      display: flex;
      align-items: center;
    }
    
    .icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
    
    .icon {
      width: 2rem;
      height: 2rem;
    }
    
    .icon-sun { color: #fcd34d; }
    .icon-moon { color: #f3f4f6; }
    .icon-rain { color: #93c5fd; }
    .icon-snow { color: #e5e7eb; }
    .icon-fog { color: #d1d5db; }
    .icon-lightning { color: #fcd34d; }
    .icon-drizzle { color: #bfdbfe; }
    .icon-cloud { color: #d1d5db; }
    .icon-wind, .icon-compass {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.25rem;
    }
    
    /* Forecast section */
    .forecast-section {
      margin-top: 1.5rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .forecast-title {
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 500;
      padding-left: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .forecast-card {
      backdrop-filter: blur(4px);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      overflow: hidden;
    }
    
    .forecast-day {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
    }
    
    .forecast-day-border {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .day-abbrev {
      width: 3rem;
      text-align: center;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 500;
    }
    
    .day-icon {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 1rem;
      margin-right: 1rem;
    }
    
    .temp-range {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .temp-bar {
      display: flex;
      align-items: center;
    }
    
    .temp-bar-day {
      margin-bottom: 0.25rem;
    }
    
    .temp-bar-track {
      width: 6rem;
      height: 0.25rem;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 9999px;
      margin-right: 0.5rem;
    }
    
    .temp-bar-fill {
      height: 0.25rem;
      background-color: white;
      border-radius: 9999px;
    }
    
    .temp-value {
      width: 2rem;
      text-align: right;
      font-size: 1rem;
      line-height: 1.5rem;
    }
    
    .temp-value-night {
      opacity: 0.7;
    }
    
    /* Additional info */
    .additional-info {
      margin-top: 1.5rem;
      padding-left: 1rem;
      padding-right: 1rem;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      padding-bottom: 3rem;
    }
    
    .info-card {
      backdrop-filter: blur(4px);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 1rem;
    }
    
    .info-title {
      font-size: 1.125rem;
      line-height: 1.75rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .info-content {
      display: flex;
      align-items: center;
    }
    
    .info-value {
      margin-left: 0.5rem;
    }
    
    .info-value-primary {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 500;
    }
    
    .info-value-secondary {
      font-size: 0.875rem;
      line-height: 1.25rem;
      opacity: 0.7;
    }
    
    /* Footer */
    .footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #6b7280;
      padding-bottom: 1rem;
    }
  `;
}

/**
 * Creates a full HTML document with the rendered component and CSS
 */
export function createFullHTML(options: RenderOptions): string {
  const componentHTML = renderWeatherForecast(options);
  const propsJSON = createPropsJSON(options);
  const cssContent = getCSS();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weather Forecast</title>
        <style>
          /* Reset styles */
          body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          ${cssContent}
        </style>
      </head>
      <body>
        <div id="root">${componentHTML}</div>
        <script>
          window.__INITIAL_PROPS__ = ${propsJSON};
        </script>
      </body>
    </html>
  `;
}
