import { Tool, experimental_createMCPClient as createMCPClient } from 'ai';
import { z } from 'zod';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

type ToolResponse = {
  client: unknown;
  name: string;
  toolObject: Record<string, Tool>;
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
      parameters: z.object({
        productId: z.string().describe('ID of the product to retrieve'),
      }),
    },
    'list-products': {
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
      parameters: z.object({
        query: z.string().describe('Search query for products'),
        limit: z
          .number()
          .optional()
          .describe('Limit the number of products returned'),
      }),
    },
    'get-recommendations': {
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
    });
  }
  if (selectedTools.includes('ecommerce')) {
    console.log('getting ecommerce client');
    const { client, name, toolObject } = await getEcommerceClient();
    response.push({
      client,
      name,
      toolObject,
    });
  }
  return response;
};
