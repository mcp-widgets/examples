import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import ProductCard from '../components/product-card';

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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  attributes?: Record<string, string>;
}

interface ProductListRenderOptions {
  products: Product[];
  title?: string;
}

/**
 * Creates a serialized JSON string of the component props
 * that can be used for client-side hydration
 */
export function createPropsJSON(options: RenderOptions): string {
  return JSON.stringify(options);
}

/**
 * Server-side renders the ProductCard component to an HTML string
 */
export function renderProductCard(product: Product): string {
  return renderToString(React.createElement(ProductCard, { product }));
}

/**
 * Creates a serialized JSON string of the component props
 * that can be used for client-side hydration
 */
export function createProductPropsJSON(product: Product): string {
  return JSON.stringify(product);
}

export function createProductListPropsJSON(
  options: ProductListRenderOptions,
): string {
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
    /* Reset styles */
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    * {
      box-sizing: border-box;
    }

    /* Product Card Styles */
    .product-card {
      background-color: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      max-width: 24rem;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Image Container */
    .image-container {
      position: relative;
      height: 16rem;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .category-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
    }
    
    .out-of-stock-overlay {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .out-of-stock-label {
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      color: white;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
    }
    
    /* Product Info */
    .info-container {
      padding: 1.25rem;
    }
    
    .product-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .rating-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .star-rating {
      display: flex;
      align-items: center;
    }
    
    .full-star {
      width: 1rem;
      height: 1rem;
      fill: #facc15;
      color: #facc15;
    }
    
    .half-star-container {
      position: relative;
    }
    
    .empty-star {
      width: 1rem;
      height: 1rem;
      color: #d1d5db;
    }
    
    .half-star {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      width: 50%;
    }
    
    .review-count {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .product-description {
      color: #4b5563;
      font-size: 0.875rem;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .price-stock-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .product-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }
    
    .stock-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 9999px;
    }
    
    .in-stock {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .out-of-stock {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    /* Attributes */
    .attributes-container {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
      margin-top: 1rem;
    }
    
    .attributes-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    
    .attributes-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 1rem;
      row-gap: 0.5rem;
      font-size: 0.875rem;
    }
    
    .attribute-item {
      grid-column: span 1 / span 1;
    }
    
    .attribute-label {
      color: #6b7280;
      text-transform: capitalize;
    }
    
    .attribute-value {
      color: #111827;
      font-weight: 500;
    }

    /* Product List Styles */
    .product-list-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-list-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 3rem;
      justify-items: center;
      row-gap: 4rem;
    }
    
    @media (max-width: 768px) {
      .product-grid {
        row-gap: 3rem;
      }
    }
  `;
}

/**
 * Creates a full HTML document with the rendered product card component and CSS
 */
export function createProductCardHTML(product: Product): string {
  const componentHTML = renderProductCard(product);
  const propsJSON = createProductPropsJSON(product);
  const cssContent = getCSS();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Product Details</title>
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

/**
 * Server-side renders a list of ProductCard components to an HTML string
 */
export function renderProductList(options: ProductListRenderOptions): string {
  const { products, title } = options;

  return renderToString(
    React.createElement(
      'div',
      { className: 'product-list-container' },
      title &&
        React.createElement('h2', { className: 'product-list-title' }, title),
      React.createElement(
        'div',
        { className: 'product-grid' },
        products.map((product) =>
          React.createElement(ProductCard, { key: product.id, product }),
        ),
      ),
    ),
  );
}

/**
 * Creates a full HTML document with the rendered product list component and CSS
 */
export function createProductListHTML(
  options: ProductListRenderOptions,
): string {
  const componentHTML = renderProductList(options);
  const propsJSON = createProductListPropsJSON(options);
  const cssContent = getCSS();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Product List</title>
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
