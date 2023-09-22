/**
 * multi-models selector
 */

import { ChatContext } from '@/app/chat-context';
import { Select, Option, SelectOption } from '@/lib/mui';
import { ICON_MAP } from '@/utils/constants';
import classNames from 'classnames';
import Image from 'next/image';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  size: 'sm' | 'md' | 'lg';
  onChange?: (model: string) => void;
}

const DEFAULT_ICON_URL = '/models/huggingface.svg';

export function renderModelIcon(model?: string | undefined, props?: { width: number; height: number }) {
  if (!model) {
    return null;
  }
  const { width, height } = props || {};
  return (
    <Image
      className="rounded-full mr-2 border border-gray-200 object-contain bg-white inline-block"
      width={width || 24}
      height={height || 24}
      src={ICON_MAP[model]?.icon || DEFAULT_ICON_URL}
      alt="llm"
    />
  );
}

function ModelSelector({ size, onChange }: Props) {
  const { t } = useTranslation();
  const { modelList, model, scene } = useContext(ChatContext);
  if (!modelList || modelList.length <= 0) {
    return null;
  }

  function renderValue(option: SelectOption<string> | null) {
    if (!option) {
      return null;
    }
    return (
      <>
        {renderModelIcon(option.value)}
        {option.label}
      </>
    );
  }
  return (
    <div
      className={classNames({
        'w-48': size === 'sm' || size === 'md' || !size,
        'w-60': size === 'lg',
      })}
    >
      <Select
        size={size || 'sm'}
        placeholder={t('choose_model')}
        value={model || ''}
        renderValue={renderValue}
        onChange={(_, newValue) => {
          newValue && onChange?.(newValue);
        }}
      >
        {modelList.map((model: string) => (
          <Option key={`model_${model}`} value={model}>
            {renderModelIcon(model)}
            {ICON_MAP[model]?.label || model}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default ModelSelector;
