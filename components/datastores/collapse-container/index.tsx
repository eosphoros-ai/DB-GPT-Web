import React, { useEffect, useState } from 'react';
import './index.css';
import { Button, Card, Space, message } from 'antd';
import { DeleteFilled, EditFilled, InteractionFilled, PlusOutlined, ToolFilled } from '@ant-design/icons';
import ChatIcon from '@mui/icons-material/Chat';
import { sendSpacePostRequest } from '@/utils/request';
import { IKnowLedge } from '@/types/knowledge';
import moment from 'moment';
import { useRouter } from 'next/router';
import AddDocumentModal from '../add-document-modal';
import SpaceParameterModal from '../space-parm-modal';
import ChunkListModal from '../chunk-list-modal';
import { useTranslation } from 'react-i18next';

interface IProps {
  knowledge: IKnowLedge;
}
export default function CollapseContainer(props: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const page_size = 20;
  const { knowledge } = props;

  const [total, setTotal] = useState<number>(0);
  const [documents, setDocuments] = useState<any>([]);
  const [current, setCurrent] = useState<number>(0);
  const [chunkModal, setChunkModal] = useState<any>();
  const [isAddDocumentModalShow, setIsAddDocumentModalShow] = useState<boolean>(false);
  const [isParameterModalShow, setIsParameterModalShow] = useState<boolean>(false);
  async function fetchDocuments() {
    const data = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/list`, {
      page: 1,
      page_size,
    });

    if (data.success) {
      setDocuments(data.data.data);
      setTotal(data.data.total);
      setCurrent(data.data.page);
    }
  }

  const handleSync = async (row: any) => {
    const data = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/sync`, {
      doc_ids: [row.id],
    });
    if (data.success) {
      message.success('success');
    } else {
      message.error(data.err_msg || 'failed');
    }
  };

  const handleDelete = async (row: any) => {
    const res = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/delete`, {
      doc_name: row.doc_name,
    });
    if (res.success) {
      message.success('success');
      const data = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/list`, {
        page: current,
        page_size,
      });
      if (data.success) {
        setDocuments(data.data.data);
        setTotal(data.data.total);
        setCurrent(data.data.page);
      }
    } else {
      message.error(res.err_msg || 'failed');
    }
  };

  const handleChat = async () => {
    const res = await sendSpacePostRequest('/api/v1/chat/dialogue/new', {
      chat_mode: 'chat_knowledge',
    });

    if (res?.success && res?.data?.conv_uid) {
      router.push(`/chat?id=${res?.data?.conv_uid}&scene=chat_knowledge&spaceNameOriginal=${knowledge?.name}`);
    }
  };

  const handleAddDocument = () => {
    setIsAddDocumentModalShow(true);
  };

  const handleArguments = () => {
    setIsParameterModalShow(true);
  };

  useEffect(() => {
    fetchDocuments();
  }, [knowledge]);

  return (
    <Card
      extra={
        <Space>
          <Button size="small" type="primary" className="flex items-center" icon={<ChatIcon />} onClick={handleChat}>
            {t('Chat')}
          </Button>
          <Button size="small" type="primary" className="flex items-center" icon={<PlusOutlined />} onClick={handleAddDocument}>
            {t('Add_Datasource')}
          </Button>
          <Button size="small" className="flex items-center mx-2" icon={<ToolFilled />} onClick={handleArguments}>
            Arguments
          </Button>
        </Space>
      }
      className="absolute z-50 collapse-container left-0 top-0 bg-white"
    >
      <div className="knowledge-list max-h-96 overflow-y-scroll">
        {documents.map((item: any) => {
          return (
            <Card
              className="w-full"
              key={item.vector_ids}
              title={item.doc_name}
              extra={
                <>
                  <EditFilled
                    className="mr-2"
                    style={{ color: '#1b7eff' }}
                    onClick={() => {
                      setChunkModal({ spaceName: knowledge.name, open: true, id: item.id });
                    }}
                  />
                  <InteractionFilled
                    className="mr-2"
                    style={{ color: '#1b7eff' }}
                    onClick={() => {
                      handleSync(item);
                    }}
                  />
                  <DeleteFilled
                    style={{ color: '#ff1b2e' }}
                    onClick={() => {
                      handleDelete(item);
                    }}
                  />
                </>
              }
            >
              <p>
                {t('Type')}: {item.doc_type}
              </p>
              <p>
                {t('Size')}: {item.chunk_size} chunks
              </p>
              <p>
                {t('Last_Synch')}: {moment(item.last_sync).format('YYYY-MM-DD HH:MM:SS')}
              </p>
              <p>
                {t('Status')}: {item.status}
              </p>
              <p>
                {t('Result')}: {item.status}
              </p>
            </Card>
          );
        })}
      </div>
      <AddDocumentModal setIsAddDocumentModalShow={setIsAddDocumentModalShow} isAddDocumentModalShow={isAddDocumentModalShow} knowLedge={knowledge} />
      <SpaceParameterModal spaceName={knowledge} isParameterModalShow={isParameterModalShow} setIsParameterModalShow={setIsParameterModalShow} />
      {chunkModal?.open && <ChunkListModal setChunkModal={setChunkModal} chunkModal={chunkModal} />}
    </Card>
  );
}
