import { useContext } from 'react';
import ChatExcel from './chat-excel';
import { ChatContext } from '@/app/chat-context';
import ModeTab from '@/components/chat/mode-tab';
import ModelSelector from '@/components/chat/header/model-selector';

/**
 * chat header
 */
interface Props {
  refreshHistory?: () => void;
  modelChange?: (val: string) => void;
}

function Header({ refreshHistory, modelChange }: Props) {
  const { refreshDialogList, model } = useContext(ChatContext);
  return (
    <div className="w-full py-4 flex items-center justify-center border-b border-gray-100 gap-5">
      {/* models selector */}
      <ModelSelector size="sm" onChange={modelChange} />
      {/* excel */}
      <ChatExcel
        onComplete={() => {
          refreshDialogList?.();
          refreshHistory?.();
        }}
      />
      <ModeTab />
    </div>
  );
}

export default Header;
