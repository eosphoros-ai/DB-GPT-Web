import { Button, Card, Form, Input, Switch, Upload } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { renderDocTypeIcon } from './document';
import { InboxOutlined } from '@ant-design/icons';
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
  const [form] = Form.useForm();
  const { handleChooseType, documentType, step, handleBackBtn, knowledgeName, syncDocuments, fetchDocuments, setIsAddShow } = props;
  const { t } = useTranslation();
  const { TextArea } = Input;

  const handleFinish = async (data: FieldType) => {
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
        formData.append('doc_name', originFileObj.file.name);
        formData.append('doc_file', originFileObj.file);
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
    synchChecked && syncDocuments?.(knowledgeName as string, res?.[1] as number);
    if (res[2]?.success) return;
    setIsAddShow?.(false);
    fetchDocuments?.();
  };
  const checkFile = (file: any) => {
    const acceptedTypes = [
      'application/pdf', // PDF
      'application/vnd.ms-powerpoint', // PowerPoint (PPT)
      'application/vnd.ms-excel', // Excel
      'application/msword', // Word
      'text/plain', // 文本 (Text)
      'text/markdown', // Markdown
    ];

    if (!acceptedTypes.includes(file.type)) {
      console.log('不支持的文件类型');
      return false;
    }

    return true;
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
      <div>
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
        <Form.Item<FieldType>
          name="originFileObj"
          rules={[
            { required: true, message: t('Please_input_the_owner') },
            () => ({
              validator(_, value) {
                if (checkFile(value.file)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error(t('File_type_Invalid')));
                }
              },
            }),
          ]}
        >
          <Dragger>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p style={{ color: 'rgb(22, 108, 255)', fontSize: '20px' }}>{t('Select_or_Drop_file')}</p>
            <p className="ant-upload-hint" style={{ color: 'rgb(22, 108, 255)' }}>
              PDF, PowerPoint, Excel, Word, Text, Markdown,
            </p>
          </Dragger>
        </Form.Item>
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
    <Form
      form={form}
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
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button onClick={handleBackBtn} className="mr-4">{`${t('Back')}`}</Button>
        <Button type="primary" htmlType="submit">
          {t('Finish')}
        </Button>
      </Form.Item>
    </Form>
  );
}
