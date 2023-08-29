import { GET, POST } from '.';
import { GetChatDbListResponse, GetChatDbSupportTypeResponse, PostChatDbParams } from './types/schema.type';

/** Database Page */
export const getChatDbList = () => GET<null, GetChatDbListResponse>('/chat/db/list');
export const getChatDbSupportType = () => GET<null, GetChatDbSupportTypeResponse>('/chat/db/support/type');
export const postChatDbDelete = (dbName: string) => POST(`/chat/db/delete?db_name=${dbName}`, undefined);
export const postChatDbEdit = (data: PostChatDbParams) => POST<PostChatDbParams, null>('/chat/db/edit', data);
export const postChatDbAdd = (data: PostChatDbParams) => POST<PostChatDbParams, null>('/chat/db/add', data);
