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
import { STORAGE_INIT_MESSAGE_KET } from '@/utils';
import Icon from '@ant-design/icons/lib/components/Icon';
import { ColorfulDB, ColorfulPlugin, ColorfulDashboard, ColorfulData, ColorfulExcel, ColorfulDoc } from '@/components/icons';

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
      router.push(`/chat/?scene=chat_normal&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
    }
    setLoading(false);
  };

  const handleNewChat = async (scene: SceneResponse) => {
    const [, res] = await apiInterceptors(newDialogue({ chat_mode: 'chat_normal' }));
    if (res) {
      router.push(`/chat?scene=${scene.chat_scene}&id=${res.conv_uid}${model ? `&model=${model}` : ''}`);
    }
  };

  function renderSceneIcon(scene: string) {
    switch (scene) {
      case 'chat_knowledge':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulDoc} />;
      case 'chat_with_db_execute':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulData} />;
      case 'chat_excel':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulExcel} />;
      case 'chat_with_db_qa':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulDB} />;
      case 'chat_dashboard':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulDashboard} />;
      case 'chat_agent':
        return <Icon className="w-16 h-16 mr-2" component={ColorfulPlugin} />;
      default:
        return null;
    }
  }

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
        <div className="flex flex-wrap justify-center">
          {scenesList.map((scene) => (
            <div
              key={scene.chat_scene}
              className="flex flex-row justify-center items-center mr-4 mb-4 w-72 min-h-min cursor-pointer border border-gray-300 rounded-lg p-6"
              style={{ background: 'linear-gradient(154.77deg,#f9feff 7.42%,#fcfdff 62.25%)' }}
              onClick={() => {
                handleNewChat(scene);
              }}
            >
              {renderSceneIcon(scene.chat_scene)}
              <div className="flex flex-col">
                <h2 className="text-lg text-black font-sans font-semibold">{scene.scene_name}</h2>
                <p className="text-gray-600 ">{scene.scene_describe}</p>
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
