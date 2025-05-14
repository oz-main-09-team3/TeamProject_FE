import { logout } from '../service/authApi';

export async function logoutAll() {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  try {
    await logout();
  } catch (e) {
    // 로그아웃 API 실패 시 무시
  }
} 