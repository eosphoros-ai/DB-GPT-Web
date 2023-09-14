import { createContext, useEffect, useMemo, useState } from 'react';
import { apiInterceptors, getChatDialogueList, getModelList } from '@/client/api';
import { useSearchParams } from 'next/navigation';
import { useRequest } from 'ahooks';
import { GetChatDialogueListResponse } from '@/types/chart';

interface IChatContext {
  isContract?: boolean;
  isMenuExpand?: boolean;
  scene: string;
  chatId: string;
  model: string;
  modelList: Array<string>;
  setModel: (val: string) => void;
  dialogueList?: GetChatDialogueListResponse;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: GetChatDialogueListResponse[0];
}

const ChatContext = createContext<IChatContext>({
  scene: '',
  chatId: '',
  modelList: [],
  model: '',
  setModel: () => {},
  dialogueList: [],
  setIsContract: () => {},
  setIsMenuExpand: () => {},
  queryDialogueList: () => {},
  refreshDialogList: () => {},
});

const ChatContextProvider = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const [isContract, setIsContract] = useState(false);
  const chatId = searchParams?.get('id') ?? '';
  const scene = searchParams?.get('scene') ?? '';
  const [model, setModel] = useState<string>('');
  const [isMenuExpand, setIsMenuExpand] = useState<boolean>(scene !== 'chat_dashboard');

  const {
    run: queryDialogueList,
    data: dialogueList = [],
    refresh: refreshDialogList,
  } = useRequest(
    async () => {
      const [, res] = await apiInterceptors(getChatDialogueList());
      return res ?? [];
    },
    {
      manual: true,
    },
  );

  const { data: modelList = [] } = useRequest(async () => {
    const [, res] = await apiInterceptors(getModelList());
    return res ?? [];
  });
  useEffect(() => {
    setModel(modelList[0]);
  }, [modelList, modelList?.length]);

  const currentDialogue = useMemo(() => dialogueList.find((item: any) => item.conv_uid === chatId), [chatId, dialogueList]);
  const contextValue = {
    isContract,
    isMenuExpand,
    scene,
    chatId,
    modelList,
    model,
    setModel,
    dialogueList,
    setIsContract,
    setIsMenuExpand,
    queryDialogueList,
    refreshDialogList,
    currentDialogue,
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatContextProvider };
