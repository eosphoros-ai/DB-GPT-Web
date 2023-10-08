import React, { useEffect, useState } from 'react';
import './index.css';
import { Button, Card, message, Space, Divider, Empty, Spin, Tag, Tooltip } from 'antd';
import {
  DeleteFilled,
  EditFilled,
  InteractionFilled,
  PlusOutlined,
  ToolFilled,
  MessageTwoTone,
  FileTextFilled,
  FileWordTwoTone,
  IeCircleFilled,
  EyeFilled,
} from '@ant-design/icons';
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [documents, setDocuments] = useState<any>([]);
  const [current, setCurrent] = useState<number>(0);
  const [chunkModal, setChunkModal] = useState<any>();
  const [isAddDocumentModalShow, setIsAddDocumentModalShow] = useState<boolean>(false);
  const [isParameterModalShow, setIsParameterModalShow] = useState<boolean>(false);

  async function fetchDocuments() {
    setIsLoading(true);
    const data = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/list`, {
      page: 1,
      page_size,
    });

    if (data.success) {
      setDocuments(data.data.data);
      setTotal(data.data.total);
      setCurrent(data.data.page);
      setIsLoading(false);
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

  const handleAddDocument = () => {
    setIsAddDocumentModalShow(true);
  };

  const handleArguments = () => {
    setIsParameterModalShow(true);
  };

  const renderDocTypeIcon = (type: string) => {
    if (type === 'TEXT') return <FileTextFilled className="text-[#2AA3FF] mr-2" />;
    if (type === 'DOCUMENT') return <FileWordTwoTone className="text-[#2AA3FF] mr-2" />;
    return <IeCircleFilled className="text-[#2AA3FF] mr-2" />;
  };

  const renderResultTag = (status: string, result: string) => {
    let color;
    if (status === 'TODO') color = 'gold';
    if (status === 'RUNNING') color = '#2db7f5';
    if (status === 'FINISHED') color = '#87d068';
    if (status === 'FAILED') color = 'f50';

    return (
      <Tooltip title={result}>
        <Tag color={color}>{status}</Tag>
      </Tooltip>
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [knowledge]);

  const renderCardList = () => {
    if (documents.length > 0) {
      return (
        <div className="knowledge-list max-h-96 mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-5 overflow-auto">
          {documents.map((item: any, index: number) => {
            return (
              <Card
                key={index}
                className="bg-[#FFFFFF] dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full"
                title={
                  <div>
                    {renderDocTypeIcon(item.doc_type)}
                    {item.doc_name}
                  </div>
                }
                extra={
                  <>
                    <EyeFilled
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
                <p className="mt-2 mb-2">
                  {t('Size')}: {item.chunk_size} chunks
                </p>
                <p className="mt-2 mb-2">
                  {t('Last_Synch')}: {moment(item.last_sync).format('YYYY-MM-DD HH:MM:SS')}
                </p>

                <p className="mt-2 mb-2">
                  {t('Status')}: {renderResultTag(item.status, item.result)}
                </p>
              </Card>
            );
          })}
        </div>
      );
    }
    return (
      <Empty image={Empty.PRESENTED_IMAGE_DEFAULT}>
        <Button type="primary" className="flex items-center mx-auto" icon={<PlusOutlined />} onClick={handleAddDocument}>
          Create Now
        </Button>
      </Empty>
    );
  };

  return (
    <div className="collapse-container pt-2 px-4">
      <Space>
        <Button size="small" type="primary" className="flex items-center" icon={<PlusOutlined />} onClick={handleAddDocument}>
          {t('Add_Datasource')}
        </Button>
        <Button size="small" className="flex items-center mx-2" icon={<ToolFilled />} onClick={handleArguments}>
          Arguments
        </Button>
      </Space>
      <Divider />
      <Spin spinning={isLoading}>{renderCardList()}</Spin>
      <AddDocumentModal
        setDocuments={setDocuments}
        setIsAddDocumentModalShow={setIsAddDocumentModalShow}
        isAddDocumentModalShow={isAddDocumentModalShow}
        knowLedge={knowledge}
      />
      <SpaceParameterModal spaceName={knowledge} isParameterModalShow={isParameterModalShow} setIsParameterModalShow={setIsParameterModalShow} />
      {chunkModal?.open && <ChunkListModal setChunkModal={setChunkModal} chunkModal={chunkModal} />}
    </div>
  );
}
