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
  spaceInfo: IKnowLedge;
  t?: any;
  knowledgeSpaceToDelete: { name: string };
  fetchKnowledge: () => void;
}

const { confirm } = Modal;

export default function KnowledgeCard(props: IProps) {
  const router = useRouter();
  const { spaceInfo, t, knowledgeSpaceToDelete, fetchKnowledge } = props;

  const [documentCount, setDocumentCount] = useState(spaceInfo.docs);

  const showDeleteConfirm = () => {
    confirm({
      title: t('Tips'),
      icon: <ExclamationCircleFilled />,
      content: `${t('Del_Knowledge_Tips')}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        await apiInterceptors(delKnowledge({ name: knowledgeSpaceToDelete?.name }));
        fetchKnowledge();
      },
    });
  };

  const handleChat = async (e: any) => {
    e.stopPropagation();

    const [_, data] = await apiInterceptors(
      newDialogue({
        chat_mode: 'chat_knowledge',
      }),
    );

    if (data?.conv_uid) {
      router.push(`/chat/chat_knowledge/${data?.conv_uid}?db_param=${spaceInfo.name}`);
    }
  };

  const renderKnowledgeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
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
        className="dark:hover:border-white transition-all hover:shadow-md bg-[#FFFFFF] dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full min-[width]:80"
        placement="bottom"
        trigger="click"
        content={<CollapseContainer setDocumentCount={setDocumentCount} knowledge={spaceInfo} />}
      >
        <Badge count={documentCount || 0}>
          <div className="flex justify-between mx-6 mt-3">
            <div className="text-lg font-bold text-black truncate">
              {renderKnowledgeIcon(spaceInfo.vector_type)}
              <span className="dark:text-white ml-2">{spaceInfo?.name}</span>
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
            <p className=" truncate">{spaceInfo?.owner}</p>
            <p className="font-semibold mt-2">{t('Description')}:</p>
            <p className=" line-clamp-2">{spaceInfo?.desc}</p>
            <p className="font-semibold mt-2">Last modify:</p>
            <p className=" truncate">{moment(spaceInfo.gmt_modified).format('YYYY-MM-DD HH:MM:SS')}</p>
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
