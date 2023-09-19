import { AxiosRequestConfig } from 'axios';
import { GET, POST } from '.';
import { DbListResponse, DbSupportTypeResponse, PostDbParams } from '@/types/db';
import { DialogueListResponse, IChatDialogueSchema, NewDialogueParam, SceneResponse, ChatHistoryResponse } from '@/types/chart';
import { IModelData, StartModelParams, BaseModelParams, SupportModel } from '@/types/model';

/** App */
export const postScenes = () => {
  return POST<null, Array<SceneResponse>>('/chat/dialogue/scenes');
};

export const newDialogue = (data: NewDialogueParam) => {
  return POST<NewDialogueParam, IChatDialogueSchema>('/chat/dialogue/new', data);
};

/** Database Page */
export const getDbList = () => {
  return GET<null, DbListResponse>('/chat/db/list');
};
export const getDbSupportType = () => {
  return GET<null, DbSupportTypeResponse>('/chat/db/support/type');
};
export const postDbDelete = (dbName: string) => {
  return POST(`/chat/db/delete?db_name=${dbName}`, undefined);
};
export const postDbEdit = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/chat/db/edit', data);
};
export const postDbAdd = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/chat/db/add', data);
};

/** Chat Page */
export const getDialogueList = () => {
  return GET<null, DialogueListResponse>('/chat/dialogue/list');
};
export const getUsableModels = () => {
  return GET<null, Array<string>>('/model/types');
};
export const postChatModeParamsList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/chat/mode/params/list?chat_mode=${chatMode}`);
};
export const getChatHistory = (convId: string) => {
  return GET<null, ChatHistoryResponse>(`/chat/dialogue/messages/history?con_uid=${convId}`);
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
  return POST<FormData, ChatHistoryResponse>(`/chat/mode/params/file/load?conv_uid=${convUid}&chat_mode=${chatMode}&model_name=${model}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

/** menu */
export const delDialogue = (conv_uid: string) => {
  return POST<null, null>(`/chat/dialogue/delete?con_uid=${conv_uid}`);
};

/** knowledge */

/** models */
export const getModelList = () => {
  return GET<null, Array<IModelData>>('/worker/model/list');
};

export const stopModel = (data: BaseModelParams) => {
  return POST<BaseModelParams, boolean>('/worker/model/stop', data);
};

export const startModel = (data: StartModelParams) => {
  return POST<StartModelParams, boolean>('/worker/model/start', data);
};

export const getSupportModels = () => {
  return GET<null, Array<SupportModel>>('/worker/models/supports');
};
