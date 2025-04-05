import {
  type UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { getClients } from '@/lib/ai/clients';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
      selectedTools,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
      selectedTools: string[];
    } = await request.json();

    console.log('selectedTools', selectedTools);

    const session = await auth();

    /*
     * NOTE: We allow unauthenticated users to interact
     * with the chatbot so the following check is disabled.
     */

    // if (!session) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    /*
     * NOTE: We allow unauthenticated users to interact
     * but to save the chat we need to check if the user
     * is authenticated.
     */

    if (session?.user?.id) {
      const chat = await getChatById({ id });

      if (!chat) {
        const title = await generateTitleFromUserMessage({
          message: userMessage,
        });

        await saveChat({ id, userId: session.user.id, title });
      } else {
        if (chat.userId !== session.user.id) {
          return new Response('Unauthorized', { status: 401 });
        }
      }

      await saveMessages({
        messages: [
          {
            chatId: id,
            id: userMessage.id,
            role: 'user',
            parts: userMessage.parts,
            attachments: userMessage.experimental_attachments ?? [],
            createdAt: new Date(),
          },
        ],
      });
    }

    /*
     * We need to import each tool from the tools registry and add them to the tools array
     */

    console.log('selectedTools', selectedTools);

    console.log('getting clients');
    const tools = await getClients(selectedTools);

    console.log('tools', tools);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          // We are adding all tools selected by the user to the active tools array
          // so that the MCP client can use them
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'get-alerts',
                  'get-forecast',
                  'get-product',
                  'list-products',
                  'search-products',
                  'get-recommendations',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            'get-alerts': tools[0].toolObject['get-alerts'],
            'get-forecast': tools[0].toolObject['get-forecast'],
            'get-product': tools[1].toolObject['get-product'],
            'list-products': tools[1].toolObject['list-products'],
            'search-products': tools[1].toolObject['search-products'],
            'get-recommendations': tools[1].toolObject['get-recommendations'],
          },
          onFinish: async ({ response }) => {
            if (session?.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occured!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
