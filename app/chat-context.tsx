import { createContext, useEffect, useMemo, useState } from 'react';
import { apiInterceptors, getDialogueList, getUsableModels } from '@/client/api';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import { DialogueListResponse } from '@/types/chart';

interface IChatContext {
  isContract?: boolean;
  isMenuExpand?: boolean;
  scene: string;
  chatId: string;
  model: string;
  dbParam?: string;
  modelList: Array<string>;
  setModel: (val: string) => void;
  dialogueList?: DialogueListResponse;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  setDbParam: (val: string) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: DialogueListResponse[0];
}

const ChatContext = createContext<IChatContext>({
  scene: '',
  chatId: '',
  modelList: [],
  model: '',
  dbParam: undefined,
  setModel: () => {},
  dialogueList: [],
  setIsContract: () => {},
  setIsMenuExpand: () => {},
  setDbParam: () => void 0,
  queryDialogueList: () => {},
  refreshDialogList: () => {},
});

const ChatContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { query: { id = '', scene = '' } = {} } = useRouter();
  const [isContract, setIsContract] = useState(false);
  const [model, setModel] = useState<string>('');
  const [isMenuExpand, setIsMenuExpand] = useState<boolean>(scene !== 'chat_dashboard');
  const [dbParam, setDbParam] = useState<string>();

  const {
    run: queryDialogueList,
    data: dialogueList = [],
    refresh: refreshDialogList,
  } = useRequest(
    async () => {
      const [, res] = await apiInterceptors(getDialogueList());
      return res ?? [];
    },
    {
      manual: true,
    },
  );

  const { data: modelList = [] } = useRequest(async () => {
    const [, res] = await apiInterceptors(getUsableModels());
    return res ?? [];
  });
  useEffect(() => {
    setModel(modelList[0]);
  }, [modelList, modelList?.length]);

  const currentDialogue = useMemo(() => dialogueList.find((item: any) => item.conv_uid === id), [id, dialogueList]);
  const contextValue = {
    isContract,
    isMenuExpand,
    scene: scene as string,
    chatId: id as string,
    modelList,
    model,
    dbParam,
    setModel,
    dialogueList,
    setIsContract,
    setIsMenuExpand,
    setDbParam,
    queryDialogueList,
    refreshDialogList,
    currentDialogue,
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatContextProvider };
