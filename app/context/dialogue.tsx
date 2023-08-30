import { useRequest } from 'ahooks';
import { sendGetRequest } from '@/utils/request';
import { createCtx } from '@/utils/ctx-helper';
import { AxiosResponse } from 'axios';
import React from 'react';
import { useSearchParams } from 'next/navigation';

export const [useDialogueContext, DialogueProvider] = createCtx<{
	isContract?: boolean;
  isMenuExpand?: boolean;
	dialogueList?: void | AxiosResponse<any, any> | undefined;
	setIsContract: (val: boolean) => void;
  setIsMenuExpand: (val: boolean) => void;
	queryDialogueList: () => void;
	refreshDialogList: () => void;
}>();

const DialogueContext = ({ children }: {
	children: React.ReactElement
}) => {
	const searchParams = useSearchParams();
	const scene = searchParams.get('scene');
	const [isContract, setIsContract] = React.useState(false);
  const [isMenuExpand, setIsMenuExpand] = React.useState<boolean>(scene !== 'chat_dashboard')
	const { 
		run: queryDialogueList,
		data: dialogueList,
		refresh: refreshDialogList,
	} = useRequest(async () => await sendGetRequest('/v1/chat/dialogue/list'), {
		manual: true,
	});

	return (
		<DialogueProvider
			value={{
				isContract,
        isMenuExpand,
				dialogueList,
				setIsContract,
        setIsMenuExpand,
				queryDialogueList,
				refreshDialogList
			}}
		>
			{children}
		</DialogueProvider>
	)
}

export default DialogueContext;