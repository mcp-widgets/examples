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
  'Get detailed information about a specific product. Returns HTML rendering of the product card that should be displayed to the user.',
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
            text: `${product.name} - ${product.price} ${product.currency}${!product.inStock ? ' (Out of stock)' : ''}`,
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
  'List products with optional filtering. Returns HTML rendering of products that should be displayed to the user.',
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

    console.log(
      `Available categories: ${[...new Set(products.map((p) => p.category))].join(', ')}`,
    );

    if (category) {
      // Case-insensitive category matching with normalization
      const normalizedCategory = category.toLowerCase().trim();
      console.log(`Filtering by category: ${normalizedCategory}`);

      // Handle special cases and aliases
      const categoryMap: Record<string, string[]> = {
        audio: ['audio'],
        music: ['audio'],
        sound: ['audio'],
        electronics: ['electronics', 'audio'],
        kitchen: ['home & kitchen'],
        home: ['home & kitchen', 'home & office', 'home & garden'],
        outdoors: ['sports & outdoors'],
        sports: ['sports & outdoors'],
        office: ['home & office'],
      };

      // Get the matching categories from the map or use the original
      const categoriesToMatch = categoryMap[normalizedCategory] || [
        normalizedCategory,
      ];
      console.log(`Categories to match: ${categoriesToMatch.join(', ')}`);

      filteredProducts = filteredProducts.filter((p) =>
        categoriesToMatch.some((cat) => p.category.toLowerCase().includes(cat)),
      );

      console.log(`Found ${filteredProducts.length} matching products`);
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
            text: `${title}: Found ${filteredProducts.length} products${category ? ` in category "${category}"` : ''}${typeof minPrice === 'number' || typeof maxPrice === 'number' ? ' matching your price range' : ''}`,
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
  'Search for products by query. Returns HTML rendering of matching products that should be displayed to the user.',
  {
    query: z.string().describe('Search query for products'),
    limit: z
      .number()
      .optional()
      .describe('Limit the number of products returned'),
  },
  async ({ query, limit = 10 }: { query: string; limit?: number }) => {
    const searchTerms = query.toLowerCase().split(' ');

    // Enhanced search with better matching
    const searchResults = products.filter((product) => {
      // Check if any search term is in the keywords array
      const keywordMatch = product.keywords
        ? product.keywords.some((keyword) =>
            searchTerms.some((term) => keyword.toLowerCase().includes(term)),
          )
        : false;

      // Check direct matches in text fields
      const nameMatch = searchTerms.some((term) =>
        product.name.toLowerCase().includes(term),
      );

      const descriptionMatch = searchTerms.some((term) =>
        product.description.toLowerCase().includes(term),
      );

      // Enhanced category matching - check for both exact and partial matches
      const categoryMatch = searchTerms.some((term) => {
        const category = product.category.toLowerCase();
        return (
          category.includes(term) ||
          // Map common search terms to categories
          (term === 'audio' && category === 'electronics') ||
          (term === 'sound' &&
            (category === 'audio' || category === 'electronics')) ||
          (term === 'music' && category === 'audio')
        );
      });

      // Attribute matching including attribute names
      const attributesMatch = product.attributes
        ? Object.entries(product.attributes).some(([key, value]) =>
            searchTerms.some(
              (term) =>
                key.toLowerCase().includes(term) ||
                value.toLowerCase().includes(term),
            ),
          )
        : false;

      return (
        keywordMatch ||
        nameMatch ||
        descriptionMatch ||
        categoryMatch ||
        attributesMatch
      );
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
            text: `Found ${limitedResults.length} products matching "${query}"${limitedResults.length > 0 ? `. Categories include: ${[...new Set(limitedResults.map((p) => p.category))].join(', ')}` : ''}`,
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
  'Get product recommendations based on a product or category. Returns HTML rendering of recommended products that should be displayed to the user.',
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
            text: `${title}: ${recommendations.length} recommended products${productId ? ' based on your selected item' : category ? ` in the ${category} category` : ''}`,
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
