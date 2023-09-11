/**
 * multi-models selector
 */

import { ChatContext } from '@/app/chat-context';
import { Select, Option } from '@/lib/mui';
import { ModelType } from '@/types/chart';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  selectedModel: string;
  onChange: (model: string) => void;
}

const ICON_MAP: Record<ModelType, { label: string; icon: string }> = {
  proxyllm: { label: 'Proxy LLM', icon: '/models/chatgpt.png' },
  chatglm: { label: 'chatglm-6b', icon: '/models/chatglm.png' },
};

function ModelSelector({ selectedModel, onChange }: Props) {
  const { t } = useTranslation();
  const { modelList } = useContext(ChatContext);
  if (!modelList || modelList.length <= 0) {
    return null;
  }
  return (
    <div className="w-44">
      <Select
        placeholder={t('choose_model')}
        value={selectedModel}
        onChange={(_, newValue) => {
          newValue && onChange?.(newValue);
        }}
      >
        {modelList.map((model: string) => (
          <Option key={`model_${model}`} value={model}>
            <img className="w-6 h-6 rounded-full mr-4 border border-gray-200 object-contain bg-white" src={ICON_MAP[model]?.icon} alt="llm" />{' '}
            {ICON_MAP[model]?.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default ModelSelector;
