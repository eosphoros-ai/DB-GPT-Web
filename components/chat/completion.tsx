import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { CircularProgress, IconButton, Input, Typography, Select, Option, Modal, ModalDialog, Button, Box, RadioGroup, Radio } from '@/lib/mui';
import { message, Tooltip as AntdTooltip } from 'antd';
import { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import lodash from 'lodash';
import MonacoEditor from './monaco-editor';
import ChatContent from './chat-content';
import ChatFeedback from './chat-feedback';
import { ChatContext } from '@/app/chat-context';
import { IChatDialogueMessageSchema } from '@/types/chart';
import { renderModelIcon } from '@/components/chat/header/model-selector';
import PromptBot from '@/components/common/prompt-bot';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';

type Props = {
  messages: IChatDialogueMessageSchema[];
  onSubmit: (message: string, otherQueryBody?: any) => Promise<any>;
  paramsObj?: Record<string, string>;
  paramsInfoObj?: Record<string, string>;
  clearInitMessage?: () => void;
};

type FormData = {
  query: string;
};

const Completion = ({ messages, onSubmit, paramsObj = {}, paramsInfoObj = {}, clearInitMessage }: Props) => {
  const { t } = useTranslation();
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

  const { watch, setValue, formState: { errors } } = methods
  const submitSelectedPrompt = (prompt: string) => {
    const curQuery = watch('query');
    setValue('query', curQuery + prompt);
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

  const [messageApi, contextHolder] = message.useMessage();
  const onCopyContext = async (context: any) => {
    const pureStr = context?.replace(/\trelations:.*/g, '');
    const result = copy(pureStr);
    if(result) {
      if(pureStr) {
        messageApi.open({ type: 'success', content: t('Copy_success'), });
      }
      else {
        messageApi.open({ type: 'warning', content: t('Copy_nothing'), });
      }
    }
    else {
      messageApi.open({ type: 'error', content: t('Copry_error'), });
    }
  }

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
      {contextHolder}
      <div ref={scrollableRef} className="flex flex-1 overflow-y-auto pb-8 w-full flex-col">
        <div className="flex items-center flex-1 flex-col text-sm leading-6 text-slate-900 dark:text-slate-300 sm:text-base sm:leading-7">
          {showMessages?.map((content, index) => {
            return (
              <Box sx={{ width: '100%' }} key={index}>
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
                {content.role === 'view' ? (
                  <div className={'overflow-x-auto w-full lg:w-4/5 xl:w-3/4 mx-auto flex justify-end rounded-xl'}>
                    <AntdTooltip title={t('Copy')}>
                      <Button
                        onClick={() => onCopyContext(content?.context)}
                        slots={{ root: IconButton }}
                        slotProps={{ root: { variant: 'plain', color: 'primary' } }}
                        sx={{ borderRadius: 40 }}
                      >
                        <ContentCopyIcon />
                      </Button>
                    </AntdTooltip>
                    <ChatFeedback
                      conv_index={Math.ceil((index + 1) / 2)}
                      question={showMessages?.filter((e) => e?.role === 'human' && e?.order === content.order)[0]?.context}
                      knowledge_space={currentParam}
                    />
                  </div>
                ) : (
                  void 0
                )}
              </Box>
            );
          })}
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
        <form
          className="flex flex-wrap w-full py-2 sm:pt-6 sm:pb-10"
          onSubmit={(e) => {
            e.stopPropagation();
            methods.handleSubmit(submit)(e);
          }}
        >
          {!!paramsOpts?.length && (
            <div
              className={classNames('flex flex-grow items-center h-12 mb-2', {
                'max-w-[6rem] sm:max-w-[12rem] mr-2': scene !== 'chat_dashboard',
              })}
            >
              <Select
                className="h-full w-full"
                value={currentParam}
                onChange={(_, newValue) => {
                  setCurrentParam(newValue ?? '');
                }}
              >
                {paramsOpts.map((item) => (
                  <AntdTooltip title={paramsInfoObj?.[item.key]} key={'tp-' + item.key} variant="solid" placement="right">
                    <Option key={item.key} value={item.value}>
                      {item.key}
                    </Option>
                  </AntdTooltip>
                ))}
              </Select>
            </div>
          )}
          <Input
            disabled={scene === 'chat_excel' && !currentDialogue?.select_param}
            className="flex-1 h-12 min-w-min"
            style={{ minWidth: 'min-content' }}
            variant="outlined"
            startDecorator={renderModelIcon(model || '')}
            endDecorator={<IconButton type="submit">{isLoading ? <CircularProgress /> : <SendRoundedIcon />}</IconButton>}
            {...methods.register('query')}
          />
        </form>
      </div>
      <PromptBot submit={submitSelectedPrompt} />
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
