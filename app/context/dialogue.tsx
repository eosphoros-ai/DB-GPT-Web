import { useRequest } from 'ahooks';
import { sendGetRequest } from '@/utils/request';
import { createCtx } from '@/utils/ctx-helper';
import { AxiosResponse } from 'axios';
import React from 'react';

export const [useDialogueContext, DialogueProvider] = createCtx<{
	isContract?: boolean;
	dialogueList?: void | AxiosResponse<any, any> | undefined;
	setIsContract: (contract: boolean) => void;
	queryDialogueList: () => void;
	refreshDialogList: () => void;
}>();

const DialogueContext = ({ children }: {
	children: React.ReactElement
}) => {
	const [isContract, setIsContract] = React.useState(false);

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
				dialogueList,
				setIsContract,
				queryDialogueList,
				refreshDialogList
			}}
		>
			{children}
		</DialogueProvider>
	)
}

export default DialogueContext;