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
import { IDocument, ISpace } from '@/types/knowledge';
import moment from 'moment';
import DocumentModal from './document-modal';
import ArgumentsModal from './arguments-modal';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

interface IProps {
  space: ISpace;
  setDocumentCount: (count: string) => void;
}

const { confirm } = Modal;

export const renderDocTypeIcon = (type: string) => {
  if (type === 'TEXT') return <FileTextFilled className="text-[#2AA3FF] mr-2 !text-lg" />;
  if (type === 'DOCUMENT') return <FileWordTwoTone className="text-[#2AA3FF] mr-2 !text-lg" />;
  return <IeCircleFilled className="text-[#2AA3FF] mr-2 !text-lg" />;
};

export default function DocumentContainer(props: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const page_size = 20;

  const { space, setDocumentCount } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any>([]);
  const [isAddDocumentShow, setIsAddDocumentShow] = useState<boolean>(false);
  const [argumentsShow, setArgumentsShow] = useState<boolean>(false);

  const showDeleteConfirm = (row: any) => {
    confirm({
      title: t('Tips'),
      icon: <ExclamationCircleFilled />,
      content: `${t('Del_Document_Tips')}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await handleDelete(row);
      },
    });
  };

  async function fetchDocuments() {
    setIsLoading(true);
    const [_, data] = await apiInterceptors(
      getDocumentList(space?.name, {
        page: 1,
        page_size,
      }),
    );
    setIsLoading(false);
    setDocuments(data?.data);
    setDocumentCount(String(data?.total));
  }

  const handleSync = async (spaceName: string, id: number) => {
    await apiInterceptors(syncDocument(spaceName, { doc_ids: [id] }));
  };

  const handleDelete = async (row: any) => {
    await apiInterceptors(delDocument(space?.name, { doc_name: row.doc_name }));
    fetchDocuments();
  };

  const handleAddDocument = () => {
    setIsAddDocumentShow(true);
  };

  const handleArguments = () => {
    setArgumentsShow(true);
  };

  const renderResultTag = (status: string, result: string) => {
    let color;
    switch (status) {
      case 'TODO':
        color = 'gold';
        break;
      case 'RUNNING':
        color = '#2db7f5';
        break;
      case 'FINISHED':
        color = '#87d068';
        break;
      case 'FAILED':
        color = 'f50';
        break;
      default:
        color = 'f50';
        break;
    }
    return (
      <Tooltip title={result}>
        <Tag color={color}>{status}</Tag>
      </Tooltip>
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [space]);

  const renderDocumentCard = () => {
    if (documents?.length > 0) {
      return (
        <div className="max-h-96 mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-5 overflow-auto">
          {documents.map((document: IDocument) => {
            return (
              <Card
                key={document.id}
                className=" dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full"
                title={
                  <Tooltip title={document.doc_name}>
                    <div className="truncate ">
                      {renderDocTypeIcon(document.doc_type)}
                      <span>{document.doc_name}</span>
                    </div>
                  </Tooltip>
                }
                extra={
                  <div className="mx-3">
                    <Tooltip title={'detail'}>
                      <EyeFilled
                        className="mr-2 !text-lg"
                        style={{ color: '#1b7eff', fontSize: '20px' }}
                        onClick={() => {
                          router.push(`/knowledge/${space.name}/${document.id}`);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={'Sync'}>
                      <InteractionFilled
                        className="mr-2 !text-lg"
                        style={{ color: '#1b7eff', fontSize: '20px' }}
                        onClick={() => {
                          handleSync(space.name, document.id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title={'Delete'}>
                      <DeleteFilled
                        className="text-[#ff1b2e] !text-lg"
                        onClick={() => {
                          showDeleteConfirm(document);
                        }}
                      />
                    </Tooltip>
                  </div>
                }
              >
                <p className="mt-2 font-semibold ">{t('Size')}:</p>
                <p>{document.chunk_size} chunks</p>
                <p className="mt-2 font-semibold ">{t('Last_Synch')}:</p>
                <p>{moment(document.last_sync).format('YYYY-MM-DD HH:MM:SS')}</p>
                <p className="mt-2 mb-2">{renderResultTag(document.status, document.result)}</p>
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
      <Spin spinning={isLoading}>{renderDocumentCard()}</Spin>
      <DocumentModal
        fetchDocuments={fetchDocuments}
        setIsAddShow={setIsAddDocumentShow}
        isAddShow={isAddDocumentShow}
        space={space}
        type="document"
      />
      <ArgumentsModal space={space} argumentsShow={argumentsShow} setArgumentsShow={setArgumentsShow} />
    </div>
  );
}
