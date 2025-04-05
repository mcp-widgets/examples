import { renderToString } from 'react-dom/server';
import WeatherForecast from '../components/WeatherForecast';

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
 * Creates a full HTML document with the rendered component and Tailwind CSS
 */
export function createFullHTML(options: RenderOptions): string {
  const componentHTML = renderWeatherForecast(options);
  const propsJSON = createPropsJSON(options);

  // Embedding styles directly for demonstration purposes
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weather Forecast</title>
        <style>
          ${
            process.env.NODE_ENV === 'production'
              ? '@import "tailwindcss/base"; @import "tailwindcss/components"; @import "tailwindcss/utilities";'
              : '@import "tailwindcss";'
          }
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
