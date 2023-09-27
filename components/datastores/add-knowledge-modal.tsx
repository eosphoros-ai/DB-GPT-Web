import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Modal, Button, Sheet, Stack, Box, Input, Textarea, Switch, Typography, styled } from '@/lib/mui';
import { sendSpacePostRequest, sendSpaceUploadPostRequest } from '@/utils/request';

const { Dragger } = Upload;

const Item = styled(Sheet)(({ theme }) => ({
  width: '33%',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

interface IProps {
  isAddKnowledgeSpaceModalShow: boolean;
  setIsAddKnowledgeSpaceModalShow: (isAddKnowledgeSpaceModalShow: boolean) => void;
  setKnowledgeSpaceList: (list: Array<any>) => void;
}

export default function AddKnowledgeModal(props: IProps) {
  const { t } = useTranslation();

  const stepsOfAddingSpace = [t('Knowledge_Space_Config'), t('Choose_a_Datasource_type'), t('Setup_the_Datasource')];

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
    },
    {
      type: 'webPage',
      title: t('URL'),
      subTitle: t('Fetch_the_content_of_a_URL'),
    },
    {
      type: 'file',
      title: t('Document'),
      subTitle: t('Upload_a_document'),
    },
  ];
  return (
    <Modal
      className="flex justify-center items-center z-[1000]"
      open={props.isAddKnowledgeSpaceModalShow}
      onClose={() => props.setIsAddKnowledgeSpaceModalShow(false)}
    >
      <Sheet variant="outlined" className="w-[800px] rounded-md shadow-lg p-6">
        <Box className="w-full">
          <Stack spacing={2} direction="row">
            {stepsOfAddingSpace.map((item: any, index: number) => (
              <Item
                key={item}
                sx={{
                  fontWeight: activeStep === index ? 'bold' : '',
                  color: activeStep === index ? '#2AA3FF' : '',
                }}
              >
                {index < activeStep ? <CheckCircleOutlinedIcon /> : `${index + 1}.`}
                {`${item}`}
              </Item>
            ))}
          </Stack>
        </Box>
        {activeStep === 0 ? (
          <>
            <Box className="my-[30px] mx-auto">
              {t('Knowledge_Space_Name')}:
              <Input placeholder={t('Please_input_the_name')} onChange={(e: any) => setKnowledgeSpaceName(e.target.value)} className="mb-5" />
              {t('Owner')}:
              <Input placeholder={t('Please_input_the_owner')} onChange={(e: any) => setOwner(e.target.value)} className="mb-5" />
              {t('Description')}:
              <Input placeholder={t('Please_input_the_description')} onChange={(e: any) => setDescription(e.target.value)} className="mb-5" />
            </Box>
            <Button
              variant="outlined"
              onClick={async () => {
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
                const data = await sendSpacePostRequest(`/knowledge/space/add`, {
                  name: knowledgeSpaceName,
                  vector_type: 'Chroma',
                  owner,
                  desc: description,
                });
                if (data.success) {
                  message.success('success');
                  setActiveStep(1);
                  const data = await sendSpacePostRequest('/knowledge/space/list', {});
                  if (data.success) {
                    props.setKnowledgeSpaceList(data.data);
                  }
                } else {
                  message.error(data.err_msg || 'failed');
                }
              }}
            >
              {t('Next')}
            </Button>
          </>
        ) : activeStep === 1 ? (
          <>
            <Box sx={{ margin: '30px auto' }}>
              {documentTypeList.map((item: any) => (
                <Sheet
                  key={item.type}
                  sx={{
                    boxSizing: 'border-box',
                    height: '80px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid gray',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setDocumentType(item.type);
                    setActiveStep(2);
                  }}
                >
                  <Sheet sx={{ fontSize: '20px', fontWeight: 'bold' }}>{item.title}</Sheet>
                  <Sheet>{item.subTitle}</Sheet>
                </Sheet>
              ))}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ margin: '30px auto' }}>
              {t('Name')}:
              <Input placeholder={t('Please_input_the_name')} onChange={(e: any) => setDocumentName(e.target.value)} sx={{ marginBottom: '20px' }} />
              {documentType === 'webPage' ? (
                <>
                  {t('Web_Page_URL')}:
                  <Input placeholder={t('Please_input_the_Web_Page_URL')} onChange={(e: any) => setWebPageUrl(e.target.value)} />
                </>
              ) : documentType === 'file' ? (
                <>
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p style={{ color: 'rgb(22, 108, 255)', fontSize: '20px' }}>{t('Select_or_Drop_file')}</p>
                    <p className="ant-upload-hint" style={{ color: 'rgb(22, 108, 255)' }}>
                      PDF, PowerPoint, Excel, Word, Text, Markdown,
                    </p>
                  </Dragger>
                </>
              ) : (
                <>
                  {t('Text_Source')}:
                  <Input
                    placeholder={t('Please_input_the_text_source')}
                    onChange={(e: any) => setTextSource(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                  />
                  {t('Text')}:
                  <Textarea onChange={(e: any) => setText(e.target.value)} minRows={4} maxRows={4} sx={{ marginBottom: '20px' }} />
                </>
              )}
              <Typography
                component="label"
                sx={{
                  marginTop: '20px',
                }}
                endDecorator={<Switch checked={synchChecked} onChange={(event: any) => setSynchChecked(event.target.checked)} />}
              >
                {t('Synch')}:
              </Typography>
            </Box>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ marginBottom: '20px' }}>
              <Button variant="outlined" sx={{ marginRight: '20px' }} onClick={() => setActiveStep(1)}>
                {`< ${t('Back')}`}
              </Button>
              <Button
                variant="outlined"
                onClick={async () => {
                  if (documentName === '') {
                    message.error(t('Please_input_the_name'));
                    return;
                  }
                  if (documentType === 'webPage') {
                    if (webPageUrl === '') {
                      message.error(t('Please_input_the_text_source'));
                      return;
                    }
                    const data = await sendSpacePostRequest(`/knowledge/${knowledgeSpaceName}/document/add`, {
                      doc_name: documentName,
                      content: webPageUrl,
                      doc_type: 'URL',
                    });
                    if (data.success) {
                      message.success('success');
                      props.setIsAddKnowledgeSpaceModalShow(false);
                      synchChecked &&
                        sendSpacePostRequest(`/knowledge/${knowledgeSpaceName}/document/sync`, {
                          doc_ids: [data.data],
                        });
                    } else {
                      message.error(data.err_msg || 'failed');
                    }
                  } else if (documentType === 'file') {
                    if (!originFileObj) {
                      message.error(t('Please_select_a_file'));
                      return;
                    }
                    const formData = new FormData();
                    formData.append('doc_name', documentName);
                    formData.append('doc_file', originFileObj);
                    formData.append('doc_type', 'DOCUMENT');

                    const data = await sendSpaceUploadPostRequest(`/knowledge/${knowledgeSpaceName}/document/upload`, formData);
                    if (data.success) {
                      message.success('success');
                      props.setIsAddKnowledgeSpaceModalShow(false);
                      synchChecked &&
                        sendSpacePostRequest(`/knowledge/${knowledgeSpaceName}/document/sync`, {
                          doc_ids: [data.data],
                        });
                    } else {
                      message.error(data.err_msg || 'failed');
                    }
                  } else {
                    if (text === '') {
                      message.error(t('Please_input_the_text'));
                      return;
                    }
                    const data = await sendSpacePostRequest(`/knowledge/${knowledgeSpaceName}/document/add`, {
                      doc_name: documentName,
                      source: textSource,
                      content: text,
                      doc_type: 'TEXT',
                    });
                    if (data.success) {
                      message.success('success');
                      props.setIsAddKnowledgeSpaceModalShow(false);
                      synchChecked &&
                        sendSpacePostRequest(`/knowledge/${knowledgeSpaceName}/document/sync`, {
                          doc_ids: [data.data],
                        });
                    } else {
                      message.error(data.err_msg || 'failed');
                    }
                  }
                }}
              >
                {t('Finish')}
              </Button>
            </Stack>
          </>
        )}
      </Sheet>
    </Modal>
  );
}
