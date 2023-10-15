import React, { useState } from 'react';
import { Modal, Tabs, Button, message, Space, Input, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { AlertFilled, ExclamationCircleOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { apiInterceptors, getArguments, saveArguments } from '@/client/api';

const { TextArea } = Input;

interface IProps {
  knowledge: any;
  isParameterModalShow: boolean;
  setIsParameterModalShow: (isParameterModalShow: boolean) => void;
}

export default function SpaceModal({ knowledge, isParameterModalShow, setIsParameterModalShow }: IProps) {
  const { t } = useTranslation();
  const [newSpaceArguments, setNewSpaceArguments] = useState<any>({});

  const spaceArguments = useRequest(() => apiInterceptors(getArguments(knowledge.name)), {
    onSuccess(result: any) {
      setNewSpaceArguments(result.data);
    },
  })?.data?.[2];

  const renderEmbedding = () => {
    return (
      <Space direction="vertical" size={'large'}>
        <Space direction={'horizontal'} size="large">
          <div className="w-96">
            <span>
              {t('topk')}
              <Tooltip title={t(`the_top_k_vectors`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              defaultValue={spaceArguments?.data?.embedding?.topk || ''}
              onChange={(e) => {
                newSpaceArguments.embedding.topk = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              className="mt-2 h-12"
            ></Input>
          </div>
          <div className="w-96">
            <span>
              {t('recall_score')}
              <Tooltip title={t(`Set_a_threshold_score`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              onChange={(e: any) => {
                newSpaceArguments.embedding.recall_score = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              defaultValue={'' + spaceArguments?.data?.embedding?.recall_score || ''}
              className="mt-2 h-12"
            ></Input>
          </div>
        </Space>
        <Space direction={'horizontal'} size="large">
          <div className="w-96">
            <span>
              {t('recall_type')}
              <Tooltip title={t(`Recall_Type`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              onChange={(e: any) => {
                newSpaceArguments.embedding.recall_type = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              className="mt-2 h-12"
              defaultValue={spaceArguments?.data?.embedding?.recall_type || ''}
            ></Input>
          </div>
          <div className="w-96">
            <span>
              {t('model')}
              <Tooltip title={t(`A_model_used`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              onChange={(e: any) => {
                newSpaceArguments.embedding.model = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              defaultValue={spaceArguments?.data?.embedding?.model || ''}
              className="mt-2 h-12"
            ></Input>
          </div>
        </Space>
        <Space direction={'horizontal'} size="large">
          <div className="w-96">
            <span>
              {t('chunk_size')}
              <Tooltip title={t(`The_size_of_the_data_chunks`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              onChange={(e: any) => {
                newSpaceArguments.embedding.chunk_size = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              defaultValue={spaceArguments?.data?.embedding?.chunk_size || ''}
              className="mt-2 h-12"
            ></Input>
          </div>
          <div className="w-96">
            <span>
              {t('chunk_overlap')}
              <Tooltip title={t(`The_amount_of_overlap`)}>
                <ExclamationCircleOutlined className="mx-2" />
              </Tooltip>
            </span>
            <Input
              onChange={(e: any) => {
                newSpaceArguments.embedding.chunk_overlap = e.target.value;
                setNewSpaceArguments({ ...newSpaceArguments });
              }}
              defaultValue={spaceArguments?.data?.embedding?.chunk_overlap || ''}
              className="mt-2 h-12"
            ></Input>
          </div>
        </Space>
      </Space>
    );
  };

  const renderPrompt = () => {
    return (
      <Space direction="vertical" className="w-11/12" size={'large'}>
        <div>
          <div className="mb-2">
            {t('scene')}
            <Tooltip title={t(`A_contextual_parameter`)}>
              <ExclamationCircleOutlined className="mx-2" />
            </Tooltip>
          </div>
          <TextArea
            onChange={(e: any) => {
              newSpaceArguments.prompt.scene = e.target.value;
              setNewSpaceArguments({ ...newSpaceArguments });
            }}
            defaultValue={spaceArguments?.data?.prompt?.scene || ''}
            rows={4}
          />
        </div>
        <div>
          <div className="mb-2">
            {t('template')}
            <Tooltip title={t(`structure_or_format`)}>
              <ExclamationCircleOutlined className="mx-2" />
            </Tooltip>
          </div>
          <TextArea
            onChange={(e: any) => {
              newSpaceArguments.prompt.template = e.target.value;
              setNewSpaceArguments({ ...newSpaceArguments });
            }}
            defaultValue={spaceArguments?.data?.prompt?.template || ''}
            rows={7}
          />
        </div>
        <div>
          <div className="mb-2">
            {t('max_token')}
            <Tooltip title={t(`The_maximum_number_of_tokens`)}>
              <ExclamationCircleOutlined className="mx-2" />
            </Tooltip>
          </div>
          <Input
            onChange={(e: any) => {
              newSpaceArguments.prompt.max_token = e.target.value;
              setNewSpaceArguments({ ...newSpaceArguments });
            }}
            className="mt-2 h-12"
            defaultValue={spaceArguments?.data?.prompt?.max_token || ''}
          ></Input>
        </div>
      </Space>
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
      children: renderEmbedding(),
    },
    {
      key: 'Prompt',
      label: (
        <div>
          <AlertFilled />
          {t('Embedding')}
        </div>
      ),
      children: renderPrompt(),
    },
  ];

  const handleSubmit = async () => {
    const [_, data, res] = await apiInterceptors(
      saveArguments(knowledge.name, {
        argument: JSON.stringify(newSpaceArguments),
      }),
    );
    if (res?.success) {
      message.success('success');
      setIsParameterModalShow(false);
    } else {
      message.error(res?.err_msg || 'failed');
    }
  };
  return (
    <Modal
      width={850}
      open={isParameterModalShow}
      onCancel={() => {
        setIsParameterModalShow(false);
      }}
      footer={null}
    >
      <Tabs items={items}></Tabs>
      <div className="mt-3 mb-3">
        <Button className="mr-6" onClick={handleSubmit}>
          {t('Submit')}
        </Button>
        <Button
          onClick={() => {
            setIsParameterModalShow(false);
          }}
        >
          {t('close')}
        </Button>
      </div>
    </Modal>
  );
}
