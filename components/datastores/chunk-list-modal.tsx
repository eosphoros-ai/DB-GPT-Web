import React, { useState, useEffect } from 'react';

import { Modal, Card } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import { useTranslation } from 'react-i18next';
const page_size = 20;

const ChunkListModal = (props: any) => {
  const { chunkModal = {}, setChunkModal } = props;

  const { spaceName = '', id: documentId = '' } = chunkModal;
  const [chunkList, setChunkList] = useState<any>([]);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchChunks() {
      const data = await sendSpacePostRequest(`/knowledge/${spaceName}/chunk/list`, {
        document_id: documentId,
        page: 1,
        page_size,
      });
      if (data.success) {
        console.log(data.data.data);

        setChunkList(data.data.data);
      }
    }
    fetchChunks();
  }, []);
  return (
    <Modal
      title="Basic Modal"
      open={chunkModal?.open}
      onOk={() => {
        setChunkModal({ ...chunkModal, open: false });
      }}
      onCancel={() => {
        setChunkModal({ ...chunkModal, open: false });
      }}
    >
      {chunkList?.map((item: any, index: number) => {
        return (
          <Card key={index}>
            <p>
              {t('Name')}: {item?.doc_name}
            </p>
            <p>
              {t('Content')}: {item?.content}
            </p>
            <p>
              {t('Meta_Data')}: {item?.meta_info}
            </p>
          </Card>
        );
      })}
    </Modal>
  );
};

export default ChunkListModal;
