# AI-Powered Chat Application with MCP Widgets

Introducing Model Context Protocol (MCP) Widgets, server side rendered UI snippets that are delivered as part of the MCP response to the client application. 

This project demonstrates a modern AI chat application that uses the MCP to enable rich, interactive responses beyond just text. The application integrates specialized MCP widgets to display structured data like weather forecasts and product listings.

### Request for comments
Check out the [RFC repository](https://github.com/mcp-widgets/rfcs).

## Example video
Use the two example prompts to trigger the ecommerce or weather MCP and receive UI widgets.
https://github.com/user-attachments/assets/9f958dfb-600c-4f48-a44b-ca80cd2d4c02


## System Architecture

The application consists of three main components:

1. **AI Chatbot** - The frontend chat interface where users interact with the AI
2. **Weather MCP** - A specialized service providing weather forecasts with visual displays
3. **E-commerce MCP** - A specialized service for product discovery and browsing

## Features

### Weather MCP
- Fetch weather forecasts for any location using coordinates
- Display beautiful visual weather widgets
- Show temperature, forecast, wind conditions, and more
- Responsive design that works on mobile and desktop

### E-commerce MCP
- Product search and filtering capabilities
- Category browsing
- Product recommendations
- Interactive product cards with images, price, ratings, and availability
- Responsive grid layout for multiple products

## How It Works

This application uses the Model Context Protocol (MCP) to bridge AI models with specialized UI components:

1. User queries are sent to the AI model
2. When weather or shopping-related queries are detected, the AI invokes the appropriate MCP
3. The MCP processes the request and returns HTML/CSS rendering along with minimal text data
4. The chat interface displays the rich visual content to the user

## Configuration

### Changing AI Models

You can easily switch AI models by updating the `providers.ts` file:

```typescript
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4o'),  // Change this to use a different model
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o'),  // Change this to use a different model
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('gpt-4o'),  // Change this to use a different model
        'artifact-model': openai('gpt-4o'),  // Change this to use a different model
      },
    });
```

### API Keys

To use OpenAI models, you'll need to set up your API key:

1. Create a `.env.local` file in the root directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Development

### Starting the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building MCP Widgets

Each MCP must be built separately:

```bash
# Build the Weather MCP
cd apps/weather-mcp
npm run build

# Build the E-commerce MCP
cd apps/ecommerce-mcp
npm run build
```

## Extending the System

You can add more MCPs by:

1. Creating a new MCP service in the `apps/` directory
2. Implementing the Model Context Protocol
3. Adding visualization components
4. Registering it with the MCP clients in `apps/ai-chatbo/lib/tools

This architecture can be extended to support many types of interactive widgets beyond weather and e-commerce, such as calendars, maps, charts, and more.


### Acknowledgements

This project is heavily relying on the work the anthopic team did with the Model Context Protocol and the Vercel's team of making AI tools accessible via their [AI SDK](https://sdk.vercel.ai/docs/introduction) and their example project [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot).
