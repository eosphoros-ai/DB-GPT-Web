import { useRequest } from 'ahooks';
import { useContext, useState } from 'react';
import { Divider, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NextPage } from 'next';
import { apiInterceptors, newDialogue, postScenes } from '@/client/api';
import ModelSelector from '@/components/chat/header/model-selector';
import { ChatContext } from '@/app/chat-context';
import { SceneResponse } from '@/types/chat';
import CompletionInput from '@/components/common/completion-input';
import { useTranslation } from 'react-i18next';
import { STORAGE_INIT_MESSAGE_KET } from '@/constant';

const Home: NextPage = () => {
  const router = useRouter();
  const { model, setModel } = useContext(ChatContext);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [chatSceneLoading, setChatSceneLoading] = useState<boolean>(false);

  const { data: scenesList = [] } = useRequest(async () => {
    setChatSceneLoading(true);
    const [, res] = await apiInterceptors(postScenes());
    setChatSceneLoading(false);
    return res ?? [];
  });

  const submit = async (message: string) => {
    setLoading(true);
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    if (res) {
      localStorage.setItem(STORAGE_INIT_MESSAGE_KET, JSON.stringify({ id: res.conv_uid, message }));
      router.push(`/chat/chat_normal/${res.conv_uid}${model ? `?model=${model}` : ''}`);
    }
    setLoading(false);
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
        {t('Quick_Start')}
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
        <CompletionInput loading={loading} onSubmit={submit} />
      </div>
    </div>
  );
};

export default Home;
