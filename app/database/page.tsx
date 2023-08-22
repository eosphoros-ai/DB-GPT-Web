'use client';

import React, { useState } from 'react';
import { IDatabaseItem } from '@/types';
import { Add, EditNote, DeleteOutline, Error } from '@mui/icons-material';
import { useRequest } from 'ahooks';
import { sendGetRequest, sendSpacePostRequest } from '@/utils/request';
import { Button, Card, CardContent, Tooltip } from '@/lib/mui';
import MuiLoading from '@/components/MuiLoading';
import Image from 'next/image';
import { Form, Input, InputNumber, Modal, Select, Button as AntButton, message } from 'antd';

type DatabaseType = IDatabaseItem['db_type'];

const iconMap: Record<DatabaseType, string> = {
  mysql: '/icons/mysql.png',
  mssql: '/icons/mssql.png',
  duckdb: '/icons/sql.png',
};

const dbOptions: { value: DatabaseType; label: string; isFileDb?: boolean }[] = [
  { label: 'Mysql', value: 'mysql' },
  { label: 'Mssql', value: 'mssql' },
  { label: 'Duckdb', value: 'duckdb', isFileDb: true },
];

function isFileDb(dbType: DatabaseType) {
  return dbOptions.find((item) => item.value === dbType)?.isFileDb;
}

function Database() {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; isModify?: boolean }>({
    open: false,
  });

  const [form] = Form.useForm<IDatabaseItem>();
  const dbType = Form.useWatch('db_type', form);
  const { data: { data: dbList } = { data: [] }, run: runDbList } = useRequest(async () => {
    try {
      setLoading(true);
      return await sendGetRequest('/v1/chat/db/list');
    } finally {
      setLoading(false);
    }
  });

  const onModify = (item: IDatabaseItem) => {
    setModal({ open: true, isModify: true });
    form.setFieldsValue({ ...item });
  };

  const onCancel = () => {
    setModal({ open: false, isModify: undefined });
    form.resetFields();
  };

  const onFinish = async (val: IDatabaseItem) => {
    const { db_host, db_path, db_port, ...params } = val;
    if (!modal.isModify && (dbList as IDatabaseItem[]).some((item) => item.db_name === params.db_name)) {
      message.error('The database already exists!');
      return;
    }
    const fileDb = isFileDb(dbType);
    const data: Partial<IDatabaseItem & { file_path: string }> = {
      db_host: fileDb ? undefined : db_host,
      db_port: fileDb ? undefined : db_port,
      file_path: fileDb ? db_path : undefined,
      ...params,
    };
    setSubmitLoading(true);
    console.log(data);
    try {
      if (modal.isModify) {
        await sendSpacePostRequest('/api/v1/chat/db/edit', data);
      } else {
        await sendSpacePostRequest('/api/v1/chat/db/add', data);
      }
      message.success('success');
      onCancel();
      runDbList();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onDelete = (item: IDatabaseItem) => {
    Modal.confirm({
      title: 'Tips',
      content: `Do you Want to delete the ${item.db_name}?`,
      onOk: async () => {
        await sendSpacePostRequest(`/api/v1/chat/db/delete?db_name=${item.db_name}`);
        runDbList();
      },
    });
  };

  return (
    <div className="relative p-4 bg-slate-50 dark:bg-transparent min-h-full overflow-y-auto">
      <MuiLoading visible={loading} />
      <div className="px-1 mb-4">
        <Button
          type="primary"
          size="sm"
          onClick={() => {
            setModal({ open: true });
          }}
        >
          <Add fontSize="small" />
          Create
        </Button>
      </div>
      <div className="flex flex-wrap">
        {(dbList as IDatabaseItem[]).map((item) => {
          const fileDb = isFileDb(item.db_type);
          return (
            <div key={item.db_name} className="px-1 w-full mb-2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
              <Card
                variant="outlined"
                sx={{
                  boxShadow: 'unset',
                  transition: 'box-shadow .3s ease',
                  ':hover': {
                    boxShadow: '0 10px 16px -6px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center flex-wrap">
                    <Image
                      className="rounded-full border border-gray-200 mr-3"
                      src={iconMap[item.db_type]}
                      alt={item.db_type}
                      width={44}
                      height={44}
                      unoptimized
                    />
                    <Tooltip title={item.db_name}>
                      <div className="flex flex-col flex-1 ">
                        <span className="text-xs text-gray-500 font-normal">[{item.db_type}]</span>
                        <div className="font-bold text-base line-clamp-1 break-all">{item.db_name}</div>
                      </div>
                    </Tooltip>
                  </div>
                  {/* operation */}
                  <div className="flex items-center justify-center">
                    <div
                      className="mr-1 cursor-pointer"
                      onClick={() => {
                        onModify(item);
                      }}
                    >
                      <EditNote color="primary" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        onDelete(item);
                      }}
                    >
                      <DeleteOutline className="text-red-500" />
                    </div>
                  </div>
                </div>
                <CardContent>
                  <div className="flex items-center justify-start text-sm text-gray-500">
                    <label className="w-20">Username:</label>
                    <span>{item.db_user}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-gray-500">
                    <label className="w-20">{fileDb ? 'Path' : 'Host'}:</label>
                    <span>{fileDb ? item.db_path : item.db_host}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-gray-500">
                    <label className="w-20">Port:</label>
                    <span>{fileDb ? '-' : item.db_port}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-gray-500">
                    <label className="w-20">Remark:</label>
                    <span>{item.comment}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      <Modal
        open={modal.open}
        width={400}
        title={modal.isModify ? 'Edit DB Connect' : 'Create DB Connenct'}
        maskClosable={false}
        footer={null}
        onCancel={onCancel}
      >
        <Form form={form} className="pt-2" labelCol={{ span: 6 }} labelAlign="left" onFinish={onFinish}>
          <Form.Item name="db_type" label="SQL Type" className="mb-3" rules={[{ required: true }]}>
            <Select options={dbOptions} />
          </Form.Item>
          <Form.Item name="db_name" label="DB Name" className="mb-3" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="db_user" label="Username" className="mb-3" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="db_pwd" label="Password" className="mb-3" rules={[{ required: true }]}>
            <Input type="password" />
          </Form.Item>
          {isFileDb(dbType) ? (
            <Form.Item name="db_path" label="Path" className="mb-3" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : (
            <Form.Item name="db_host" label="Host" className="mb-3" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}
          {!isFileDb(dbType) && (
            <Form.Item name="db_port" label="Port" className="mb-3" rules={[{ required: true }]}>
              <InputNumber min={1} step={1} max={65535} />
            </Form.Item>
          )}
          <Form.Item name="comment" label="Remark" className="mb-3">
            <Input />
          </Form.Item>
          <Form.Item className="flex flex-row-reverse pt-1 mb-0">
            <AntButton htmlType="submit" type="primary" size="middle" className="mr-1" loading={submitLoading}>
              Save
            </AntButton>
            <AntButton size="middle" onClick={onCancel}>
              Cancel
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Database;
