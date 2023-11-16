import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, syncDocument, uploadDocument } from '@/client/api';

import useSummary from '@/hooks/use-summary';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useContext, useState } from 'react';

interface IProps {
  className?: string;
  setLoading?: (data: boolean) => void;
  fetchDocuments: () => void;
}
export default function DocUpload(props: IProps) {
  const { dbParam, setDocId } = useContext(ChatContext);
  const { fetchDocuments } = props;
  const summary = useSummary();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSync = async (knowledgeName: string, id: number) => {
    await apiInterceptors(syncDocument(knowledgeName, { doc_ids: [id] }));
  };
  const handleUpload = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('doc_name', data.file.name);
    formData.append('doc_file', data.file);
    formData.append('doc_type', 'DOCUMENT');

    const res = await apiInterceptors(uploadDocument(dbParam || 'default', formData));

    if (!res[1]) {
      setLoading(false);
      return;
    }
    setDocId(res[1]);
    fetchDocuments();
    await handleSync(dbParam || 'default', res?.[1] as number);
    setLoading(false);
    // sent message button loading
    props.setLoading?.(true);
    await summary(res[1]);
    props.setLoading?.(false);
  };

  return (
    <Upload
      customRequest={handleUpload}
      showUploadList={false}
      maxCount={1}
      multiple={false}
      className={`${props.className}`}
      accept=".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docx,.txt,.md"
    >
      <Button loading={loading} size="small" shape="circle" icon={<PaperClipOutlined />}></Button>
    </Upload>
  );
}
