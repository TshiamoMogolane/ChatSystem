import apiClient from './axios';

export interface Friend {
  id: string;
  name: string;
  email: string;
  online: boolean;
  status: 'connected' | 'pending' | 'suggested';
}

export interface HomeSummary {
  pendingCount: number;
  pending: Friend[];
  suggestionsCount: number;
  suggestions: Friend[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ---------- Friends ----------
export const getConnectedFriends = (page = 0, size = 20) => {
  return apiClient.get<PageResponse<Friend>>('/friends/connected', { params: { page, size } });
};

export const getPendingRequests = (page = 0, size = 20) => {
  return apiClient.get<PageResponse<Friend>>('/friends/pending', { params: { page, size } });
};

export const getSuggestions = (page = 0, size = 20) => {
  return apiClient.get<PageResponse<Friend>>('/friends/suggestions', { params: { page, size } });
};

export const getHomeSummary = () => {
  return apiClient.get<HomeSummary>('/friends/home-summary');
};

// ---------- Actions ----------
export const sendConnectRequest = (addresseeId: string) => {
  return apiClient.post('/friends/request', null, { params: { addresseeId } });
};

export const acceptRequest = (connectionId: string) => {
  return apiClient.post(`/friends/accept/${connectionId}`);
};

export const declineRequest = (connectionId: string) => {
  return apiClient.post(`/friends/decline/${connectionId}`);
};

// ---------- Chat (placeholder) ----------
export const messageFriend = (userId: string) => {
  return apiClient.get(`/chats/${userId}`);
};