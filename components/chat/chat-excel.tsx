import ExcelUpload from './excel-upload';
import { LinkOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { ChatContext } from '@/app/chat-context';

interface Props {
  onComplete?: () => void;
}

function ChatExcel({ onComplete }: Props) {
  const { currentDialogue, scene, chatId } = useContext(ChatContext);

  if (scene !== 'chat_excel') return null;

  return (
    <div className="max-w-xs h-full">
      {currentDialogue ? (
        <div className="h-full flex overflow-hidden rounded">
          <div className="h-full flex items-center justify-center px-3 py-2 bg-gray-600">
            <LinkOutlined className="text-white" />
          </div>
          <div className="h-full bg-gray-100 px-3 py-2 text-xs rounded-tr rounded-br dark:text-gray-800">{currentDialogue.select_param}</div>
        </div>
      ) : (
        <ExcelUpload convUid={chatId} chatMode={scene} onComplete={onComplete} />
      )}
    </div>
  );
}

export default ChatExcel;
