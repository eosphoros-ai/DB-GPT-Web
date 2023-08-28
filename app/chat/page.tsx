'use client';
import React, { useEffect } from 'react';
import { useDialogueContext } from '@/app/context/dialogue';
import DbEditor from '@/components/dbEditor';
import ChatMode from '@/components/chatMode';
import { useSearchParams } from 'next/navigation';
import ModeTab from '@/components/ModeTab';

const AgentPage = () => {
	const { isContract, setIsContract, setIsMenuExpand } = useDialogueContext();
	const searchParams = useSearchParams();
	const scene = searchParams.get('scene');
  const id = searchParams.get('id')
	const showChangeMode = scene && ['chat_with_db_execute', 'chat_dashboard'].includes(scene as string);
  useEffect(() => {
    // 仅初始化执行，防止dashboard页面无法切换状态
    setIsMenuExpand(scene !== 'chat_dashboard')
    // 路由变了要取消Editor模式，再进来是默认的Preview模式
    if (scene !== 'chat_dashboard') {
      setIsContract(false)
    }
  }, [id, scene, setIsMenuExpand, setIsContract])
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
