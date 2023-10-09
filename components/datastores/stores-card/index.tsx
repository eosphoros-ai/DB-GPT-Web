import React, { useState } from 'react';
import { Popover, ConfigProvider, Button, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { DeleteTwoTone, MessageTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { IKnowLedge } from '@/types/knowledge';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import { sendSpacePostRequest } from '@/utils/request';
import CollapseContainer from '../collapse-container';
import './index.css';

interface IProps {
  className?: string;
  index?: number;
  item: IKnowLedge;
  t?: any;
  setKnowledgeSpaceList: (list: Array<any>) => void;
  knowledgeSpaceToDelete: { name: string };
}

const { confirm } = Modal;

export default function StoresCard(props: IProps) {
  const router = useRouter();
  const { item, t, className, setKnowledgeSpaceList, knowledgeSpaceToDelete } = props;

  const showDeleteConfirm = () => {
    confirm({
      title: 'Tips',
      icon: <ExclamationCircleFilled />,
      content: 'Do you want delete the document?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        const res = await sendSpacePostRequest(`/knowledge/space/delete`, {
          name: knowledgeSpaceToDelete?.name,
        });
        if (res.success) {
          message.success('success');
          const data = await sendSpacePostRequest('/knowledge/space/list', {});
          if (data.success) {
            setKnowledgeSpaceList(data.data);
          }
        } else {
          message.error(res.err_msg || 'failed');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleChat = async (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const res = await sendSpacePostRequest('/api/v1/chat/dialogue/new', {
      chat_mode: 'chat_knowledge',
    });

    if (res?.success && res?.data?.conv_uid) {
      router.push(`/chat?id=${res?.data?.conv_uid}&scene=chat_knowledge&spaceNameOriginal=${item?.name}`);
    }
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
      <Popover className={className} placement="bottom" trigger="click" content={<CollapseContainer knowledge={item} />}>
        <div className="flex justify-between mx-6 mt-3">
          <div className="text-lg font-bold text-black truncate">
            <ContentPasteSearchOutlinedIcon className="mr-[5px] text-[#2AA3FF]" />
            <span className="dark:text-white">{item?.name}</span>
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
        <div className="flex flex-col justify-between p-6 pt-2">
          <div className="flex">
            <div>{t('Owner')}</div>:&nbsp;<div>{item?.owner}</div>
          </div>
          <div className="flex">
            <div>{t('Description')}</div>:&nbsp;<div className="line-clamp-2">{item?.desc}</div>
          </div>

          <div className="flex">
            <div>{t('Docs')}</div>:&nbsp;<div className="">{item?.docs || 0}</div>
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <Button size="middle" onClick={handleChat} className="mr-2 dark:text-white" shape="round" icon={<MessageTwoTone />}>
            {t('Chat')}
          </Button>
        </div>
      </Popover>
    </ConfigProvider>
  );
}
