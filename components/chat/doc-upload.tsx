import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, syncDocument, uploadDocument } from '@/client/api';
import useChat from '@/hooks/use-chat';
import { ChatHistoryResponse } from '@/types/chat';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  className?: string;
}
export default function DocUpload(props: IProps) {
  const { t } = useTranslation();
  const { history, setHistory, chatId, model, dbParam } = useContext(ChatContext);
  const chat = useChat({ queryAgentURL: '/knowledge/document/summary' });
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

    await handleSync(dbParam || 'default', res?.[1] as number);
    const tempHistory: ChatHistoryResponse = [
      ...history,
      { role: 'human', context: '', model_name: model, order: 0, time_stamp: 0 },
      { role: 'view', context: '', model_name: model, order: 0, time_stamp: 0 },
    ];
    const index = tempHistory.length - 1;
    setHistory([...tempHistory]);
    setLoading(false);
    chat({
      data: {
        doc_id: res?.[1],
        model_name: 'proxyllm',
      },
      chatId,
      onMessage: (message) => {
        tempHistory[index].context = message;
        setHistory([...tempHistory]);
      },
    });
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
      <Button loading={loading} size="small" shape="circle" icon={<UploadOutlined />}></Button>
    </Upload>
  );
}
