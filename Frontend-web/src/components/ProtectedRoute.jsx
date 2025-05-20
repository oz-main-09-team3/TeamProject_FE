import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // 인증된 경우 자식 라우트 렌더링
  return <Outlet />;
}

export default ProtectedRoute;