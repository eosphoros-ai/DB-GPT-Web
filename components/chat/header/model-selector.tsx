/**
 * multi-models selector
 */

import { ChatContext } from '@/app/chat-context';
import { ModelType } from '@/types/chart';
import { Select } from 'antd';
import { ICON_MAP } from '@/utils/constants';
import classNames from 'classnames';
import Image from 'next/image';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onChange?: (model: string) => void;
}

const DEFAULT_ICON_URL = '/models/huggingface.svg';

export function renderModelIcon(model?: string | undefined, props?: { width: number; height: number }) {
  const { width, height } = props || {};

  if (!model) return null;

  return (
    <Image
      className="rounded-full border border-gray-200 object-contain bg-white inline-block"
      width={width || 24}
      height={height || 24}
      src={ICON_MAP[model]?.icon || DEFAULT_ICON_URL}
      alt="llm"
    />
  );
}

function ModelSelector({ onChange }: Props) {
  const { t } = useTranslation();
  const { modelList, model } = useContext(ChatContext);
  if (!modelList || modelList.length <= 0) {
    return null;
  }

  return (
    <Select
      value={model}
      placeholder={t('choose_model')}
      onChange={(val) => {
        onChange?.(val);
      }}
    >
      {modelList.map((item) => (
        <Select.Option key={item}>
          <div className="flex items-center justify-center">
            {renderModelIcon(model)}
            <span className="ml-2">{ICON_MAP[model]?.label || model}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

export default ModelSelector;
