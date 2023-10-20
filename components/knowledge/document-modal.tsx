import React, { useState } from 'react';
import { Steps, Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ISpace } from '@/types/knowledge';
import SpaceForm from './space-form';
import DataSourceForm from './document-form';

interface IProps {
  isAddShow: boolean;
  setIsAddShow: (isAddShow: boolean) => void;
  type: 'space' | 'document';
  space?: ISpace;
  fetchDocuments?: () => void;
  fetchSpace?: () => void;
}

export default function DocumentModal(props: IProps) {
  const { setIsAddShow, isAddShow, type, space, fetchDocuments, fetchSpace } = props;
  const { t } = useTranslation();

  const addKnowledgeSteps = [{ title: t('Knowledge_Space_Config') }, { title: t('Choose_a_Datasource_type') }, { title: t('Setup_the_Datasource') }];
  const addDocumentSteps = [{ title: t('Choose_a_Datasource_type') }, { title: t('Setup_the_Datasource') }];
  const [documentType, setDocumentType] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [curSpaceName, setCurSpaceName] = useState<string>();

  const handleAddSpace = async (name: string) => {
    setActiveStep(1);
    fetchSpace?.();
    setCurSpaceName(name);
  };

  const handleChooseType = (item: any) => {
    setDocumentType(item.type);
    setActiveStep(type === 'space' ? 2 : 1);
  };

  const handleBackBtn = () => {
    setActiveStep(type === 'space' ? 1 : 0);
  };

  const renderContent = () => {
    const renderStep = type === 'document' ? activeStep + 1 : activeStep;
    if (renderStep === 0) {
      return <SpaceForm handleAddSpace={handleAddSpace} />;
    }
    return (
      <DataSourceForm
        fetchDocuments={fetchDocuments}
        spaceName={space?.name || curSpaceName}
        step={renderStep}
        documentType={documentType}
        handleChooseType={handleChooseType}
        handleBackBtn={handleBackBtn}
        setIsAddShow={props.setIsAddShow}
      />
    );
  };

  return (
    <Modal
      title={type === 'space' ? 'Add Knowledge' : 'Add Datasource'}
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
      <Steps current={activeStep} items={type === 'space' ? addKnowledgeSteps : addDocumentSteps} />
      {renderContent()}
    </Modal>
  );
}
