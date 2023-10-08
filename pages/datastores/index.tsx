'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Collapse } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import StoresCard from '@/components/datastores/stores-card';
import AddKnowledgeModal from '@/components/datastores/add-knowledge-modal';
import DelKnowledgeModel from '@/components/datastores/del-knowledge-model';
import DocumentsDraw from '@/components/datastores/documents-draw';
import { IKnowLedge } from '@/types/knowledge';

const Index = () => {
  const { t } = useTranslation();
  const [knowledgeSpaceList, setKnowledgeSpaceList] = useState<any>([]);
  const [isAddKnowledgeSpaceModalShow, setIsAddKnowledgeSpaceModalShow] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<number[]>([]);

  const [draw, setDraw] = useState<{ open: boolean; knowledge?: IKnowLedge | null }>({ open: false, knowledge: null });

  const [knowledge, setKnowledge] = useState<IKnowLedge>();

  const [isDeleteKnowledgeSpaceModalShow, setIsDeleteKnowledgeSpaceModalShow] = useState<boolean>(false);
  const [knowledgeSpaceToDelete, setKnowledgeSpaceToDelete] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      const data = await sendSpacePostRequest('/knowledge/space/list', {});
      if (data.success) {
        setKnowledgeSpaceList(data.data);
      }
    }
    fetchData();
  }, []);

  const handleCardClick = (item: IKnowLedge) => {
    setKnowledge(item);
  };

  const handleDeleteClick = (e: any, item: IKnowLedge) => {
    e.stopPropagation();
    setKnowledgeSpaceToDelete(item);
    setIsDeleteKnowledgeSpaceModalShow(true);
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#212121] w-full h-full">
      <div className="page-body p-6 px-12 h-[90%] overflow-auto">
        <Button
          type="primary"
          className="flex items-center"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsAddKnowledgeSpaceModalShow(true);
          }}
        >
          Create
        </Button>
        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
          {knowledgeSpaceList.map((item: IKnowLedge, index: number) => (
            <StoresCard
              className="dark:hover:border-white transition-all hover:shadow-md bg-[#FFFFFF] dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full"
              key={index}
              item={item}
              t={t}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <AddKnowledgeModal
        setKnowledgeSpaceList={setKnowledgeSpaceList}
        isAddKnowledgeSpaceModalShow={isAddKnowledgeSpaceModalShow}
        setIsAddKnowledgeSpaceModalShow={setIsAddKnowledgeSpaceModalShow}
      />

      <DelKnowledgeModel
        isDeleteKnowledgeSpaceModalShow={isDeleteKnowledgeSpaceModalShow}
        setIsDeleteKnowledgeSpaceModalShow={setIsDeleteKnowledgeSpaceModalShow}
        setKnowledgeSpaceList={setKnowledgeSpaceList}
        knowledgeSpaceToDelete={knowledgeSpaceToDelete}
      />
      <DocumentsDraw setDraw={setDraw} draw={draw} />
    </div>
  );
};

export default Index;
