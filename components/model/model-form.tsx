import { apiInterceptors, getSupportModels, startModel } from '@/client/api';
import { SupportModel, SupportModelParams } from '@/types/model';
import { Button, Form, Select, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { renderModelIcon } from '@/components/chat/header/model-selector';
import ModelParams from './model-params';
const { Option } = Select;

function ModelForm() {
  const { t } = useTranslation();
  const [models, setModels] = useState<Array<SupportModel> | null>([]);
  const [selectedModel, setSelectedModel] = useState<SupportModel>();
  const [params, setParams] = useState<Array<SupportModelParams> | null>(null);

  async function getModels() {
    const [, res] = await apiInterceptors(getSupportModels());
    setModels(res);
  }

  useEffect(() => {
    getModels();
  }, []);

  function handleChange(value: string, option: any) {
    setSelectedModel(option.model);
    setParams(option.model.params);
  }

  async function onFinish(values: any) {
    if (!selectedModel) {
      return;
    }
    const [, res] = await apiInterceptors(
      startModel({
        host: selectedModel.host,
        port: selectedModel.port,
        model: selectedModel.model,
        worker_type: selectedModel?.worker_type,
        params: values,
      }),
    );
    if (res === true) {
      return message.success(t('start_model_success'));
    }
  }

  return (
    <div className="">
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
        <Form.Item label="Model" name="model" rules={[{ required: true, message: t('model_select_tips') }]}>
          <Select onChange={handleChange}>
            {models?.map((model) => (
              <Option key={model.model} value={model.model} label={model.model} model={model}>
                {renderModelIcon(model.model)}
                <Tooltip title={model.model}>
                  <span>{model.model}</span>
                </Tooltip>
                <p className="inline-block absolute right-4">
                  <span>{model.host}:</span>
                  <span>{model.port}</span>
                </p>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <ModelParams params={params} />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ModelForm;