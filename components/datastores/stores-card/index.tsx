import React, { useState } from 'react';
import { Popover, ConfigProvider, Button } from 'antd';
import { useRouter } from 'next/router';
import { DeleteTwoTone, MessageTwoTone } from '@ant-design/icons';
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
  handleDeleteClick: (e: any, item: any) => void;
}

export default function StoresCard(props: IProps) {
  const router = useRouter();
  const { item, t, handleDeleteClick, className } = props;

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
          <div className="text-lg font-bold text-black ">
            <ContentPasteSearchOutlinedIcon className="mr-[5px] text-[#2AA3FF]" />
            <span className="text-[#2AA3FF]">{item?.name}</span>
          </div>
          <DeleteTwoTone
            onClick={(e) => {
              handleDeleteClick(e, item);
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
            <div>{t('Description')}</div>:&nbsp;<div>{item?.desc}</div>
          </div>

          <div className="flex">
            <div>{t('Docs')}</div>:&nbsp;<div className="">{item?.docs || 0}</div>
          </div>
        </div>
        <div className="flex justify-center pb-4">
          <Button size="middle" onClick={handleChat} className="mr-2" shape="round" icon={<MessageTwoTone />}>
            {t('Chat')}
          </Button>
        </div>
      </Popover>
    </ConfigProvider>
  );
}
