'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import KnowledgeCard from '@/components/knowledge/knowledge-card';
import AddKnowledgeModal from '@/components/knowledge/add-modal';
import { IKnowLedge } from '@/types/knowledge';
import { apiInterceptors, getKnowledgeList } from '@/client/api';

const Knowledge = () => {
  const { t } = useTranslation();
  const [knowledgeSpaceList, setKnowledgeSpaceList] = useState<Array<IKnowLedge> | null>([]);
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
      <div className="page-body p-6 px-12 h-full overflow-auto">
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
          {knowledgeSpaceList?.map((item: IKnowLedge) => (
            <KnowledgeCard
              fetchKnowledge={fetchData}
              key={item.id}
              spaceInfo={item}
              t={t}
              knowledgeSpaceToDelete={item}
              isAddShow={isAddShow}
              setIsAddShow={setIsAddShow}
            />
          ))}
        </div>
      </div>

      <AddKnowledgeModal
        fetchKnowledge={fetchData}
        setKnowledgeSpaceList={setKnowledgeSpaceList}
        isAddShow={isAddShow}
        setIsAddShow={setIsAddShow}
        type="knowledge"
      />
    </div>
  );
};

export default Knowledge;
