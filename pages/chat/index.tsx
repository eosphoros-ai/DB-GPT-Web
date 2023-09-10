'use client';
import React, { useContext, useEffect } from 'react';
import ModeTab from '@/components/chat/mode-tab';
import { ChatContext } from '@/app/chat-context';
import dynamic from 'next/dynamic';

const DbEditor = dynamic(() => import('@/components/chat/db-editor'), { ssr: false });
const ChatContainer = dynamic(() => import('@/components/chat/chat-container'), { ssr: false });

const Chat = () => {
  const { isContract, setIsContract, setIsMenuExpand, scene, chatId } = useContext(ChatContext);
  const showChangeMode = scene && ['chat_with_db_execute', 'chat_dashboard'].includes(scene as string);
  useEffect(() => {
    // 仅初始化执行，防止dashboard页面无法切换状态
    setIsMenuExpand(scene !== 'chat_dashboard');
    // 路由变了要取消Editor模式，再进来是默认的Preview模式
    if (chatId && scene) {
      setIsContract(false);
    }
  }, [chatId, scene, setIsMenuExpand, setIsContract]);
  return (
    <>
      {showChangeMode && (
        <div className="leading-[3rem] text-right h-12 flex justify-center">
          <div className="flex items-center cursor-pointer">
            <ModeTab />
          </div>
        </div>
      )}
      {isContract ? <DbEditor /> : <ChatContainer />}
    </>
  );
};

export default Chat;
