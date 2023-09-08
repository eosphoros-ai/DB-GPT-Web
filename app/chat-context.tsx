import { createContext, useEffect, useMemo, useState } from 'react';
import { apiInterceptors, getChatDialogueList } from '@/client/api';
import { useSearchParams } from 'next/navigation';
import { useRequest } from 'ahooks';
import { GetChatDialogueListResponse } from '@/types/chart';

interface IChatContext {
  isContract?: boolean;
  isMenuExpand?: boolean;
  scene: string;
  chatId: string;
  dialogueList?: GetChatDialogueListResponse;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  setChatId: (val: string) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: GetChatDialogueListResponse[0];
}

const ChatContext = createContext<IChatContext>({
  scene: '',
  chatId: '',
  dialogueList: [],
  setIsContract: () => {},
  setIsMenuExpand: () => {},
  setChatId: () => {},
  queryDialogueList: () => {},
  refreshDialogList: () => {},
});

const ChatContextProvider = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const [isContract, setIsContract] = useState(false);
  const urlScene = (searchParams && searchParams.get('scene')) || '';
  const [scene] = useState<string>(urlScene);
  const id = (searchParams && searchParams.get('id')) || '';
  const [chatId, setChatId] = useState<string>(id);
  const [isMenuExpand, setIsMenuExpand] = useState<boolean>(scene !== 'chat_dashboard');

  useEffect(() => {
    setChatId(id);
  }, [id]);

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
  const currentDialogue = useMemo(() => dialogueList.find((item: any) => item.conv_uid === chatId), [chatId, dialogueList]);
  const contextValue = {
    isContract,
    isMenuExpand,
    scene,
    chatId,
    dialogueList,
    setIsContract,
    setIsMenuExpand,
    setChatId,
    queryDialogueList,
    refreshDialogList,
    currentDialogue,
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatContextProvider };
