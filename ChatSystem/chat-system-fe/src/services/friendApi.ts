import apiClient from './axios';

export const friendApi = {
  getAllUsers: () => apiClient.get('/users/all'),
  getContacts: () => apiClient.get('/friends'),
  getPendingRequests: () => apiClient.get('/friend-requests/pending'),
  sendConnectRequest: (userId: string) => apiClient.post('/friend-requests', { userId }),
  acceptRequest: (requestId: string) => apiClient.put(`/friend-requests/${requestId}/accept`),
  declineRequest: (requestId: string) => apiClient.put(`/friend-requests/${requestId}/decline`),
  messageFriend: (userId: string) => apiClient.get(`/chats/${userId}`),
};