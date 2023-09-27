'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Stack, Box } from '@/lib/mui';
import { Button, Card, Collapse, ConfigProvider } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import StoresCard from '@/components/datastores/stores-card';
import AddKnowledgeModal from '@/components/datastores/add-knowledge-modal';
import DelKnowledgeModel from '@/components/datastores/del-knowledge-model';
import DocumentsDraw from '@/components/datastores/documents-draw';
import { IKnowLedge } from '@/types/knowledge';
import CollapseContainer from '@/components/datastores/collapse-container';

const { Panel } = Collapse;

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
    <Box className="bg-[#FAFAFA] dark:bg-[#212121] w-full h-full">
      <Box
        className="page-body p-6 px-12 h-[90%] overflow-auto"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
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
        <ConfigProvider theme={{ components: { Collapse: { headerPadding: 0, contentBg: 'blue', headerBg: 'blue' } } }}>
          <Collapse
            destroyInactivePanel
            ghost
            bordered={false}
            accordion={true}
            className="mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-5"
          >
            {knowledgeSpaceList.map((item: IKnowLedge, index: number) => (
              <Panel
                className="bg-[#FFFFFF] dark:bg-[#484848] relative  shrink-0 grow-0 cursor-pointer rounded-[10px] border border-gray-200 border-solid w-full"
                collapsible="header"
                showArrow={false}
                header={
                  <StoresCard
                    item={item}
                    t={t}
                    handleCardClick={() => {
                      const isActive = ~activeKey.findIndex((value) => value === index);

                      if (isActive) {
                        setActiveKey([]);
                      } else {
                        setActiveKey([index]);
                      }
                      handleCardClick(item);
                    }}
                    handleDeleteClick={handleDeleteClick}
                  />
                }
                key={index}
              >
                <CollapseContainer knowledge={item} />
              </Panel>
            ))}
          </Collapse>
        </ConfigProvider>
      </Box>

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
    </Box>
  );
};

export default Index;
