'use client';
import { useRequest } from 'ahooks';
import { useContext, useState } from 'react';
import { Divider, Button, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NextPage } from 'next';
import { apiInterceptors, newDialogue, postScenes } from '@/client/api';
import ModelSelector from '@/components/chat/header/model-selector';
import { ChatContext } from '@/app/chat-context';
import { SendOutlined } from '@ant-design/icons';
import { SceneResponse } from '@/types/chart';

const { TextArea } = Input;

const Home: NextPage = () => {
  const router = useRouter();
  const { model, setModel } = useContext(ChatContext);

  const [chatSceneLoading, setChatSceneLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState('');

  const { data: scenesList = [] } = useRequest(async () => {
    setChatSceneLoading(true);
    const [, res] = await apiInterceptors(postScenes());
    setChatSceneLoading(false);
    return res ?? [];
  });

  const submit = async () => {
    if (!userInput) return;
    setIsLoading(true);
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    setUserInput('');
    if (res) {
      router.push(`/chat/chat_normal/${res.conv_uid}${model ? `?model=${model}` : ''}&initMessage=${userInput}`);
    }
    setIsLoading(false);
  };

  const handleNewChat = async (scene: SceneResponse) => {
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    if (res) {
      router.push(`/chat/${scene.chat_scene}/${res.conv_uid}${model ? `?model=${model}` : ''}`);
    }
  };

  return (
    <div className="mx-auto h-full justify-center flex max-w-3xl flex-col px-4">
      <div className="my-0 mx-auto">
        <Image
          src="/LOGO.png"
          alt="Revolutionizing Database Interactions with Private LLM Technology"
          width={856}
          height={160}
          className="w-full"
          unoptimized
        />
      </div>
      <Divider className="!text-[#878c93] !my-6" plain>
        Quick Start
      </Divider>
      <Spin spinning={chatSceneLoading}>
        <div className="flex flex-wrap -m-1 md:-m-3">
          {scenesList.map((item) => (
            <div className="w-full sm:w-1/2 lg:w-1/3 p-1 md:p-3" key={item.chat_scene}>
              <div
                className="cursor-pointer flex items-center justify-center w-full h-12 rounded font-semibold text-sm bg-[#E6F4FF] text-[#1677FE] dark:text-gray-100 dark:bg-[#4E4F56]"
                onClick={() => {
                  handleNewChat(item);
                }}
              >
                {item.scene_name}
              </div>
            </div>
          ))}
        </div>
      </Spin>
      <div className="mt-8 mb-2">
        <ModelSelector
          onChange={(newModel: string) => {
            setModel(newModel);
          }}
        />
      </div>
      <div className="flex">
        <TextArea
          className="flex-1"
          size="large"
          value={userInput}
          placeholder="Ask anything..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (e.keyCode === 13) {
              submit();
            }
          }}
          onChange={(e) => {
            setUserInput(e.target.value.trim());
          }}
        />
        <Button
          className="ml-2 flex items-center justify-center"
          size="large"
          type="text"
          loading={isLoading}
          icon={<SendOutlined />}
          onClick={submit}
        />
      </div>
    </div>
  );
};

export default Home;
