import { useState } from 'react';
import { Modal, Form, Select, Input, Spin, Button, message } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';

const PromptModal = ({ children, prompt_type, item, mutate, setTableParams, pageSize }: any) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onOpenModal = () => {
    setShow(true);
    if (item) {
      form.setFieldsValue(item);
    }
  };

  const handleCancel = () => {
    setShow(false);
    form.resetFields();
  };

  const submit = async () => {
    try {
      const values = form.getFieldsValue();
      const params = { prompt_type, ...values };
      setLoading(true);
      if (item) {
        // 编辑
        const res: any = await sendSpacePostRequest('/prompt/update', params);
        if (res.success) {
          mutate(({ data }: any) => {
            return {
              data: data.map((it: any) => {
                if (it.prompt_name === item.prompt_name) return { ...it, ...values };
                return it;
              }),
            };
          });
          message.success('编辑成功');
          setLoading(false);
          setShow(false);
        } else {
          setLoading(false);
          message.error(res?.err_msg);
        }
      } else {
        // 新增
        const res: any = await sendSpacePostRequest('/prompt/add', params);
        if (res.success) {
          mutate(({ data }: any) => {
            const newList = data.length >= pageSize ? data.slice(0, -1) : data;
            return {
              data: [params, ...newList],
            };
          });
          setTableParams((prevParams: any) => ({
            ...prevParams,
            pagination: {
              ...prevParams.pagination,
              total: prevParams.pagination.total + 1,
            },
          }));
          message.success('新增成功');
          setLoading(false);
          setShow(false);
        } else {
          setLoading(false);
          message.error(res?.err_msg);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error('出错了');
    }
  };

  return (
    <>
      <div className="inline-block" onClick={onOpenModal}>
        {children}
      </div>
      <Modal title={item ? '编辑 Prompts' : '新建 Prompts'} open={show} onCancel={handleCancel} footer={null}>
        <Spin spinning={loading}>
          <Form form={form} name={`prompt-item-${item?.prompt_name || 'new'}`} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={submit}>
            <Form.Item name="chat_scene" label="场景" rules={[{ required: true, message: '请输入场景' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="sub_chat_scene" label="次级场景" rules={[{ required: true, message: '请输入次级场景' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="prompt_name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
              <Input disabled={!!item} />
            </Form.Item>
            <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 17,
                span: 7,
              }}
            >
              <Button onClick={handleCancel} className="mr-2">
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default PromptModal;
