import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SpaceCard from '@/components/knowledge/space-card';
import DocumentModal from '@/components/knowledge/document-modal';
import { ISpace } from '@/types/knowledge';
import { apiInterceptors, getKnowledgeList } from '@/client/api';

const Knowledge = () => {
  const [spaceList, setSpaceList] = useState<Array<ISpace> | null>([]);
  const [isAddShow, setIsAddShow] = useState<boolean>(false);

  async function fetchData() {
    const [_, data] = await apiInterceptors(getKnowledgeList());
    setSpaceList(data);
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
          {spaceList?.map((space: ISpace, index: number) => (
            <SpaceCard onFinish={fetchData} key={index} space={space} />
          ))}
        </div>
      </div>

      <DocumentModal fetchKnowledge={fetchData} isAddShow={isAddShow} setIsAddShow={setIsAddShow} type="space" />
    </div>
  );
};

export default Knowledge;
