import { useRequest } from 'ahooks';
import { createCtx } from '@/utils/ctx-helper';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { GetChatDialogueListResponse, apiInterceptors, getChatDialogueList } from '@/client/api';

export const [useDialogueContext, DialogueProvider] = createCtx<{
  isContract?: boolean;
  isMenuExpand?: boolean;
  dialogueList: GetChatDialogueListResponse;
  setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
  queryDialogueList: () => void;
  refreshDialogList: () => void;
  currentDialogue?: GetChatDialogueListResponse[0];
}>();

const DialogueContext = ({ children }: { children: React.ReactElement }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const scene = searchParams.get('scene');
  const [isContract, setIsContract] = React.useState(false);
  const [isMenuExpand, setIsMenuExpand] = React.useState<boolean>(scene !== 'chat_dashboard');
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
  const currentDialogue = useMemo(() => dialogueList.find((item) => item.conv_uid === id), [id, dialogueList]);

  return (
    <DialogueProvider
      value={{
        isContract,
        isMenuExpand,
        dialogueList,
        setIsContract,
        setIsMenuExpand,
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
