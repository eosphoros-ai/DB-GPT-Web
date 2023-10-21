import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb, Card, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { apiInterceptors, getChunkList } from '@/client/api';
import DocIcon from '@/components/knowledge/doc-icon';

const page_size = 20;

function ChunkList() {
  const router = useRouter();
  const { t } = useTranslation();
  const [chunkList, setChunkList] = useState<any>([]);
  const {
    query: { id, knowledgeName },
  } = useRouter();
  const fetchChunks = async () => {
    const [_, data] = await apiInterceptors(
      getChunkList(knowledgeName as string, {
        document_id: id as string,
        page: 1,
        page_size,
      }),
    );
    setChunkList(data?.data);
  };
  useEffect(() => {
    knowledgeName && id && fetchChunks();
  }, [id, knowledgeName]);

  return (
    <div className="h-full overflow-y-scroll">
      <Breadcrumb
        className="m-6"
        items={[
          {
            title: 'Knowledge',
            onClick() {
              router.back();
            },
            path: '/knowledge',
          },
          {
            title: knowledgeName,
          },
        ]}
      />
      {chunkList?.length > 0 ? (
        chunkList?.map((chunk: any) => {
          return (
            <Card
              key={chunk.id}
              title={
                <>
                  <DocIcon type={chunk.doc_type} />
                  <span>{chunk.doc_name}</span>
                </>
              }
            >
              <p className="font-semibold">{t('Content')}:</p>
              <p>{chunk?.content}</p>
              <p className="font-semibold">{t('Meta_Data')}: </p>
              <p>{chunk?.meta_info}</p>
            </Card>
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT}></Empty>
      )}
    </div>
  );
}

export default ChunkList;
