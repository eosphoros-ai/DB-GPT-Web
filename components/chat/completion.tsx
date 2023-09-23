import { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import MonacoEditor from './monaco-editor';
import ChatContent from './chat-content';
import { ChatContext } from '@/app/chat-context';
import { IChatDialogueMessageSchema } from '@/types/chart';
import classNames from 'classnames';
import { Input, Button, Empty, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { renderModelIcon } from './header/model-selector';
import loadsh from 'lodash';

const { TextArea } = Input;

type Props = {
  messages: IChatDialogueMessageSchema[];
  onSubmit: (message: string, otherQueryBody?: Record<string, any>) => Promise<void>;
};

const Completion = ({ messages, onSubmit }: Props) => {
  const searchParams = useSearchParams();
  const initMessage = (searchParams && searchParams.get('initMessage')) ?? '';
  const spaceNameOriginal = (searchParams && searchParams.get('spaceNameOriginal')) ?? '';
  const { dbParam, currentDialogue, scene, model, refreshDialogList, chatId } = useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(messages);
  const [jsonValue, setJsonValue] = useState<string>('');
  const [userInput, setUserInput] = useState<string>(initMessage);

  const scrollableRef = useRef<HTMLDivElement>(null);

  const isChartChat = useMemo(() => scene === 'chat_dashboard', [scene]);

  const handleChat = async () => {
    if (isLoading || !userInput.trim()) return;
    try {
      setIsLoading(true);
      setUserInput('');
      await onSubmit(userInput.trim(), {
        select_param: scene === 'chat_excel' ? currentDialogue?.select_param : spaceNameOriginal || dbParam,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitMessage = async () => {
    try {
      const searchParamsTemp = new URLSearchParams(window.location.search);
      searchParamsTemp.delete('initMessage');
      window.history?.replaceState(null, '', `?${searchParamsTemp.toString()}`);
      await handleChat();
    } finally {
      refreshDialogList();
    }
  };

  const handleJson2Obj = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return jsonStr;
    }
  };

  useEffect(() => {
    if (initMessage) {
      handleInitMessage();
    }
  }, []);

  useEffect(() => {
    let tempMessage: IChatDialogueMessageSchema[] = messages;
    if (isChartChat) {
      tempMessage = loadsh.cloneDeep(messages).map((item) => {
        if (item?.role === 'view' && typeof item?.context === 'string') {
          item.context = handleJson2Obj(item?.context);
        }
        return item;
      });
    }
    setShowMessages(tempMessage.filter((item) => ['view', 'human'].includes(item.role)));
  }, [isChartChat, messages]);

  useEffect(() => {
    setTimeout(() => {
      scrollableRef.current?.scrollTo(0, scrollableRef.current.scrollHeight);
    }, 50);
  }, [messages]);

  return (
    <>
      <div ref={scrollableRef} className="flex flex-1 overflow-y-auto pb-8 w-full flex-col">
        <div className="flex items-center flex-1 flex-col text-sm leading-6 text-slate-900 dark:text-slate-300 sm:text-base sm:leading-7">
          {showMessages.length ? (
            showMessages.map((content, index) => {
              return (
                <ChatContent
                  key={index}
                  content={content}
                  isChartChat={isChartChat}
                  onLinkClick={() => {
                    setJsonModalOpen(true);
                    setJsonValue(JSON.stringify(content?.context, null, 2));
                  }}
                />
              );
            })
          ) : (
            <Empty
              image="/empty.png"
              imageStyle={{ width: 320, height: 320, margin: '0 auto', maxWidth: '100%', maxHeight: '100%' }}
              className="flex items-center justify-center flex-col h-full w-full"
              description="Start a conversation"
            />
          )}
        </div>
      </div>
      <div
        className={classNames(
          'relative after:absolute after:-top-8 after:h-8 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent dark:after:from-[#212121]',
          {
            'cursor-not-allowed': scene === 'chat_excel' && !currentDialogue?.select_param,
          },
        )}
      >
        <div className="flex flex-wrap w-full py-2 sm:pt-6 sm:pb-10">
          {model && <div className="mr-2 flex items-center h-10">{renderModelIcon(model)}</div>}
          <TextArea
            className="flex-1"
            size="large"
            value={userInput}
            disabled={scene === 'chat_excel' && !currentDialogue?.select_param}
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (e.keyCode === 13) {
                handleChat();
              }
            }}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <Button
            className="ml-2 flex items-center justify-center"
            size="large"
            type="text"
            loading={isLoading}
            icon={<SendOutlined />}
            onClick={handleChat}
          />
        </div>
      </div>
      <Modal
        title="JSON Editor"
        open={jsonModalOpen}
        width="60%"
        cancelButtonProps={{
          hidden: true,
        }}
        onOk={() => {
          setJsonModalOpen(false);
        }}
        onCancel={() => {
          setJsonModalOpen(false);
        }}
      >
        <MonacoEditor className="w-full h-[500px]" language="json" value={jsonValue} />
      </Modal>
    </>
  );
};

export default Completion;
