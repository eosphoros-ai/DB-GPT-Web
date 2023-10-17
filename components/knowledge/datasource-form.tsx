import { Button, Card, Form, Input, Switch, Upload, UploadFile, UploadProps } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { renderDocTypeIcon } from './document';
import { InboxOutlined, SelectOutlined } from '@ant-design/icons';
import { apiInterceptors, addDocument, uploadDocument } from '@/client/api';

const StepMap = {
  ChooseType: 1,
  AddDataSourceForm: 2,
};

type IProps = {
  handleChooseType: (item: any) => void;
  documentType: string;
  step: number;
  handleBackBtn: () => void;
  knowledgeName?: string;
  syncDocuments?: (name: string, id: number) => void;
  fetchDocuments?: () => void;
  setIsAddShow?: (isAddShow: boolean) => void;
};

type FieldType = {
  synchChecked: boolean;
  documentName: string;
  textSource: string;
  originFileObj: any;
  text: string;
  webPageUrl: string;
};

const { Dragger } = Upload;

export default function AddDatasource(props: IProps) {
  const { handleChooseType, documentType, step, handleBackBtn, knowledgeName, syncDocuments, fetchDocuments, setIsAddShow } = props;
  const { t } = useTranslation();
  const { TextArea } = Input;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (data: FieldType) => {
    setLoading(true);
    const { synchChecked, documentName, textSource, originFileObj, text, webPageUrl } = data;
    let res;
    switch (documentType) {
      case 'webPage':
        res = await apiInterceptors(
          addDocument(knowledgeName as string, {
            doc_name: documentName,
            content: webPageUrl,
            doc_type: 'URL',
          }),
        );
        break;
      case 'file':
        const formData = new FormData();
        formData.append('doc_name', fileList[0].name);
        formData.append('doc_file', fileList[0] as any);
        formData.append('doc_type', 'DOCUMENT');

        res = await apiInterceptors(uploadDocument(knowledgeName as string, formData));
        break;
      default:
        res = await apiInterceptors(
          addDocument(knowledgeName as string, {
            doc_name: documentName,
            source: textSource,
            content: text,
            doc_type: 'TEXT',
          }),
        );
        break;
    }
    setLoading(false);
    synchChecked && syncDocuments?.(knowledgeName as string, res?.[1] as number);
    if (!res[2]?.success) return;
    setIsAddShow?.(false);
    fetchDocuments?.();
  };
  const onChange: UploadProps['onChange'] = async (info) => {
    setFileList([info.file]);
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

  const renderChooseType = () => {
    return (
      <>
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
      </>
    );
  };

  const renderAddText = () => {
    return (
      <>
        <Form.Item<FieldType>
          label={`${t('Text_Source')}:`}
          name="textSource"
          rules={[{ required: true, message: t('Please_input_the_text_source') }]}
        >
          <Input className="mb-5  h-12" placeholder={t('Please_input_the_text_source')} />
        </Form.Item>

        <Form.Item<FieldType> label={`${t('Text')}:`} name="text" rules={[{ required: true, message: t('Please_input_the_description') }]}>
          <TextArea rows={4} maxLength={6} />
        </Form.Item>
      </>
    );
  };

  const renderAddWebPage = () => {
    return (
      <>
        <Form.Item<FieldType> label={`${t('Web_Page_URL')}:`} name="webPageUrl" rules={[{ required: true, message: t('Please_input_the_owner') }]}>
          <Input className="mb-5  h-12" placeholder={t('Please_input_the_Web_Page_URL')} />
        </Form.Item>
      </>
    );
  };

  const renderAddDocument = () => {
    return (
      <>
        <p className="ant-upload-hint" style={{ color: 'rgb(22, 108, 255)' }}>
          PDF, PowerPoint, Excel, Word, Text, Markdown,
        </p>
        <Upload
          disabled={loading}
          className="mr-1"
          beforeUpload={() => false}
          fileList={fileList}
          name="file"
          accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.md"
          multiple={false}
          onChange={onChange}
          showUploadList={{
            showDownloadIcon: false,
            showPreviewIcon: false,
            showRemoveIcon: false,
          }}
          itemRender={() => <></>}
          {...props}
        >
          <Button className="flex justify-center items-center" type="primary" disabled={loading} icon={<SelectOutlined />}>
            Select File
          </Button>
        </Upload>
        {/* <Dragger accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.md" onChange={onChange}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p style={{ color: 'rgb(22, 108, 255)', fontSize: '20px' }}>{t('Select_or_Drop_file')}</p>
          <p className="ant-upload-hint" style={{ color: 'rgb(22, 108, 255)' }}>
            PDF, PowerPoint, Excel, Word, Text, Markdown,
          </p>
        </Dragger> */}
      </>
    );
  };

  const renderFormContainer = () => {
    switch (documentType) {
      case 'webPage':
        return renderAddWebPage();
      case 'file':
        return renderAddDocument();
      default:
        return renderAddText();
    }
  };

  return step === StepMap['ChooseType'] ? (
    renderChooseType()
  ) : (
    <>
      <Form
        size="large"
        className="mt-4"
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleFinish}
      >
        <Form.Item<FieldType> label={`${t('Name')}:`} name="documentName" rules={[{ required: true, message: t('Please_input_the_name') }]}>
          <Input className="mb-5 h-12" placeholder={t('Please_input_the_name')} />
        </Form.Item>
        {renderFormContainer()}
        <Form.Item<FieldType> label={`${t('Synch')}:`} name="synchChecked">
          <Switch className="bg-slate-400" />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleBackBtn} className="mr-4">{`${t('Back')}`}</Button>
          <Button type="primary" htmlType="submit">
            {t('Finish')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
