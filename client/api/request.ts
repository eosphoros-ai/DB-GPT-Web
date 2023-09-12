import { AxiosRequestConfig } from 'axios';
import { GET, POST } from '.';
import { GetChatDbListResponse, GetChatDbSupportTypeResponse, PostChatDbParams } from '@/types/db';
import { GetChatDialogueListResponse, IChatDialogueSchema, NewDialogueParam, SceneResponse, getChatHistoryResponse } from '@/types/chart';

/** App */
export const postScenes = () => {
  return POST<null, Array<SceneResponse>>('/chat/dialogue/scenes');
};

export const newDialogue = (data: NewDialogueParam) => {
  return POST<NewDialogueParam, IChatDialogueSchema>('/chat/dialogue/new', data);
};

/** Database Page */
export const getChatDbList = () => {
  return GET<null, GetChatDbListResponse>('/chat/db/list');
};
export const getChatDbSupportType = () => {
  return GET<null, GetChatDbSupportTypeResponse>('/chat/db/support/type');
};
export const postChatDbDelete = (dbName: string) => {
  return POST(`/chat/db/delete?db_name=${dbName}`, undefined);
};
export const postChatDbEdit = (data: PostChatDbParams) => {
  return POST<PostChatDbParams, null>('/chat/db/edit', data);
};
export const postChatDbAdd = (data: PostChatDbParams) => {
  return POST<PostChatDbParams, null>('/chat/db/add', data);
};

/** Chat Page */
export const getChatDialogueList = () => {
  return GET<null, GetChatDialogueListResponse>('/chat/dialogue/list');
};
export const getModelList = () => {
  return GET<null, Array<string>>('/model/types');
};
export const postChatModeParamsList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/chat/mode/params/list?chat_mode=${chatMode}`);
};
export const getChatHistory = (convId: string) => {
  return GET<null, getChatHistoryResponse>(`/chat/dialogue/messages/history?con_uid=${convId}`);
};
export const postChatModeParamsFileLoad = ({
  convUid,
  chatMode,
  data,
  config,
  model,
}: {
  convUid: string;
  chatMode: string;
  data: FormData;
  model: string;
  config?: Omit<AxiosRequestConfig, 'headers'>;
}) => {
  return POST<FormData, getChatHistoryResponse>(`/chat/mode/params/file/load?conv_uid=${convUid}&chat_mode=${chatMode}&model_name=${model}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};
