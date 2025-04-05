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
      args: ['-F', '@repo/mcp-server', 'run', 'mcp-server'],
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
  return response;
};
