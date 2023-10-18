import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Button, Input, Form, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { AlertFilled, FileSearchOutlined } from '@ant-design/icons';
import { apiInterceptors, getArguments, saveArguments } from '@/client/api';
import { IArguments, ISpace } from '@/types/knowledge';

const { TextArea } = Input;

interface IProps {
  space: ISpace;
  argumentsShow: boolean;
  setArgumentsShow: (argumentsShow: boolean) => void;
}

export default function ArgumentsModal({ space, argumentsShow, setArgumentsShow }: IProps) {
  const { t } = useTranslation();
  const [newSpaceArguments, setNewSpaceArguments] = useState<IArguments | null>();

  const fetchArguments = async () => {
    const [_, data] = await apiInterceptors(getArguments(space.name));
    setNewSpaceArguments(data);
  };

  useEffect(() => {
    fetchArguments();
  }, []);

  const renderEmbeddingForm = () => {
    return (
      <Row gutter={24}>
        <Col span={12} offset={0}>
          <Form.Item<IArguments> tooltip={t(`the_top_k_vectors`)} rules={[{ required: true }]} label={t('topk')} name={['embedding', 'topk']}>
            <Input className="mb-5 h-12" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<IArguments>
            tooltip={t(`Set_a_threshold_score`)}
            rules={[{ required: true }]}
            label={t('recall_score')}
            name={['embedding', 'recall_score']}
          >
            <Input className="mb-5  h-12" placeholder={t('Please_input_the_owner')} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<IArguments> tooltip={t(`Recall_Type`)} rules={[{ required: true }]} label={t('recall_type')} name={['embedding', 'recall_type']}>
            <Input className="mb-5  h-12" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<IArguments> tooltip={t(`A_model_used`)} rules={[{ required: true }]} label={t('model')} name={['embedding', 'model']}>
            <Input className="mb-5  h-12" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<IArguments>
            tooltip={t(`The_size_of_the_data_chunks`)}
            rules={[{ required: true }]}
            label={t('chunk_size')}
            name={['embedding', 'chunk_size']}
          >
            <Input className="mb-5  h-12" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<IArguments>
            tooltip={t(`The_amount_of_overlap`)}
            rules={[{ required: true }]}
            label={t('chunk_overlap')}
            name={['embedding', 'chunk_overlap']}
          >
            <Input className="mb-5  h-12" placeholder={t('Please_input_the_description')} />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderPromptForm = () => {
    return (
      <>
        <Form.Item<IArguments> tooltip={t(`A_contextual_parameter`)} label={t('scene')} name={['prompt', 'scene']}>
          <TextArea rows={4} className="mb-2" />
        </Form.Item>
        <Form.Item<IArguments> tooltip={t(`structure_or_format`)} label={t('template')} name={['prompt', 'template']}>
          <TextArea rows={7} className="mb-2" />
        </Form.Item>
        <Form.Item<IArguments> tooltip={t(`The_maximum_number_of_tokens`)} label={t('max_token')} name={['prompt', 'max_token']}>
          <Input className="mb-2" />
        </Form.Item>
      </>
    );
  };

  const items = [
    {
      key: 'Embedding',
      label: (
        <div>
          <FileSearchOutlined />
          {t('Embedding')}
        </div>
      ),
      children: renderEmbeddingForm(),
    },
    {
      key: 'Prompt',
      label: (
        <div>
          <AlertFilled />
          {t('Embedding')}
        </div>
      ),
      children: renderPromptForm(),
    },
  ];

  const handleSubmit = async (fieldsValue: IArguments) => {
    const [_, data, res] = await apiInterceptors(
      saveArguments(space.name, {
        argument: JSON.stringify(fieldsValue),
      }),
    );
    res?.success && setArgumentsShow(false);
  };

  return (
    <Modal
      width={850}
      open={argumentsShow}
      onCancel={() => {
        setArgumentsShow(false);
      }}
      footer={null}
    >
      <Form
        size="large"
        className="mt-4"
        layout="vertical"
        name="basic"
        initialValues={{ ...newSpaceArguments }}
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Tabs items={items}></Tabs>
        <div className="mt-3 mb-3">
          <Button htmlType="submit" type="primary" className="mr-6">
            {t('Submit')}
          </Button>
          <Button
            onClick={() => {
              setArgumentsShow(false);
            }}
          >
            {t('close')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
