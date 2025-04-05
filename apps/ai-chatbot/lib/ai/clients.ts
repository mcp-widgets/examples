import { Tool, experimental_createMCPClient as createMCPClient } from 'ai';
import { z } from 'zod';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

type ToolResponse = {
  client: unknown;
  name: string;
  toolObject: Record<string, Tool>;
  systemMessage?: string;
};

const getWeatherClient = async () => {
  // define the schemas for the tools
  const toolSchemas = {
    'get-forecast': {
      parameters: z.object({
        latitude: z
          .number()
          .min(-90)
          .max(90)
          .describe('Latitude of the location'),
        longitude: z
          .number()
          .min(-180)
          .max(180)
          .describe('Longitude of the location'),
      }),
    },
    'get-alerts': {
      parameters: z.object({
        state: z
          .string()
          .length(2)
          .describe('Two-letter state code (e.g. CA, NY)'),
      }),
    },
  };

  // create the client
  const weatherClient = await createMCPClient({
    transport: new StdioClientTransport({
      command: 'pnpm',
      args: ['-F', '@repo/weather-mcp', 'run', 'mcp-server'],
    }),
  });

  // create the tools
  const tools = await weatherClient.tools({
    schemas: toolSchemas,
  });

  return {
    client: weatherClient,
    name: 'weather',
    toolObject: tools,
  };
};

const getEcommerceClient = async () => {
  const toolSchemas = {
    'get-product': {
      description:
        'Get detailed information about a specific product. Returns HTML rendering of the product card that should be displayed to the user.',
      parameters: z.object({
        productId: z.string().describe('ID of the product to retrieve'),
      }),
    },
    'list-products': {
      description:
        'List products with optional filtering. Returns HTML rendering of products that should be displayed to the user.',
      parameters: z.object({
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
      }),
    },
    'search-products': {
      description:
        'Search for products by query. Returns HTML rendering of matching products that should be displayed to the user.',
      parameters: z.object({
        query: z.string().describe('Search query for products'),
        limit: z
          .number()
          .optional()
          .describe('Limit the number of products returned'),
      }),
    },
    'get-recommendations': {
      description:
        'Get product recommendations based on a product or category. Returns HTML rendering of recommended products that should be displayed to the user.',
      parameters: z.object({
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
      }),
    },
  };

  const ecommerceClient = await createMCPClient({
    transport: new StdioClientTransport({
      command: 'pnpm',
      args: ['-F', '@repo/ecommerce-mcp', 'run', 'mcp-server'],
    }),
  });

  const tools = await ecommerceClient.tools({
    schemas: toolSchemas,
  });

  return {
    client: ecommerceClient,
    name: 'ecommerce',
    toolObject: tools,
  };
};

export const getClients = async (selectedTools: string[]) => {
  console.log('looking for clients');
  const response: ToolResponse[] = [];
  if (selectedTools.includes('weather')) {
    console.log('getting weather client');
    const { client, name, toolObject } = await getWeatherClient();
    response.push({
      client,
      name,
      toolObject,
      systemMessage: `The Weather MCP provides weather forecast tools that return HTML content you should show to the user.`,
    });
  }
  if (selectedTools.includes('ecommerce')) {
    console.log('getting ecommerce client');
    const { client, name, toolObject } = await getEcommerceClient();
    response.push({
      client,
      name,
      toolObject,
      systemMessage: `
The E-commerce MCP provides tools to browse and search products. All tools return HTML that you should display to the user.
The store has several product categories including: Audio, Electronics, Home & Kitchen, Sports & Outdoors, Home & Office, and Home & Garden.
The Audio category includes products like headphones, speakers, and vinyl record players for music lovers.
When using these tools, focus on helping users find products based on their needs rather than describing what you see in the HTML output.
`,
    });
  }
  return response;
};
