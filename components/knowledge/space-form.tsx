import { addKnowledge, apiInterceptors } from '@/client/api';
import { Button, Form, Input, Spin } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FieldType = {
  spaceName: string;
  owner: string;
  description: string;
};

type IProps = {
  handleAddSpace: (name: string) => void;
};

export default function SpaceForm(props: IProps) {
  const { t } = useTranslation();
  const { handleAddSpace } = props;
  const [spinning, setSpinning] = useState<boolean>(false);

  const handleFinish = async (fieldsValue: FieldType) => {
    const { spaceName, owner, description } = fieldsValue;
    setSpinning(true);
    const [_, data, res] = await apiInterceptors(
      addKnowledge({
        name: spaceName,
        vector_type: 'Chroma',
        owner,
        desc: description,
      }),
    );
    setSpinning(false);
    res?.success && handleAddSpace(spaceName);
  };
  return (
    <Spin spinning={spinning}>
      <Form
        size="large"
        className="mt-4"
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleFinish}
      >
        <Form.Item<FieldType>
          label={t('Knowledge_Space_Name')}
          name="spaceName"
          rules={[
            { required: true, message: t('Please_input_the_name') },
            () => ({
              validator(_, value) {
                if (/[^\u4e00-\u9fa50-9a-zA-Z_-]/.test(value)) {
                  return Promise.reject(new Error(t('the_name_can_only_contain')));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input className="mb-5 h-12" placeholder={t('Please_input_the_name')} />
        </Form.Item>
        <Form.Item<FieldType> label={t('Owner')} name="owner" rules={[{ required: true, message: t('Please_input_the_owner') }]}>
          <Input className="mb-5  h-12" placeholder={t('Please_input_the_owner')} />
        </Form.Item>
        <Form.Item<FieldType> label={t('Description')} name="description" rules={[{ required: true, message: t('Please_input_the_description') }]}>
          <Input className="mb-5  h-12" placeholder={t('Please_input_the_description')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('Next')}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
