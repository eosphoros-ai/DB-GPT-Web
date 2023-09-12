import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { CircularProgress, IconButton, Input, Select, Option, Modal, ModalDialog, Button } from '@/lib/mui';
import { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import lodash from 'lodash';
import MonacoEditor from './monaco-editor';
import ChatContent from './chat-content';
import { ChatContext } from '@/app/chat-context';
import { IChatDialogueMessageSchema } from '@/types/chart';
import { renderModelIcon } from './model-selector';

type Props = {
  messages: IChatDialogueMessageSchema[];
  onSubmit: (message: string, otherQueryBody?: any) => Promise<any>;
  paramsObj?: Record<string, string>;
  dbList?: Record<string, string | undefined | null | boolean>[];
  runDbList: () => void;
  clearInitMessage?: () => void;
};

type FormData = {
  query: string;
};

const Completion = ({ messages, onSubmit, paramsObj = {}, clearInitMessage }: Props) => {
  const searchParams = useSearchParams();
  const initMessage = searchParams && searchParams.get('initMessage');
  const spaceNameOriginal = searchParams && searchParams.get('spaceNameOriginal');

  const { currentDialogue, scene, model } = useContext(ChatContext);
  const isChartChat = scene === 'chat_dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const [currentParam, setCurrentParam] = useState<string>('');
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [currentJsonIndex, setCurrentJsonIndex] = useState<number>();
  const [showMessages, setShowMessages] = useState(messages);
  const [jsonValue, setJsonValue] = useState('');

  const scrollableRef = useRef<HTMLDivElement>(null);

  const paramsOpts = useMemo(() => Object.entries(paramsObj).map(([k, v]) => ({ key: k, value: v })), [paramsObj]);

  const methods = useForm<FormData>();

  const submit = async ({ query }: FormData) => {
    try {
      setIsLoading(true);
      methods.reset();
      await onSubmit(query, {
        select_param: scene === 'chat_excel' ? currentDialogue?.select_param : paramsObj[currentParam],
      });
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitMessage = async () => {
    try {
      const searchParamsTemp = new URLSearchParams(window.location.search);
      const initMessage = searchParamsTemp.get('initMessage');
      searchParamsTemp.delete('initMessage');
      window.history?.replaceState(null, '', `?${searchParamsTemp.toString()}`);
      await submit({ query: initMessage as string });
    } catch (err) {
      console.log(err);
    } finally {
      clearInitMessage?.();
    }
  };

  const handleJson2Obj = (jsonStr: string) => {
    let res = jsonStr;
    try {
      res = JSON.parse(jsonStr);
    } catch (e) {
      console.log(e);
    }
    return res;
  };

  useEffect(() => {
    if (!scrollableRef.current) return;
    scrollableRef.current.scrollTo(0, scrollableRef.current.scrollHeight);
  }, [messages?.length]);

  useEffect(() => {
    if (initMessage && messages.length <= 0) {
      handleInitMessage();
    }
  }, [handleInitMessage, initMessage, messages.length]);

  useEffect(() => {
    if (paramsOpts?.length) {
      setCurrentParam(spaceNameOriginal || paramsOpts[0].value);
    }
  }, [paramsOpts, paramsOpts?.length, spaceNameOriginal]);

  useEffect(() => {
    if (isChartChat) {
      let temp = lodash.cloneDeep(messages);
      temp.forEach((item) => {
        if (item?.role === 'view' && typeof item?.context === 'string') {
          item.context = handleJson2Obj(item?.context);
        }
      });
      setShowMessages(temp.filter((item) => ['view', 'human'].includes(item.role)));
    } else {
      setShowMessages(messages.filter((item) => ['view', 'human'].includes(item.role)));
    }
  }, [isChartChat, messages]);

  return (
    <>
      <div ref={scrollableRef} className="flex flex-1 overflow-y-auto pb-8 w-full flex-col">
        <div className="flex items-center flex-1 flex-col text-sm leading-6 text-slate-900 dark:text-slate-300 sm:text-base sm:leading-7">
          {showMessages?.map((content, index) => {
            return (
              <ChatContent
                key={index}
                content={content}
                isChartChat={isChartChat}
                onLinkClick={() => {
                  setJsonModalOpen(true);
                  setCurrentJsonIndex(index);
                  setJsonValue(JSON.stringify(content?.context, null, 2));
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="relative after:absolute after:-top-8 after:h-8 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent dark:after:from-[#212121]">
        <form
          className="flex flex-wrap w-full lg:w-4/5 xl:w-3/4 mx-auto py-2 sm:pt-6 sm:pb-10"
          onSubmit={(e) => {
            e.stopPropagation();
            methods.handleSubmit(submit)(e);
          }}
        >
          {!!paramsOpts?.length && (
            <div className="flex items-center max-w-[6rem] sm:max-w-[12rem] h-12 mr-2 mb-2">
              <Select
                className="h-full w-full"
                value={currentParam}
                onChange={(_, newValue) => {
                  setCurrentParam(newValue ?? '');
                }}
              >
                {paramsOpts.map((item) => (
                  <Option key={item.key} value={item.value}>
                    {item.key}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          <Input
            disabled={scene === 'chat_excel' && !currentDialogue?.select_param}
            className="flex-1 h-12"
            variant="outlined"
            startDecorator={renderModelIcon(model || '')}
            endDecorator={<IconButton type="submit">{isLoading ? <CircularProgress /> : <SendRoundedIcon />}</IconButton>}
            {...methods.register('query')}
          />
        </form>
      </div>
      <Modal
        open={jsonModalOpen}
        onClose={() => {
          setJsonModalOpen(false);
        }}
      >
        <ModalDialog
          className="w-1/2 h-[600px] flex items-center justify-center"
          aria-labelledby="variant-modal-title"
          aria-describedby="variant-modal-description"
        >
          <MonacoEditor className="w-full h-[500px]" language="json" value={jsonValue} />
          <Button variant="outlined" className="w-full mt-2" onClick={() => setJsonModalOpen(false)}>
            OK
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default Completion;
