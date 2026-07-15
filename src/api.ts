import axios from 'axios';
export type Photo = { id: string; url: string; createdAt: string };
export type Message = { id: string; content: string; createdAt: string };
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://192.168.0.37:8000' });
export const asset = (url: string) => url.startsWith('http') ? url : `${api.defaults.baseURL}${url}`;
export const photosApi = { upload: async (file: File) => { const body = new FormData(); body.append('file', file); return (await api.post<{data:Photo}>('/api/photos', body)).data.data; } };
export const removePhoto = (id: string) => api.delete(`/api/photos/${id}`);
export const messagesApi = { list: async () => (await api.get<{data:Message[]}>('/api/messages')).data.data, add: async (content: string) => (await api.post<{data:Message}>('/api/messages', {content})).data.data, remove: (id: string) => api.delete(`/api/messages/${id}`) };
