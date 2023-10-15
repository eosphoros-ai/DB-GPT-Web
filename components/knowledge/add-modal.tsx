import React, { useEffect, useState } from 'react';
import type { UploadProps } from 'antd';
import { message, Upload, Steps, Modal, Button, Input, Card, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

import { apiInterceptors, getKnowledgeList, postDocumentAdd, postDocumentSync, postDocumentUpload, postKnowledgeAdd } from '@/client/api';
import { renderDocTypeIcon } from './document';
import { InboxOutlined } from '@ant-design/icons';
import { IKnowLedge } from '@/types/knowledge';

const { Dragger } = Upload;
const { TextArea } = Input;

interface IProps {
  setDocuments?: (documents: any) => void;
  isAddShow: boolean;
  setIsAddShow: (isAddShow: boolean) => void;
  setKnowledgeSpaceList?: (list: Array<any>) => void;
  type?: 'knowledge' | 'document';
  knowLedge?: IKnowLedge;
  fetchDocuments?: () => void;
}

export default function AddModal(props: IProps) {
  const { setIsAddShow, isAddShow, type, setKnowledgeSpaceList, knowLedge, fetchDocuments } = props;
  const { t } = useTranslation();

  const stepsOfAddingKnowledge = [
    { title: t('Knowledge_Space_Config') },
    { title: t('Choose_a_Datasource_type') },
    { title: t('Setup_the_Datasource') },
  ];

  const stepsOfAddingDocument = [{ title: t('Choose_a_Datasource_type') }, { title: t('Setup_the_Datasource') }];

  const [owner, setOwner] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [webPageUrl, setWebPageUrl] = useState<string>('');
  const [knowledgeSpaceName, setKnowledgeSpaceName] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [synchChecked, setSynchChecked] = useState<boolean>(true);
  const [documentName, setDocumentName] = useState<any>('');
  const [textSource, setTextSource] = useState<string>('');
  const [originFileObj, setOriginFileObj] = useState<any>(null);
  const [text, setText] = useState<string>('');

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: () => false,
    onChange(info) {
      if (info.fileList.length === 0) {
        setOriginFileObj(null);
        setDocumentName('');
        return;
      }
      setOriginFileObj(info.file);
      setDocumentName(info.file.name);
    },
  };
  const documentTypeList = [
    {
      type: 'text',
      title: t('Text'),
      subTitle: t('Fill your raw text'),
      iconType: 'TEXT',
    },
    {
      type: 'webPage',
      title: t('URL'),
      subTitle: t('Fetch_the_content_of_a_URL'),
      iconType: 'WEBPAGE',
    },
    {
      type: 'file',
      title: t('Document'),
      subTitle: t('Upload_a_document'),
      iconType: 'DOCUMENT',
    },
  ];
  const verifyKnowledgeConfig = () => {
    if (knowledgeSpaceName === '') {
      message.error(t('Please_input_the_name'));
      return;
    }
    if (/[^\u4e00-\u9fa50-9a-zA-Z_-]/.test(knowledgeSpaceName)) {
      message.error(t('the_name_can_only_contain'));
      return;
    }
    if (owner === '') {
      message.error(t('Please_input_the_owner'));
      return;
    }
    if (description === '') {
      message.error(t('Please_input_the_description'));
      return;
    }
  };
  const handleKnowledgeConfig = async () => {
    verifyKnowledgeConfig();

    const [_, data, res] = await apiInterceptors(
      postKnowledgeAdd({
        name: knowledgeSpaceName,
        vector_type: 'Chroma',
        owner,
        desc: description,
      }),
    );
    if (res?.success) {
      message.success('success');
      setActiveStep(1);
      const [_, data, res] = await apiInterceptors(getKnowledgeList());
      if (res?.success) {
        setKnowledgeSpaceList && setKnowledgeSpaceList(res.data);
      }
    } else {
      message.error(data.err_msg || 'failed');
    }
  };
  const handleChooseType = (item: any) => {
    setDocumentType(item.type);
    setActiveStep(type === 'knowledge' ? 2 : 1);
  };

  const handleWebPageSubmit = async (knowledgeName: string) => {
    if (webPageUrl === '') {
      message.error(t('Please_input_the_text_source'));
      return;
    }
    const [_, data, res] = await apiInterceptors(
      postKnowledgeAdd({
        doc_name: documentName,
        content: webPageUrl,
        doc_type: 'URL',
      }),
    );
    if (res?.success) {
      message.success('success');
      props.setIsAddShow(false);
      synchChecked &&
        apiInterceptors(
          postDocumentSync(knowledgeName, {
            doc_ids: [data.data],
          }),
        );
    } else {
      message.error(data.err_msg || 'failed');
    }
  };

  const handleFileSubmit = async (knowledgeName: string) => {
    if (!originFileObj) {
      message.error(t('Please_select_a_file'));
      return;
    }
    const formData = new FormData();
    formData.append('doc_name', documentName);
    formData.append('doc_file', originFileObj);
    formData.append('doc_type', 'DOCUMENT');

    const [_, data, res] = await apiInterceptors(postDocumentUpload(knowledgeName, formData));
    if (res?.success) {
      message.success('success');
      props.setIsAddShow(false);
      synchChecked &&
        apiInterceptors(
          postDocumentSync(knowledgeName, {
            doc_ids: [data.data],
          }),
        );
    } else {
      message.error(data.err_msg || 'failed');
    }
  };

  const handleTextSubmit = async (knowledgeName: string) => {
    if (text === '') {
      message.error(t('Please_input_the_text'));
      return;
    }

    const [_, data, res] = await apiInterceptors(
      postDocumentAdd(knowledgeName, {
        doc_name: documentName,
        source: textSource,
        content: text,
        doc_type: 'TEXT',
      }),
    );
    if (res?.success) {
      message.success('success');
      props.setIsAddShow(false);
      synchChecked &&
        apiInterceptors(
          postDocumentSync(knowledgeName, {
            doc_ids: [data.data],
          }),
        );
    } else {
      message.error(data.err_msg || 'failed');
    }
  };

  const handleDataSource = async () => {
    const knowledgeName = type === 'knowledge' ? knowledgeSpaceName : knowLedge?.name;
    if (documentName === '') {
      message.error(t('Please_input_the_name'));
      return;
    }
    if (documentType === 'webPage') {
      await handleWebPageSubmit(knowledgeName as string);
    } else if (documentType === 'file') {
      await handleFileSubmit(knowledgeName as string);
    } else {
      await handleTextSubmit(knowledgeName as string);
    }

    fetchDocuments?.();
  };

  const renderStepContent = () => {
    const renderStep = type === 'document' ? activeStep + 1 : activeStep;
    if (renderStep === 0) {
      return (
        <>
          <div className="my-[30px] mx-auto">
            <div className="mb-3">{t('Knowledge_Space_Name')}:</div>
            <div>
              <Input
                placeholder={t('Please_input_the_name')}
                onChange={(e: any) => {
                  setKnowledgeSpaceName(e.target.value);
                }}
                className="mb-5 h-12"
              />
            </div>
            <div className="mb-3">{t('Owner')}:</div>
            <div>
              <Input placeholder={t('Please_input_the_owner')} onChange={(e: any) => setOwner(e.target.value)} className="mb-5  h-12" />
            </div>
            <div className="mb-3">{t('Description')}:</div>
            <div>
              <Input placeholder={t('Please_input_the_description')} onChange={(e: any) => setDescription(e.target.value)} className="mb-5  h-12" />
            </div>
          </div>
          <Button onClick={handleKnowledgeConfig}>{t('Next')}</Button>
        </>
      );
    } else if (renderStep === 1) {
      return (
        <div className="">
          {documentTypeList.map((item, index) => (
            <Card
              key={index}
              className="mt-4 mb-4"
              onClick={() => {
                handleChooseType(item);
              }}
            >
              <div className="font-semibold">
                {renderDocTypeIcon(item.iconType)} {item.title}
              </div>
              <div>{item.subTitle}</div>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <>
          <div>
            <div className="mb-2 mt-4">{t('Name')}:</div>
            <Input placeholder={t('Please_input_the_name')} onChange={(e: any) => setDocumentName(e.target.value)} className="h-12" />
            {documentType === 'webPage' ? (
              <>
                <div className="mb-2 mt-4">{t('Web_Page_URL')}:</div>
                <Input placeholder={t('Please_input_the_Web_Page_URL')} onChange={(e: any) => setWebPageUrl(e.target.value)} className="h-12" />
              </>
            ) : documentType === 'file' ? (
              <div className="mt-4">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p style={{ color: 'rgb(22, 108, 255)', fontSize: '20px' }}>{t('Select_or_Drop_file')}</p>
                  <p className="ant-upload-hint" style={{ color: 'rgb(22, 108, 255)' }}>
                    PDF, PowerPoint, Excel, Word, Text, Markdown,
                  </p>
                </Dragger>
              </div>
            ) : (
              <div>
                <div className="mb-4  mt-4">{t('Text_Source')}:</div>
                <Input className="h-12" placeholder={t('Please_input_the_text_source')} onChange={(e: any) => setTextSource(e.target.value)} />
                <div className="mb-4  mt-4">{t('Text')}:</div>
                <TextArea rows={4} maxLength={6} onChange={(e: any) => setText(e.target.value)} />
              </div>
            )}
            <div className="mb-2 mt-4">
              {t('Synch')}:<Switch checked={synchChecked} onChange={(checked: boolean) => setSynchChecked(checked)} />
            </div>
          </div>
          <div>
            <Button className="mr-4" onClick={() => setActiveStep(type === 'knowledge' ? 1 : 0)}>{`< ${t('Back')}`}</Button>
            <Button onClick={handleDataSource}>{t('Finish')}</Button>
          </div>
        </>
      );
    }
  };

  return (
    <Modal
      title="Add knowledge"
      centered
      open={isAddShow}
      onCancel={() => {
        setIsAddShow(false);
      }}
      width={1000}
      afterClose={() => {
        setActiveStep(0);
      }}
      footer={null}
    >
      <Steps current={activeStep} items={type === 'knowledge' ? stepsOfAddingKnowledge : stepsOfAddingDocument} />
      {renderStepContent()}
    </Modal>
  );
}
