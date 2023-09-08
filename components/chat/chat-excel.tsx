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
    <div className="w-full py-4 flex items-center border-b border-gray-100">
      <div className="w-full lg:w-4/5 xl:w-3/4 mx-auto">
        {currentDialogue ? (
          <div className="flex overflow-hidden rounded">
            <div className="flex items-center justify-center px-3 py-2 bg-gray-600">
              <LinkOutlined className="text-white" />
            </div>
            <div className="bg-gray-100 px-3 py-2 text-xs rounded-tr rounded-br dark:text-gray-800">{currentDialogue.select_param}</div>
          </div>
        ) : (
          <ExcelUpload convUid={chatId} chatMode={scene} onComplete={onComplete} />
        )}
      </div>
    </div>
  );
}

export default ChatExcel;
