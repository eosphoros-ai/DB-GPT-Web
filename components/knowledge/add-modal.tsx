import React, { useState } from 'react';
import { Steps, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { IKnowLedge } from '@/types/knowledge';
import AddKnowledge from './knowledge-form';
import AddDatasource from './datasource-form';

interface IProps {
  setDocuments?: (documents: any) => void;
  isAddShow: boolean;
  setIsAddShow: (isAddShow: boolean) => void;
  setKnowledgeSpaceList?: (list: Array<any>) => void;
  type?: 'knowledge' | 'document';
  knowLedge?: IKnowLedge;
  fetchDocuments?: () => void;
  fetchKnowledge?: () => void;
  syncDocuments?: (knowledgeName: string, id: number) => void;
}

export default function AddModal(props: IProps) {
  const { setIsAddShow, isAddShow, type, knowLedge, fetchDocuments, fetchKnowledge, syncDocuments } = props;
  const { t } = useTranslation();

  const addKnowledgeSteps = [{ title: t('Knowledge_Space_Config') }, { title: t('Choose_a_Datasource_type') }, { title: t('Setup_the_Datasource') }];

  const addDocumentSteps = [{ title: t('Choose_a_Datasource_type') }, { title: t('Setup_the_Datasource') }];

  const [documentType, setDocumentType] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleAddKnowledge = async () => {
    setActiveStep(1);
    fetchKnowledge?.();
  };
  const handleChooseType = (item: any) => {
    setDocumentType(item.type);

    setActiveStep(type === 'knowledge' ? 2 : 1);
  };

  const handleBackBtn = () => {
    setActiveStep(type === 'knowledge' ? 1 : 0);
  };

  const renderStepContent = () => {
    const renderStep = type === 'document' ? activeStep + 1 : activeStep;
    if (renderStep === 0) {
      return <AddKnowledge handleAddKnowledge={handleAddKnowledge} />;
    }
    return (
      <AddDatasource
        fetchDocuments={fetchDocuments}
        knowledgeName={knowLedge?.name}
        step={renderStep}
        documentType={documentType}
        handleChooseType={handleChooseType}
        handleBackBtn={handleBackBtn}
        syncDocuments={syncDocuments}
        setIsAddShow={props.setIsAddShow}
      />
    );
  };

  return (
    <Modal
      title={type === 'knowledge' ? 'Add Knowledge' : 'Add Datasource'}
      centered
      open={isAddShow}
      destroyOnClose={true}
      onCancel={() => {
        setIsAddShow(false);
      }}
      width={1000}
      afterClose={() => {
        setActiveStep(0);
      }}
      footer={null}
    >
      <Steps current={activeStep} items={type === 'knowledge' ? addKnowledgeSteps : addDocumentSteps} />
      {renderStepContent()}
    </Modal>
  );
}
