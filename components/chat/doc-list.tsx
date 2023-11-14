import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, getDocumentList } from '@/client/api';
import { IDocument } from '@/types/knowledge';
import { FileTwoTone, ReadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

export default function DocList() {
  const page_size = 20;
  const { dbParam } = useContext(ChatContext);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, [dbParam]);

  async function fetchDocuments() {
    if (!dbParam) {
      return null;
    }

    const [_, data] = await apiInterceptors(
      getDocumentList(dbParam, {
        page: 1,
        page_size,
      }),
    );
    setDocuments(data?.data!);
  }

  const handleClick = (id: number) => {
    router.push(`/knowledge/chunk/?spaceName=${dbParam}&id=${id}`);
  };

  if (!documents?.length) return null;

  return (
    <div className="absolute flex overflow-scroll h-12 top-[-35px] w-full z-10">
      {documents.map((doc) => {
        return (
          <Button
            onClick={() => {
              handleClick(doc.id);
            }}
            key={doc.id}
            className="shrink flex items-center mr-3"
          >
            <FileTwoTone className="mr-2" />
            {doc.doc_name}
          </Button>
        );
      })}
    </div>
  );
}
