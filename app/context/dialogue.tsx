import { useRequest } from 'ahooks';
import { createCtx } from '@/utils/ctx-helper';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GetChatDialogueListResponse, apiInterceptors, getChatDialogueList } from '@/client/api';

export const [useDialogueContext, DialogueProvider] = createCtx<{
  isContract?: boolean;
  isMenuExpand?: boolean;
  scene: string;
  chatId: string;
  dialogueList: GetChatDialogueListResponse;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  setScene: (val: string) => void;
  setChatId: (val: string) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: GetChatDialogueListResponse[0];
}>();

const DialogueContext = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const [isContract, setIsContract] = useState(false);
  const [scene, setScene] = useState<string>(searchParams.get('scene') || '');
  const [chatId, setChatId] = useState<string>(searchParams.get('id') || '');
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
  const currentDialogue = useMemo(() => dialogueList.find((item) => item.conv_uid === chatId), [chatId, dialogueList]);

  return (
    <DialogueProvider
      value={{
        isContract,
        isMenuExpand,
        scene,
        chatId,
        dialogueList,
        setIsContract,
        setIsMenuExpand,
        setScene,
        setChatId,
        queryDialogueList,
        refreshDialogList,
        currentDialogue,
      }}
    >
      {children}
    </DialogueProvider>
  );
};

export default DialogueContext;
