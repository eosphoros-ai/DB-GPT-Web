"use client"
import React from 'react';
import { useDialogueContext } from '@/app/context/dialogue';
import WrapTextOutlinedIcon from '@mui/icons-material/WrapTextOutlined';
import DbEditor from '@/components/dbEditor';
import ChatMode from '@/components/chatMode';

const AgentPage = () => {
	const { isContract, setIsContract } = useDialogueContext();

	return (
		<>
			{!isContract && (
				<div className='leading-[3rem] text-right pr-3 mb-3 border-b flex justify-end'>
					<div className='flex items-center cursor-pointer' onClick={() => { setIsContract(!isContract) }}>
						<WrapTextOutlinedIcon style={{ marginRight: '4px' }} />Change Mode
					</div>
				</div>
			)}
			{isContract ? (
				<DbEditor />
			) : (
				<ChatMode />
			)}
		</>
	)
}

export default AgentPage;