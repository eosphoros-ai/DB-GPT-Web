import { zodResolver } from '@hookform/resolvers/zod';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { CircularProgress, IconButton, Input, Select, Option, Box, Modal, ModalDialog, ModalClose, Button } from '@/lib/mui';
import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import lodash from 'lodash';
import { message } from 'antd';
import ChatContent from './ChatPage/ChatContent';
import ChatExcelTab from './ChatPage/ChatExcelTab';
import { IChatDialogueMessageSchema, IChatDialogueSchema } from '@/client/api';
import { useDialogueContext } from '@/app/context/dialogue';

type Props = {
  messages: IChatDialogueMessageSchema[];
  onRefreshHistory?: () => void;
  onSubmit: (message: string, otherQueryBody?: any) => Promise<any>;
  paramsObj?: Record<string, string>;
  dbList?: Record<string, string | undefined | null | boolean>[];
  runDbList: () => void;
  clearIntialMessage?: () => void;
  setChartsData?: (chartsData: any) => void;
};

const Schema = z.object({ query: z.string().min(1) });

const ChatBoxComp = ({ messages, onSubmit, paramsObj = {}, onRefreshHistory, clearIntialMessage, setChartsData }: Props) => {
  const searchParams = useSearchParams();
  const initMessage = searchParams.get('initMessage');
  const spaceNameOriginal = searchParams.get('spaceNameOriginal');
  const scene = searchParams.get('scene');

  const { currentDialogue } = useDialogueContext();
  const isChartChat = scene === 'chat_dashboard';
  const [isLoading, setIsLoading] = useState(false);
  const [currentParam, setCurrentParam] = useState<string>('');
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [currentJsonIndex, setCurrentJsonIndex] = useState<number>();
  const [showMessages, setShowMessages] = useState(messages);
  const [jsonValue, setJsonValue] = useState('');

  const scrollableRef = useRef<HTMLDivElement>(null);

  const paramsOpts = useMemo(() => Object.entries(paramsObj).map(([k, v]) => ({ key: k, value: v })), [paramsObj]);

  const methods = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {},
  });

  const submit = async ({ query }: z.infer<typeof Schema>) => {
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
      clearIntialMessage?.();
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

  const MyAceEditor = useMemo(() => {
    // fix npm run compile 'window is not defined' error
    if (typeof window !== 'undefined' && typeof window?.fetch === 'function') {
      const AceEditor = require('react-ace');
      require('ace-builds/src-noconflict/mode-json');
      require('ace-builds/src-noconflict/ext-language_tools');
      return AceEditor.default;
    }
    return undefined;
  }, []);

  useLayoutEffect(() => {
    if (!scrollableRef.current) return;
    scrollableRef.current.scrollTo(0, scrollableRef.current.scrollHeight);
  }, [messages?.length]);

  useEffect(() => {
    if (initMessage && messages.length <= 0) {
      handleInitMessage();
    }
  }, [initMessage, messages.length]);

  useEffect(() => {
    if (paramsOpts?.length) {
      setCurrentParam(spaceNameOriginal || paramsOpts[0].value);
    }
  }, [paramsOpts?.length]);

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
  }, [isChartChat, messages.length]);

  return (
    <>
      <ChatExcelTab
        onComplete={() => {
          clearIntialMessage?.();
          onRefreshHistory?.();
        }}
      />
      <div ref={scrollableRef} className="flex flex-1 overflow-y-auto pb-8 w-full flex-col">
        <div className="flex items-center flex-1 flex-col text-sm leading-6 text-slate-900 dark:text-slate-300 sm:text-base sm:leading-7">
          {showMessages?.map((each, index) => {
            return (
              <ChatContent
                key={index}
                context={each.context}
                isChartChat={isChartChat}
                isRobbort={each.role === 'view'}
                onLinkClick={() => {
                  setJsonModalOpen(true);
                  setCurrentJsonIndex(index);
                  setJsonValue(JSON.stringify(each?.context, null, 2));
                }}
              />
            );
          })}
          {isLoading && <CircularProgress variant="soft" color="neutral" size="sm" sx={{ mx: 'auto', my: 2 }} />}
        </div>
      </div>
      <div className="relative after:absolute after:-top-8 after:h-8 after:w-full after:bg-gradient-to-t after:from-white after:to-transparent dark:after:from-[#212121]">
        <form
          className="flex w-full lg:w-4/5 xl:w-3/4 mx-auto py-2 sm:pt-6 sm:pb-10"
          onSubmit={(e) => {
            e.stopPropagation();
            methods.handleSubmit(submit)(e);
          }}
        >
          {!!paramsOpts?.length && (
            <div className="flex items-center max-w-[6rem] sm:max-w-[12rem] h-12 mr-2">
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
            endDecorator={
              <IconButton type="submit" disabled={isLoading}>
                <SendRoundedIcon />
              </IconButton>
            }
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
        <ModalDialog aria-labelledby="variant-modal-title" aria-describedby="variant-modal-description">
          <ModalClose />
          <Box sx={{ marginTop: '32px' }}>
            {!!MyAceEditor && (
              <MyAceEditor
                mode="json"
                value={jsonValue}
                height={'600px'}
                width={'820px'}
                onChange={setJsonValue}
                placeholder={'默认json数据'}
                debounceChangePeriod={100}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  highlightSelectedWord: true,
                  tabSize: 2,
                }}
              />
            )}
            <Button
              variant="outlined"
              className="w-full"
              sx={{
                marginTop: '12px',
              }}
              onClick={() => {
                if (currentJsonIndex) {
                  try {
                    const temp = lodash.cloneDeep(showMessages);
                    const jsonObj = JSON.parse(jsonValue);
                    temp[currentJsonIndex].context = jsonObj;
                    setShowMessages(temp);
                    setChartsData?.(jsonObj?.charts);
                    setJsonModalOpen(false);
                    setJsonValue('');
                  } catch (e) {
                    message.error('JSON 格式化出错');
                  }
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default ChatBoxComp;
