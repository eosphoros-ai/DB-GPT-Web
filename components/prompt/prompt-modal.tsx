import { useState } from 'react';
import { Modal, Form, Select, Input, Spin, Button, message } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import { useTranslation } from 'react-i18next';


const PromptModal = ({ children, prompt_type, item, mutate, setTableParams, pageSize }: any) => {
  const { t } = useTranslation();
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
        // edit
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
          message.success(t('Edit_Success'));
          setLoading(false);
          setShow(false);
        } else {
          setLoading(false);
          message.error(res?.err_msg);
        }
      } else {
        // add new
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
          message.success(t('Add_Success'));
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
      message.error(t('Error_Message'));
    }
  };

  return (
    <>
      <div className="inline-block" onClick={onOpenModal}>
        {children}
      </div>
      <Modal title={item ? t('Edit')+' Prompts' : t('Add') + ' Prompts'} open={show} onCancel={handleCancel} footer={null}>
        <Spin spinning={loading}>
          <Form form={form} name={`prompt-item-${item?.prompt_name || 'new'}`} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={submit}>
            <Form.Item name="chat_scene" label={t('Prompt_Info_Scene')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Scene') }]}>
              <Input />
            </Form.Item>
            <Form.Item name="sub_chat_scene" label={t('Prompt_Info_Sub_Scene')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Sub_Scene') }]}>
              <Input />
            </Form.Item>
            <Form.Item name="prompt_name" label={t('Prompt_Info_Name')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Name') }]}>
              <Input disabled={!!item} />
            </Form.Item>
            <Form.Item name="content" label={t('Prompt_Info_Content')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Content') }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 15,
                span: 10,
              }}
            >
              <Button onClick={handleCancel} className="mr-2">
                {t('cancel')}
              </Button>
              <Button type="primary" htmlType="submit">
                {t('submit')}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default PromptModal;
