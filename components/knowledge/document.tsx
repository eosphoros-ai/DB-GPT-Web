import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Divider, Empty, Spin, Tag, Tooltip, Modal } from 'antd';
import {
  DeleteFilled,
  InteractionFilled,
  PlusOutlined,
  ToolFilled,
  FileTextFilled,
  FileWordTwoTone,
  IeCircleFilled,
  EyeFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { apiInterceptors, delDocument, getDocumentList, syncDocument } from '@/client/api';
import { IKnowLedge } from '@/types/knowledge';
import moment from 'moment';
import AddDocumentModal from './add-modal';
import SpaceParameterModal from './arguments';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

interface IProps {
  knowledge: IKnowLedge;
  setDocumentCount: (count: string) => void;
}

const { confirm } = Modal;

export const renderDocTypeIcon = (type: string) => {
  if (type === 'TEXT') return <FileTextFilled className="text-[#2AA3FF] !text-3xl mr-2" />;
  if (type === 'DOCUMENT') return <FileWordTwoTone className="text-[#2AA3FF] !text-3xl mr-2" />;
  return <IeCircleFilled className="text-[#2AA3FF] !text-3xl mr-2" />;
};

export default function CollapseContainer(props: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const page_size = 20;

  const { knowledge, setDocumentCount } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any>([]);
  const [isAddDocumentShow, setIsAddDocumentShow] = useState<boolean>(false);
  const [isParameterModalShow, setIsParameterModalShow] = useState<boolean>(false);

  const showDeleteConfirm = (row: any) => {
    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want delete the document?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await handleDelete(row);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  async function fetchDocuments() {
    setIsLoading(true);
    const [_, data] = await apiInterceptors(
      getDocumentList(knowledge?.name, {
        page: 1,
        page_size,
      }),
    );

    setDocuments(data?.data);
    setDocumentCount(String(data?.total));
    setIsLoading(false);
  }

  const handleSync = async (knowledgeName: string, id: number) => {
    await apiInterceptors(syncDocument(knowledgeName, { doc_ids: [id] }));
  };

  const handleDelete = async (row: any) => {
    await apiInterceptors(delDocument(knowledge?.name, { doc_name: row.doc_name }));
    fetchDocuments();
  };

  const handleAddDocument = () => {
    setIsAddDocumentShow(true);
  };

  const handleArguments = () => {
    setIsParameterModalShow(true);
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
                className=" dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full"
                title={
                  <Tooltip title={item.doc_name}>
                    <div className="truncate ">
                      {renderDocTypeIcon(item.doc_type)}
                      <span className="!text-3xl">{item.doc_name}</span>
                    </div>
                  </Tooltip>
                }
                extra={
                  <div className="mx-3">
                    <Tooltip title={'detail'}>
                      <EyeFilled
                        className="mr-2"
                        style={{ color: '#1b7eff', fontSize: '20px' }}
                        onClick={() => {
                          router.push(`/knowledge/${knowledge.name}/${item.id}`);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={'Sync'}>
                      <InteractionFilled
                        className="mr-2"
                        style={{ color: '#1b7eff', fontSize: '20px' }}
                        onClick={() => {
                          handleSync(knowledge.name, item.id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={'Delete'}>
                      <DeleteFilled
                        style={{ color: '#ff1b2e', fontSize: '20px' }}
                        onClick={() => {
                          showDeleteConfirm(item);
                        }}
                      />
                    </Tooltip>
                  </div>
                }
              >
                <p className="mt-2 font-semibold ">{t('Size')}:</p>
                <p>{item.chunk_size} chunks</p>
                <p className="mt-2 font-semibold ">{t('Last_Synch')}:</p>
                <p>{moment(item.last_sync).format('YYYY-MM-DD HH:MM:SS')}</p>
                <p className="mt-2 mb-2">{renderResultTag(item.status, item.result)}</p>
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
        <Button size="middle" type="primary" className="flex items-center" icon={<PlusOutlined />} onClick={handleAddDocument}>
          {t('Add_Datasource')}
        </Button>
        <Button size="middle" className="flex items-center mx-2" icon={<ToolFilled />} onClick={handleArguments}>
          Arguments
        </Button>
      </Space>
      <Divider />
      <Spin spinning={isLoading}>{renderCardList()}</Spin>
      <AddDocumentModal
        syncDocuments={handleSync}
        fetchDocuments={fetchDocuments}
        setIsAddShow={setIsAddDocumentShow}
        isAddShow={isAddDocumentShow}
        type="document"
        setDocuments={setDocuments}
        knowLedge={knowledge}
      />
      <SpaceParameterModal knowledge={knowledge} isParameterModalShow={isParameterModalShow} setIsParameterModalShow={setIsParameterModalShow} />
    </div>
  );
}
