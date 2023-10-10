import { AxiosRequestConfig } from 'axios';
import { GET, POST } from '.';
import { DbListResponse, DbSupportTypeResponse, PostDbParams, ChatFeedBackSchema } from '@/types/db';
import { DialogueListResponse, IChatDialogueSchema, NewDialogueParam, SceneResponse, ChatHistoryResponse } from '@/types/chart';
import { IModelData, StartModelParams, BaseModelParams, SupportModel } from '@/types/model';
import {
  GetEditorSQLRoundRequest,
  GetEditorySqlParams,
  PostEditorChartRunParams,
  PostEditorChartRunResponse,
  PostEditorSQLRunParams,
  PostSQLEditorSubmitParams,
} from '@/types/editor';
import { PostAgentHubUpdateParams, PostAgentQueryParams, PostAgentPluginResponse, PostAgentMyPluginResponse } from '@/types/agent';

/** App */
export const postScenes = () => {
  return POST<null, Array<SceneResponse>>('/api/v1/chat/dialogue/scenes');
};
export const newDialogue = (data: NewDialogueParam) => {
  return POST<NewDialogueParam, IChatDialogueSchema>('/api/v1/chat/dialogue/new', data);
};

/** Database Page */
export const getDbList = () => {
  return GET<null, DbListResponse>('/api/v1/chat/db/list');
};
export const getDbSupportType = () => {
  return GET<null, DbSupportTypeResponse>('/api/v1/chat/db/support/type');
};
export const postDbDelete = (dbName: string) => {
  return POST(`/chat/db/delete?db_name=${dbName}`, undefined);
};
export const postDbEdit = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/edit', data);
};
export const postDbAdd = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/add', data);
};
export const postDbTestConnect = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/test/connect', data);
};

/** Chat Page */
export const getDialogueList = () => {
  return GET<null, DialogueListResponse>('/api/v1/chat/dialogue/list');
};
export const getUsableModels = () => {
  return GET<null, Array<string>>('/api/v1/model/types');
};
export const postChatModeParamsList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/mode/params/list?chat_mode=${chatMode}`);
};
export const postChatModeParamsInfoList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/mode/params/info?chat_mode=${chatMode}`);
};
export const getChatHistory = (convId: string) => {
  return GET<null, ChatHistoryResponse>(`/api/v1/chat/dialogue/messages/history?con_uid=${convId}`);
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
  return POST<FormData, ChatHistoryResponse>(
    `/api/v1/chat/mode/params/file/load?conv_uid=${convUid}&chat_mode=${chatMode}&model_name=${model}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    },
  );
};

/** Menu */
export const delDialogue = (conv_uid: string) => {
  return POST(`/api/v1/chat/dialogue/delete?con_uid=${conv_uid}`);
};

/** Editor */
export const getEditorSqlRounds = (id: string) => {
  return GET<null, GetEditorSQLRoundRequest>(`/api/v1/editor/sql/rounds?con_uid=${id}`);
};
export const postEditorSqlRun = (data: PostEditorSQLRunParams) => {
  return POST<PostEditorSQLRunParams>(`/api/v1/editor/sql/run`, data);
};
export const postEditorChartRun = (data: PostEditorChartRunParams) => {
  return POST<PostEditorChartRunParams, PostEditorChartRunResponse>(`/api/v1/editor/chart/run`, data);
};
export const postSqlEditorSubmit = (data: PostSQLEditorSubmitParams) => {
  return POST<PostSQLEditorSubmitParams>(`/api/v1/sql/editor/submit`, data);
};
export const getEditorSql = (id: string, round: string | number) => {
  return POST<GetEditorySqlParams, string | Array<any>>('/api/v1/editor/sql', { con_uid: id, round });
};

/** knowledge */

/** models */
export const getModelList = () => {
  return GET<null, Array<IModelData>>('/api/v1/worker/model/list');
};

export const stopModel = (data: BaseModelParams) => {
  return POST<BaseModelParams, boolean>('/api/v1/worker/model/stop', data);
};

export const startModel = (data: StartModelParams) => {
  return POST<StartModelParams, boolean>('/api/v1/worker/model/start', data);
};

export const getSupportModels = () => {
  return GET<null, Array<SupportModel>>('/api/v1/worker/model/params');
};

/** Agent */
export const postAgentQuery = (data: PostAgentQueryParams) => {
  return POST<PostAgentQueryParams, PostAgentPluginResponse>('/api/v1/agent/query', data);
};
export const postAgentHubUpdate = (data: PostAgentHubUpdateParams) => {
  return POST<PostAgentHubUpdateParams>('/api/v1/agent/hub/update', data);
};
export const postAgentMy = (user?: string) => {
  return POST<undefined, PostAgentMyPluginResponse>('/api/v1/agent/my', undefined, { params: { user } });
};
export const postAgentInstall = (pluginName: string, user?: string) => {
  return POST('/api/v1/agent/install', undefined, { params: { plugin_name: pluginName, user }, timeout: 60000 });
};
export const postAgentUninstall = (pluginName: string, user?: string) => {
  return POST('/api/v1/agent/uninstall', undefined, { params: { plugin_name: pluginName, user }, timeout: 60000 });
};
export const postAgentUpload = (user = '', data: FormData, config?: Omit<AxiosRequestConfig, 'headers'>) => {
  return POST<FormData>('/api/v1/agent/upload', data, {
    params: { user },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

/** chat feedback **/
export const getChatFeedBackSelect = () => {
  return GET<null, Record<string, string>>(`/api/v1/feedback/select`, undefined);
};
export const getChatFeedBackItme = (conv_uid: string, conv_index: number) => {
  return GET<null, Record<string, string>>(`/api/v1/feedback/find?conv_uid=${conv_uid}&conv_index=${conv_index}`, undefined);
};
export const postChatFeedBackForm = ({ data, config }: { data: ChatFeedBackSchema; config?: Omit<AxiosRequestConfig, 'headers'> }) => {
  return POST<ChatFeedBackSchema, any>(`/api/v1/feedback/commit`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
};
