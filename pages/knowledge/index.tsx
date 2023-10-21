import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SpaceCard from '@/components/knowledge/space-card';
import DocumentModal from '@/components/knowledge/document-modal';
import { ISpace } from '@/types/knowledge';
import { apiInterceptors, getKnowledgeList } from '@/client/api';
import { KnowledgeProvider } from '../../context/knowledgeContext';

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
    <KnowledgeProvider value={{ onFinish: fetchData }}>
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
          <div className="flex flex-wrap">
            {spaceList?.map((space: ISpace) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </div>

        <DocumentModal isAddShow={isAddShow} setIsAddShow={setIsAddShow} type="space" />
      </div>
    </KnowledgeProvider>
  );
};

export default Knowledge;
