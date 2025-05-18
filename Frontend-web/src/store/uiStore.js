import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      isDarkMode: 
        localStorage.getItem("theme") === "dark" || 
        (localStorage.getItem("theme") === null && 
          window.matchMedia("(prefers-color-scheme: dark)").matches),
      isSidebarOpen: false,
      isFriendsOpen: false,
      isNotificationsOpen: false,
      isMobileMenuOpen: false,
      
      modals: {
        confirm: { isOpen: false, title: '', content: '', onConfirm: null, confirmText: '확인', cancelText: '취소' },
        success: { isOpen: false, title: '', content: '', confirmText: '확인' },
        warning: { isOpen: false, title: '', content: '', confirmText: '확인', cancelText: '취소' },
        error: { isOpen: false, title: '', content: '', confirmText: '확인', cancelText: '취소' },
        info: { isOpen: false, title: '', content: '', confirmText: '확인' },
      },
      
      toggleDarkMode: () => 
        set(state => ({ isDarkMode: !state.isDarkMode })),
      
      setDarkMode: (isDark) => 
        set({ isDarkMode: isDark }),
      
      toggleSidebar: () => 
        set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      toggleFriends: () => 
        set(state => ({ 
          isFriendsOpen: !state.isFriendsOpen,
          isNotificationsOpen: false 
        })),
      
      toggleNotifications: () => 
        set(state => ({ 
          isNotificationsOpen: !state.isNotificationsOpen,
          isFriendsOpen: false 
        })),
      
      toggleMobileMenu: () => 
        set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      closeSidebars: () => 
        set({ 
          isFriendsOpen: false, 
          isNotificationsOpen: false,
          isMobileMenuOpen: false
        }),
      
      openModal: (type, { title, content, onConfirm = null, onCancel = null, confirmText = '확인', cancelText = '취소' }) => 
        set(state => ({
          modals: {
            ...state.modals,
            [type]: { 
              isOpen: true, 
              title, 
              content, 
              onConfirm, 
              onCancel,
              confirmText,
              cancelText
            }
          }
        })),
      
      closeModal: (type) => 
        set(state => ({
          modals: {
            ...state.modals,
            [type]: { 
              ...state.modals[type], 
              isOpen: false 
            }
          }
        })),
    }),
    {
      name: 'ui-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ isDarkMode: state.isDarkMode })
    }
  )
);

export default useUiStore;