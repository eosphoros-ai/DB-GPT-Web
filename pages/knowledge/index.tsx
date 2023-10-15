'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import KnowledgeCard from '@/components/knowledge/knowledge-card';
import AddKnowledgeModal from '@/components/knowledge/add-modal';
import { IKnowLedge } from '@/types/knowledge';
import { apiInterceptors, getKnowledgeList } from '@/client/api';

const Index = () => {
  const { t } = useTranslation();
  const [knowledgeSpaceList, setKnowledgeSpaceList] = useState<any>([]);
  const [isAddShow, setIsAddShow] = useState<boolean>(false);

  async function fetchData() {
    const [_, data] = await apiInterceptors(getKnowledgeList());
    setKnowledgeSpaceList(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#212121] w-full h-full">
      <div className="page-body p-6 px-12 h-[90%] overflow-auto">
        <Button
          type="primary"
          className="flex items-center"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsAddShow(true);
          }}
        >
          Create
        </Button>
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
          {knowledgeSpaceList?.map((item: IKnowLedge, index: number) => (
            <KnowledgeCard
              className="dark:hover:border-white transition-all hover:shadow-md bg-[#FFFFFF] dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full min-[width]:80"
              key={index}
              item={item}
              t={t}
              setKnowledgeSpaceList={setKnowledgeSpaceList}
              knowledgeSpaceToDelete={item}
              isAddShow={isAddShow}
              setIsAddShow={setIsAddShow}
            />
          ))}
        </div>
      </div>

      <AddKnowledgeModal setKnowledgeSpaceList={setKnowledgeSpaceList} isAddShow={isAddShow} setIsAddShow={setIsAddShow} type="knowledge" />
    </div>
  );
};

export default Index;
