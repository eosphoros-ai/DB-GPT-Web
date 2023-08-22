/* eslint-disable react-hooks/exhaustive-deps */
import { dbOptions, isFileDb } from '@/app/database/page';
import { IDatabaseItem, IResponseModal } from '@/types';
import { Button, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from '@/utils/ctx-axios';

interface Props {
  open: boolean;
  editValue?: IDatabaseItem;
  dbNames: string[];
  onSuccess?: () => void;
  onClose?: () => void;
}

function FormDialog({ open, editValue, dbNames, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<IDatabaseItem>();
  const dbType = Form.useWatch('db_type', form);

  useEffect(() => {
    if (editValue) {
      form.setFieldsValue({ ...editValue });
    }
  }, [editValue]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  const onFinish = async (val: IDatabaseItem) => {
    const { db_host, db_path, db_port, ...params } = val;
    if (!editValue && dbNames.some((item) => item === params.db_name)) {
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
    setLoading(true);
    try {
      let res: IResponseModal<null>;
      if (editValue) {
        res = await axios.post<typeof data, IResponseModal<null>>('/api/v1/chat/db/edit', data);
      } else {
        res = await axios.post<typeof data, IResponseModal<null>>('/api/v1/chat/db/add', data);
      }
      if (!res.success) {
        message.error(res.err_msg);
        return;
      }
      message.success('success');
      onSuccess?.();
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} width={400} title={editValue ? 'Edit DB Connect' : 'Create DB Connenct'} maskClosable={false} footer={null} onCancel={onClose}>
      <Form form={form} className="pt-2" labelCol={{ span: 6 }} labelAlign="left" onFinish={onFinish}>
        <Form.Item name="db_type" label="SQL Type" className="mb-3" rules={[{ required: true }]}>
          <Select options={dbOptions} />
        </Form.Item>
        <Form.Item name="db_name" label="DB Name" className="mb-3" rules={[{ required: true }]}>
          <Input readOnly={!!editValue} disabled={!!editValue} />
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
          <Button htmlType="submit" type="primary" size="middle" className="mr-1" loading={loading}>
            Save
          </Button>
          <Button size="middle" onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FormDialog;
