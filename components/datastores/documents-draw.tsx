import React, { useEffect, useState } from 'react';
import { Drawer, Button, Card, Space } from 'antd';
import { IKnowLedge } from '@/types/knowledge';
import { sendSpacePostRequest } from '@/utils/request';
import { PlusOutlined, DeleteFilled, InteractionFilled, EditFilled, ToolFilled } from '@ant-design/icons';
import moment from 'moment';

interface IProps {
  draw: { open: boolean; knowledge?: IKnowLedge | null };
  setDraw: (draw: { open: boolean }) => void;
}

export default function DocumentsDraw(props: IProps) {
  const page_size = 20;
  const { draw, setDraw } = props;
  const { knowledge } = draw;

  const [total, setTotal] = useState<number>(0);
  const [documents, setDocuments] = useState<any>([]);
  const [current, setCurrent] = useState<number>(0);

  async function fetchDocuments() {
    const data = await sendSpacePostRequest(`/knowledge/${knowledge?.name}/document/list`, {
      page: 1,
      page_size,
    });

    if (data.success) {
      setDocuments(data.data.data);
      setTotal(data.data.total);
      setCurrent(data.data.page);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, [knowledge]);

  console.log(documents);

  return (
    <Drawer
      placement="bottom"
      height={700}
      title={knowledge?.name}
      onClose={() => {
        setDraw({ open: false });
      }}
      extra={
        <Space>
          <Button type="primary" className="flex items-center" icon={<PlusOutlined />}>
            Add DataSource
          </Button>
          <Button className="flex items-center mx-4" icon={<ToolFilled />}>
            Arguments
          </Button>
        </Space>
      }
      open={draw.open}
    >
      <>
        {documents.map((item: any) => {
          return (
            <Card
              key={item.vector_ids}
              title={item.doc_name}
              extra={
                <>
                  <EditFilled className="mr-2" style={{ color: '#1b7eff' }} onClick={() => {}} />
                  <InteractionFilled
                    className="mr-2"
                    style={{ color: '#1b7eff' }}
                    onClick={() => {
                      // onModify(item);
                    }}
                  />
                  <DeleteFilled
                    style={{ color: '#ff1b2e' }}
                    onClick={() => {
                      // onDelete(item);
                    }}
                  />
                </>
              }
            >
              <p>type: {item.doc_type}</p>
              <p>size: {item.chunk_size} chunks</p>
              <p>Last Synch: {moment(item.last_sync).format('YYYY-MM-DD HH:MM:SS')}</p>
              <p>Status: {item.status}</p>
              <p>Result: {item.status}</p>
            </Card>
          );
        })}
      </>
    </Drawer>
  );
}
