import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, Spin, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { IPrompt } from '@/types/prompt';

interface IProps {
  prompt?: IPrompt;
  handleAddPrompt: (prompt: IPrompt) => void;
  handleUpdatePrompt: (prompt: IPrompt) => void;
  handleClose: () => void;
  promptList?: Array<IPrompt>;
}

export default function PromptForm(props: IProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { prompt, handleAddPrompt, handleUpdatePrompt, handleClose, promptList } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt) {
      form.setFieldsValue(prompt);
    } else {
      form.setFieldsValue({
        chat_scene: sceneList[0]?.value,
        sub_chat_scene: subSceneList[0]?.value,
      });
    }
  }, []);

  const submit = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    if (prompt) {
      await handleUpdatePrompt(values);
    } else {
      await handleAddPrompt(values);
    }
    setLoading(false);
  };

  const sceneList = useMemo(() => {
    return [...Array.from(new Set(promptList?.map((prompt) => prompt.chat_scene)))].map((scene) => ({ value: scene, label: scene }));
  }, [promptList]);

  const subSceneList = useMemo(() => {
    return [...Array.from(new Set(promptList?.map((prompt) => prompt.sub_chat_scene)))].map((subScene) => ({ value: subScene, label: subScene }));
  }, [promptList]);

  return (
    <Spin spinning={loading}>
      <Form form={form} name={`prompt-item-${prompt?.prompt_name || 'new'}`} layout="vertical" className="mt-4" onFinish={submit}>
        <Form.Item name="chat_scene" label={t('Prompt_Info_Scene')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Scene') }]}>
          <Select options={sceneList} defaultValue={sceneList[0]?.value}></Select>
        </Form.Item>
        <Form.Item
          name="sub_chat_scene"
          label={t('Prompt_Info_Sub_Scene')}
          rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Sub_Scene') }]}
        >
          <Select options={subSceneList} defaultValue={subSceneList[0]?.value}></Select>
        </Form.Item>
        <Form.Item name="prompt_name" label={t('Prompt_Info_Name')} rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Name') }]}>
          <Input disabled={!!prompt} />
        </Form.Item>
        <Form.Item
          name="content"
          label={t('Prompt_Info_Content')}
          rules={[{ required: true, message: t('Please_Input') + t('Prompt_Info_Content') }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 15,
            span: 10,
          }}
        >
          <Button onClick={handleClose} className="mr-2">
            {t('cancel')}
          </Button>
          <Button type="primary" htmlType="submit">
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
