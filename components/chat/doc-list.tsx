import { IDocument } from '@/types/knowledge';
import { FileTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

interface IProps {
  documents: IDocument[];
  dbParam?: string;
}

export default function DocList(props: IProps) {
  const { documents, dbParam } = props;
  const router = useRouter();

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
