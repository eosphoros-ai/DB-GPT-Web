import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, getChunkList } from '@/client/api';
import { Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';

function ChunkContent({ chunkId }: { chunkId: number }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { dbParam } = useContext(ChatContext);
  const [content, setContent] = useState<string>('');
  async function getChunkContent() {
    setLoading(true);
    const [_, data] = await apiInterceptors(
      getChunkList(dbParam as string, {
        id: chunkId,
      }),
    );
    if (data?.data?.length) {
      setContent(data?.data[0].content);
    }
    setLoading(false);
  }
  useEffect(() => {
    getChunkContent();
    return () => {
      setContent('');
      setLoading(false);
    };
  });
  return (
    <Spin spinning={loading && !content}>
      <p className="max-w-4xl">{content}</p>
    </Spin>
  );
}

export default ChunkContent;
