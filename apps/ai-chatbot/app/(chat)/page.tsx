import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // All chats are temporary by default
  const id = `temp-${generateUUID()}`;
  
  // Get model from searchParams or cookie
  const modelFromParams = searchParams.model as string;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');
  
  // Select model priority: searchParams > cookie > default
  const selectedModel = modelFromParams || modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={selectedModel}
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
