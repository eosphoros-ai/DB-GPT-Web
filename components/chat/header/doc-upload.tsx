import { apiInterceptors, syncDocument, uploadDocument } from '@/client/api';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadFile } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DocUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { t } = useTranslation();

  const handleFileChange = () => {};

  const handleSync = async (knowledgeName: string, id: number) => {
    await apiInterceptors(syncDocument(knowledgeName, { doc_ids: [id] }));
  };
  const handleUpload = async (data: any) => {
    const spaceName = 'bb';
    const formData = new FormData();
    formData.append('doc_name', data.file.name);
    formData.append('doc_file', data.file);
    formData.append('doc_type', 'DOCUMENT');
    const res = await apiInterceptors(uploadDocument(spaceName, formData));
    await handleSync(spaceName, res?.[1] as number);
  };
  return (
    <Upload
      customRequest={handleUpload}
      showUploadList={false}
      maxCount={1}
      multiple={false}
      onChange={handleFileChange}
      accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.md"
    >
      <Button size="small" shape="circle" icon={<UploadOutlined />}></Button>
    </Upload>
  );
}
