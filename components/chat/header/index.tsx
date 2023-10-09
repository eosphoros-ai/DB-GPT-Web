import { useContext } from 'react';
import ChatExcel from './chat-excel';
import { ChatContext } from '@/app/chat-context';
import ModeTab from '@/components/chat/mode-tab';
import ModelSelector from '@/components/chat/header/model-selector';
import DBSelector from './db-selector';

/**
 * chat header
 */
interface Props {
  refreshHistory?: () => Promise<void>;
  modelChange?: (val: string) => void;
}

function Header({ refreshHistory, modelChange }: Props) {
  const { refreshDialogList } = useContext(ChatContext);

  return (
    <div className="w-full py-2 px-4 md:px-4 flex flex-wrap items-center justify-center border-b border-gray-100 gap-1 md:gap-4">
      {/* models selector */}
      <ModelSelector onChange={modelChange} />
      {/* DB Selector */}
      <DBSelector />
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
