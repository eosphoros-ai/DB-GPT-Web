import React, { useState } from 'react';
import {
  useColorScheme,
  Button,
  Table,
  Sheet,
  Modal,
  Box,
  Stack,
  Input,
  Textarea,
  Chip,
  Switch,
  Typography,
  Breadcrumbs,
  Link,
  styled,
} from '@/lib/mui';
import { Upload, Pagination, Popover, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { sendSpacePostRequest, sendSpaceUploadPostRequest } from '@/utils/request';

const { Dragger } = Upload;
const page_size = 20;
export default function AddDocumentModal(props: any) {
  const { isAddDocumentModalShow, setIsAddDocumentModalShow, knowLedge } = props;
  const { t } = useTranslation();
  const [documentName, setDocumentName] = useState<any>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [textSource, setTextSource] = useState<string>('');
  const [webPageUrl, setWebPageUrl] = useState<string>('');
  const [synchChecked, setSynchChecked] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const [documents, setDocuments] = useState<any>([]);
  const [current, setCurrent] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [originFileObj, setOriginFileObj] = useState<any>(null);
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
  const stepsOfAddingDocument = [t('Choose_a_Datasource_type'), t('Setup_the_Datasource')];
  const Item = styled(Sheet)(({ theme }) => ({
    width: '50%',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
  }));

  return (
    <Modal
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        'z-index': 1000,
      }}
      open={isAddDocumentModalShow}
      onClose={() => setIsAddDocumentModalShow(false)}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 800,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack spacing={2} direction="row">
            {stepsOfAddingDocument.map((item: any, index: number) => (
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
                    setActiveStep(1);
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
                  <Dragger {...props}>
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
              <Button variant="outlined" sx={{ marginRight: '20px' }} onClick={() => setActiveStep(0)}>
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
                      message.error(t('Please_input_the_Web_Page_URL'));
                      return;
                    }
                    const data = await sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/add`, {
                      doc_name: documentName,
                      content: webPageUrl,
                      doc_type: 'URL',
                    });
                    data.success &&
                      synchChecked &&
                      sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/sync`, {
                        doc_ids: [data.data],
                      });
                    if (data.success) {
                      message.success('success');
                      setIsAddDocumentModalShow(false);
                      const data = await sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/list`, {
                        page: current,
                        page_size,
                      });
                      if (data.success) {
                        setDocuments(data.data.data);
                        setTotal(data.data.total);
                        setCurrent(data.data.page);
                      }
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
                    const data = await sendSpaceUploadPostRequest(`/knowledge/${knowLedge?.name}/document/upload`, formData);
                    data.success &&
                      synchChecked &&
                      sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/sync`, {
                        doc_ids: [data.data],
                      });
                    if (data.success) {
                      message.success('success');
                      setIsAddDocumentModalShow(false);
                      const data = await sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/list`, {
                        page: current,
                        page_size,
                      });
                      if (data.success) {
                        setDocuments(data.data.data);
                        setTotal(data.data.total);
                        setCurrent(data.data.page);
                      }
                    } else {
                      message.error(data.err_msg || 'failed');
                    }
                  } else {
                    if (text === '') {
                      message.error(t('Please_input_the_text'));
                      return;
                    }
                    const data = await sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/add`, {
                      doc_name: documentName,
                      source: textSource,
                      content: text,
                      doc_type: 'TEXT',
                    });
                    data.success &&
                      synchChecked &&
                      sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/sync`, {
                        doc_ids: [data.data],
                      });
                    if (data.success) {
                      message.success('success');
                      setIsAddDocumentModalShow(false);
                      const data = await sendSpacePostRequest(`/knowledge/${knowLedge?.name}/document/list`, {
                        page: current,
                        page_size,
                      });
                      if (data.success) {
                        setDocuments(data.data.data);
                        setTotal(data.data.total);
                        setCurrent(data.data.page);
                      }
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
