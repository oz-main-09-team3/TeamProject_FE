import { create } from 'zustand';
import { 
  getFriendsList,
  generateQRCode,
  inviteFriend,
  acceptFriend,
  rejectFriend
} from '../service/friendApi';

const useFriendStore = create((set, get) => ({
  // 상태
  friends: [],
  filteredFriends: [],
  searchTerm: '',
  qrCodeUrl: '',
  isLoading: false,
  error: null,
  
  // 액션
  fetchFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getFriendsList();
      const friendsData = response.data || response;
      
      set({ 
        friends: friendsData, 
        filteredFriends: friendsData,
        isLoading: false 
      });
      return friendsData;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return [];
    }
  },
  
  generateQRCode: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await generateQRCode(username);
      
      // ArrayBuffer를 Blob으로 변환
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      set({ qrCodeUrl: url, isLoading: false });
      return url;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  inviteFriend: async (inviteData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inviteFriend(inviteData);
      // 친구 목록 새로고침
      await get().fetchFriends();
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  acceptFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
      await acceptFriend(friendId);
      // 친구 목록 새로고침
      await get().fetchFriends();
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  rejectFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
      await rejectFriend(friendId);
      // 친구 목록 새로고침
      await get().fetchFriends();
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
  
  setSearchTerm: (term) => {
    const searchTerm = term.toLowerCase();
    set({ searchTerm });
    
    // 검색어가 있으면 친구 목록 필터링
    if (searchTerm) {
      set(state => ({
        filteredFriends: state.friends.filter(friend => {
          const nickname = friend.nickname?.toLowerCase() || '';
          const username = friend.username?.toLowerCase() || '';
          return nickname.includes(searchTerm) || username.includes(searchTerm);
        })
      }));
    } else {
      // 검색어가 없으면 전체 목록 표시
      set(state => ({ filteredFriends: state.friends }));
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useFriendStore;