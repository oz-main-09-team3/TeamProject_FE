import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    const path = location.pathname; // 예: /auth/callback/kakao

    if (!code) {
      console.error('code가 없습니다');
      return;
    }

    let provider = '';
    if (path.includes('kakao')) {
      provider = 'kakao';
    } else if (path.includes('naver')) {
      provider = 'naver';
    } else if (path.includes('google')) {
      provider = 'google';
    }

    if (!provider) {
      console.error('provider를 알 수 없습니다');
      return;
    }

    fetch(`http://내백엔드주소.com/auth/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('로그인 성공!', data);
        // 예: 토큰 저장
        localStorage.setItem('token', data.token);
        navigate('/main');
      })
      .catch((err) => {
        console.error('로그인 실패', err);
        // 실패하면 로그인페이지로 되돌릴 수도 있음
        navigate('/');
      });
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      로그인 처리 중입니다...
    </div>
  );
}
