'use client';
import React from 'react';
import { useDialogueContext } from '@/app/context/dialogue';
import DbEditor from '@/components/dbEditor';
import ChatMode from '@/components/chatMode';
import { useSearchParams } from 'next/navigation';
import ModeTab from '@/components/ModeTab';

const AgentPage = () => {
	const { isContract, setIsContract } = useDialogueContext();
	const searchParams = useSearchParams();
	const scene = searchParams.get('scene');
	const showChangeMode = scene && ['chat_with_db_execute', 'chat_dashboard'].includes(scene as string);
	return (
		<>
			{showChangeMode && <div className='leading-[3rem] text-right pr-3 h-12 flex justify-center'>
        <div className='flex items-center cursor-pointer' onClick={() => { setIsContract(!isContract) }}>
          <ModeTab />
        </div>
      </div>}
			{isContract ? (
				<DbEditor />
			) : (
				<ChatMode />
			)}
		</>
	)
}

export default AgentPage;
