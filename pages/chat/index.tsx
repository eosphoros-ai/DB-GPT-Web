'use client';
import React, { useContext, useEffect } from 'react';
import { ChatContext } from '@/app/chat-context';
import dynamic from 'next/dynamic';

const DbEditor = dynamic(() => import('@/components/chat/db-editor'), { ssr: false });
const ChatContainer = dynamic(() => import('@/components/chat/chat-container'), { ssr: false });

const Chat = () => {
  const { isContract, setIsContract, setIsMenuExpand, scene, chatId } = useContext(ChatContext);
  useEffect(() => {
    // 仅初始化执行，防止dashboard页面无法切换状态
    setIsMenuExpand(scene !== 'chat_dashboard');
    // 路由变了要取消Editor模式，再进来是默认的Preview模式
    if (chatId && scene) {
      setIsContract(false);
    }
  }, [chatId, scene, setIsMenuExpand, setIsContract]);
  return <>{isContract ? <DbEditor /> : <ChatContainer />}</>;
};

export default Chat;
