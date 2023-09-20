import { apiInterceptors, getModelList } from '@/client/api';
import ModelCard from '@/components/model/model-card';
import ModelForm from '@/components/model/model-form';
import { IModelData } from '@/types/model';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Models() {
  const { t } = useTranslation();
  const [models, setModels] = useState<Array<IModelData>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getModels() {
    const [, res] = await apiInterceptors(getModelList());
    setModels(res ?? []);
  }

  useEffect(() => {
    getModels();
  }, []);

  return (
    <div className="p-8">
      <Button
        className="mb-8"
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {t('create_model')}
      </Button>
      {models.map((item) => (
        <ModelCard info={item} key={item.model_name} />
      ))}
      <Modal
        width={800}
        open={isModalOpen}
        title={t('create_model')}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <ModelForm
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default Models;
