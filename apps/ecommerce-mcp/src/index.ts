import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  createProductCardHTML,
  createProductListHTML,
} from './utils/renderToString';
import { Product, products } from './data/products';

// Create MCP server instance
const server = new McpServer({
  name: 'ecommerce-mcp',
  description: 'E-commerce MCP for displaying products and recommendations',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
server.tool(
  'get-product',
  'Get detailed information about a specific product',
  {
    productId: z.string().describe('ID of the product to retrieve'),
  },
  async ({ productId }: { productId: string }) => {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const html = createProductCardHTML(product);

    return {
      content: [
        {
          type: 'resource',
          resource: {
            text: JSON.stringify(product, null, 2),
            uri: `data:text/html,${encodeURIComponent(html)}`,
            mimeType: 'text/html',
          },
        },
      ],
    };
  },
);

server.tool(
  'list-products',
  'List products with optional filtering',
  {
    category: z.string().optional().describe('Filter products by category'),
    minPrice: z
      .number()
      .optional()
      .describe('Filter products by minimum price'),
    maxPrice: z
      .number()
      .optional()
      .describe('Filter products by maximum price'),
    inStock: z
      .boolean()
      .optional()
      .describe('Filter products by stock availability'),
    limit: z
      .number()
      .optional()
      .describe('Limit the number of products returned'),
    title: z.string().optional().describe('Title for the product list'),
  },
  async ({
    category,
    minPrice,
    maxPrice,
    inStock,
    limit = 10,
    title = 'Featured Products',
  }: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    limit?: number;
    title?: string;
  }) => {
    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category,
      );
    }

    if (typeof minPrice === 'number') {
      filteredProducts = filteredProducts.filter((p) => p.price >= minPrice);
    }

    if (typeof maxPrice === 'number') {
      filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);
    }

    if (typeof inStock === 'boolean') {
      filteredProducts = filteredProducts.filter((p) => p.inStock === inStock);
    }

    // Apply limit
    filteredProducts = filteredProducts.slice(0, limit);

    const html = createProductListHTML({ products: filteredProducts, title });

    return {
      content: [
        {
          type: 'resource',
          resource: {
            text: JSON.stringify(
              {
                products: filteredProducts,
                count: filteredProducts.length,
              },
              null,
              2,
            ),
            uri: `data:text/html,${encodeURIComponent(html)}`,
            mimeType: 'text/html',
          },
        },
      ],
    };
  },
);

server.tool(
  'search-products',
  'Search for products by query',
  {
    query: z.string().describe('Search query for products'),
    limit: z
      .number()
      .optional()
      .describe('Limit the number of products returned'),
  },
  async ({ query, limit = 10 }: { query: string; limit?: number }) => {
    const searchTerms = query.toLowerCase().split(' ');

    // Search in name, description, and category
    const searchResults = products.filter((product) => {
      const nameMatch = searchTerms.some((term) =>
        product.name.toLowerCase().includes(term),
      );

      const descriptionMatch = searchTerms.some((term) =>
        product.description.toLowerCase().includes(term),
      );

      const categoryMatch = searchTerms.some((term) =>
        product.category.toLowerCase().includes(term),
      );

      // Also search in attributes if available
      const attributesMatch = product.attributes
        ? Object.entries(product.attributes).some(([key, value]) =>
            searchTerms.some(
              (term) =>
                key.toLowerCase().includes(term) ||
                value.toLowerCase().includes(term),
            ),
          )
        : false;

      return nameMatch || descriptionMatch || categoryMatch || attributesMatch;
    });

    // Apply limit
    const limitedResults = searchResults.slice(0, limit);

    const html = createProductListHTML({
      products: limitedResults,
      title: `Search Results for "${query}"`,
    });

    return {
      content: [
        {
          type: 'resource',
          resource: {
            text: JSON.stringify(
              {
                products: limitedResults,
                count: limitedResults.length,
                query,
              },
              null,
              2,
            ),
            uri: `data:text/html,${encodeURIComponent(html)}`,
            mimeType: 'text/html',
          },
        },
      ],
    };
  },
);

server.tool(
  'get-recommendations',
  'Get product recommendations based on a product or category',
  {
    productId: z
      .string()
      .optional()
      .describe('ID of the product to get recommendations for'),
    category: z
      .string()
      .optional()
      .describe('Category to get recommendations from'),
    limit: z
      .number()
      .optional()
      .describe('Limit the number of recommendations'),
  },
  async ({
    productId,
    category,
    limit = 4,
  }: { productId?: string; category?: string; limit?: number }) => {
    let recommendations: Product[] = [];
    let title = 'Recommended Products';

    if (productId) {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Get products from the same category excluding the current one
      recommendations = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, limit);

      title = `Similar to ${product.name}`;
    } else if (category) {
      // Get products from the specified category
      recommendations = products
        .filter((p) => p.category === category)
        .slice(0, limit);

      title = `More from ${category}`;
    } else {
      // Get random products as recommendations
      recommendations = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
    }

    const html = createProductListHTML({ products: recommendations, title });

    return {
      content: [
        {
          type: 'resource',
          resource: {
            text: JSON.stringify(
              {
                products: recommendations,
                count: recommendations.length,
              },
              null,
              2,
            ),
            uri: `data:text/html,${encodeURIComponent(html)}`,
            mimeType: 'text/html',
          },
        },
      ],
    };
  },
);

// Start the server
const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {
    console.error('E-commerce MCP Server running on stdio');
  })
  .catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
  });
