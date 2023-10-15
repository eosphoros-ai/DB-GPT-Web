import React, { useState } from 'react';
import { Popover, ConfigProvider, Button, Modal, Badge } from 'antd';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { DeleteTwoTone, MessageTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { IKnowLedge } from '@/types/knowledge';

import CollapseContainer from './document';
import moment from 'moment';
import { apiInterceptors, delKnowledge, newDialogue } from '@/client/api';

interface IProps {
  isAddShow: boolean;
  setIsAddShow: (isAddShow: boolean) => void;
  className?: string;
  index?: number;
  item: IKnowLedge;
  t?: any;
  setKnowledgeSpaceList: (list: Array<IKnowLedge> | null) => void;
  knowledgeSpaceToDelete: { name: string };
  fetchKnowledge: () => void;
}

const { confirm } = Modal;

export default function KnowledgeCard(props: IProps) {
  const router = useRouter();
  const { item, t, className, setKnowledgeSpaceList, knowledgeSpaceToDelete, fetchKnowledge } = props;

  const [documentCount, setDocumentCount] = useState(item.docs);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want delete the knowledge?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await apiInterceptors(delKnowledge({ name: knowledgeSpaceToDelete?.name }));
        fetchKnowledge();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleChat = async (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const [_, data] = await apiInterceptors(
      newDialogue({
        chat_mode: 'chat_knowledge',
      }),
    );

    if (data?.conv_uid) {
      router.push(`/chat/chat_dashboard/${data?.conv_uid}`);
    }
  };

  const renderKnowledgeIcon = (type: string) => {
    const iconMap: any = {
      Chroma: '/models/chroma-logo.png',
    };
    return (
      <Image
        className="rounded-full w-8 h-8 border border-gray-200 object-contain bg-white inline-block"
        width={36}
        height={136}
        src={iconMap[type] || '/models/knowledge-default.jpg'}
        alt="llm"
      />
    );
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Popover: {
            zIndexPopup: 90,
          },
        },
      }}
    >
      <Popover
        className={className}
        placement="bottom"
        trigger="click"
        content={<CollapseContainer setDocumentCount={setDocumentCount} knowledge={item} />}
      >
        <Badge count={documentCount || 0}>
          <div className="flex justify-between mx-6 mt-3">
            <div className="text-lg font-bold text-black truncate">
              {renderKnowledgeIcon(item.vector_type)}
              <span className="dark:text-white ml-2">{item?.name}</span>
            </div>
            <DeleteTwoTone
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                showDeleteConfirm();
              }}
              style={{ fontSize: '20px' }}
              twoToneColor="#CD2029"
              className="text-3xl"
            />
          </div>
          <div className="text-sm mt-2  p-6 pt-2 h-40">
            <p className="font-semibold">{t('Owner')}:</p>
            <p className=" truncate">{item?.owner}</p>
            <p className="font-semibold mt-2">{t('Description')}:</p>
            <p className=" line-clamp-2">{item?.desc}</p>
            <p className="font-semibold mt-2">Last modify:</p>
            <p className=" truncate">{moment(item.gmt_modified).format('YYYY-MM-DD HH:MM:SS')}</p>
          </div>
          <div className="flex justify-center">
            <Button size="middle" onClick={handleChat} className="mr-4 dark:text-white mb-2" shape="round" icon={<MessageTwoTone />}>
              {t('Chat')}
            </Button>
          </div>
        </Badge>
      </Popover>
    </ConfigProvider>
  );
}
