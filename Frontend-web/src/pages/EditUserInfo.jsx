import { useReducer, useRef, useState, useEffect } from "react";
import { Camera, ChevronLeft } from "lucide-react";
import ColorThief from 'colorthief';
import { useNavigate, useLocation } from "react-router-dom";
import { updateMyInfo, getMyInfo } from "../service/userApi";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import useUiStore from "../store/uiStore";

// CloudFront URL 상수 정의
const CLOUDFRONT_URL = "https://dpjpkgz1vl8qy.cloudfront.net";
const S3_URL_PATTERN = /https:\/\/handsomepotato\.s3\.ap-northeast-2\.amazonaws\.com/;

function reducer(state, action) {
  return { ...state, [action.name]: action.value };
}

export default function EditUserInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useUiStore();
  
  const receivedUserInfo = location.state?.userInfo;
  console.log("[EditUserInfo.jsx] location.state?.userInfo:", receivedUserInfo);
  
  // 전화번호를 010-xxxx-xxxx 형식으로 포맷팅하는 함수
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const onlyNums = phone.replace(/[^0-9]/g, '');
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
    if (onlyNums.length < 11) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7);
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
  };

  // CloudFront URL을 사용하여 이미지 URL 변환하는 함수
  const getCloudFrontImageUrl = (imagePath) => {
    if (!imagePath) return "/profile.png";
    
    // 이미 로컬 상대 경로인 경우 그대로 사용
    if (imagePath.startsWith('/') && !imagePath.startsWith('//')) return imagePath;
    
    // S3 URL을 CloudFront URL로 대체
    if (imagePath.match(S3_URL_PATTERN)) {
      // S3 URL 패턴에서 /media/ 이후 경로만 추출
      const pathMatch = imagePath.match(/\/media\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return `${CLOUDFRONT_URL}/media/${pathMatch[1]}`;
      }
    }
    
    // 이미 CloudFront URL인 경우 그대로 사용
    if (imagePath.startsWith(CLOUDFRONT_URL)) return imagePath;
    
    // base64 데이터 URL인 경우 그대로 사용
    if (imagePath.startsWith('data:')) return imagePath;
    
    // HTTP(S)로 시작하는 URL (외부 이미지)
    if (imagePath.startsWith('http')) return imagePath;
    
    // 상대 경로인 경우 CloudFront URL에 추가
    return `${CLOUDFRONT_URL}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
  };

  const initialState = {
    nickname: receivedUserInfo?.nickname || receivedUserInfo?.username || "",
    phone_number: formatPhoneNumber(receivedUserInfo?.phone_number || receivedUserInfo?.phone || receivedUserInfo?.phone_num || ""),
    email: receivedUserInfo?.email || "",
    birth_date: receivedUserInfo?.birth_date || receivedUserInfo?.birthdate || receivedUserInfo?.birthday || "",
    profile_image: receivedUserInfo?.profile_image || receivedUserInfo?.profile || "/profile.png"
  };
  console.log("[EditUserInfo.jsx] initialState:", initialState);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [borderColor, setBorderColor] = useState('transparent');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(
    getCloudFrontImageUrl(receivedUserInfo?.profile_image || receivedUserInfo?.profile) || "/profile.png"
  );
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        const user = response.data || response;
        if (user?.profile) {
          // CloudFront URL로 변환
          const imageUrl = getCloudFrontImageUrl(user.profile);
          setProfileImageUrl(imageUrl);
          dispatch({ name: 'profile_image', value: user.profile });
        } else {
          setProfileImageUrl("/profile.png");
        }
      } catch (err) {
        setProfileImageUrl("/profile.png");
      }
    };
    fetchUserInfo();
  }, []);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    if (initialState.birth_date) {
      dispatch({ 
        name: 'birth_date', 
        value: formatDateForInput(initialState.birth_date) 
      });
    }
  }, []);

  const getProfileImageUrl = () => {
    if (profileImageFile && state.profile_image && state.profile_image.startsWith('data:')) {
      return state.profile_image;
    }
    if (profileImageUrl) {
      return profileImageUrl;
    }
    return "/profile.png";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'birth_date') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (value > todayStr) {
        dispatch({ name, value: todayStr });
        setBirthdateError('미래의 날짜는 선택할 수 없습니다.');
        return;
      }
    }

    if (name === 'phone_number') {
      let onlyNums = value.replace(/[^0-9]/g, '');
      let formatted = onlyNums;
      if (onlyNums.length < 4) {
      } else if (onlyNums.length < 8) {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
      } else if (onlyNums.length < 11) {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7);
      } else {
        formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
      }
      dispatch({ name, value: formatted });
      const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
      if (value && !phoneRegex.test(formatted)) {
        setPhoneError('올바른 전화번호 형식이 아닙니다.');
      } else {
        setPhoneError('');
      }
      return;
    }

    dispatch({ name, value });

    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    }

    if (name === 'birth_date') {
      const today = new Date();
      const birthDate = new Date(value);
      const minDate = new Date('1900-01-01');
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate());
      const actualAge = isBirthdayPassed ? age : age - 1;
      
      if (birthDate < minDate) {
        setBirthdateError('1900년 이후의 날짜만 입력 가능합니다.');
      } else if (actualAge < 14) {
        setBirthdateError('14세 이상만 가입 가능합니다.');
      } else if (birthDate > today) {
        setBirthdateError('미래의 날짜는 선택할 수 없습니다.');
      } else {
        setBirthdateError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (phoneError) {
      openModal('warning', {
        title: '입력 오류',
        content: '전화번호 형식이 올바르지 않습니다.',
        confirmText: '확인'
      });
      return;
    }
    if (emailError) {
      openModal('warning', {
        title: '입력 오류',
        content: '이메일 형식이 올바르지 않습니다.',
        confirmText: '확인'
      });
      return;
    }
    if (birthdateError) {
      openModal('warning', {
        title: '입력 오류',
        content: '생년월일이 올바르지 않습니다.',
        confirmText: '확인'
      });
      return;
    }

    try {
      const updateData = {
        username: state.nickname,
        phone_number: state.phone_number.replace(/-/g, ''),
        email: state.email,
        birth_date: state.birth_date,
      };
      
      if (profileImageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            updateData.profile_image = reader.result.split(',')[1];
            const response = await updateMyInfo(updateData);
            console.log("Update response:", response);
            
            openModal('success', {
              title: '완료',
              content: '저장되었습니다.',
              confirmText: '확인',
              onConfirm: () => navigate('/mypage/info')
            });
          } catch (error) {
            console.error("Failed to update user info with image:", error);
            openModal('error', {
              title: '오류',
              content: error.response?.data?.message || '정보 수정에 실패했습니다. 다시 시도해주세요.',
              confirmText: '확인'
            });
          }
        };
        reader.onerror = () => {
          openModal('error', {
            title: '오류',
            content: '이미지 파일을 읽는데 실패했습니다.',
            confirmText: '확인'
          });
        };
        reader.readAsDataURL(profileImageFile);
      } else {
        try {
          const response = await updateMyInfo(updateData);
          console.log("Update response:", response);
          
          openModal('success', {
            title: '완료',
            content: '저장되었습니다.',
            confirmText: '확인',
            onConfirm: () => navigate('/mypage/info')
          });
        } catch (error) {
          console.error("Failed to update user info:", error);
          openModal('error', {
            title: '오류',
            content: error.response?.data?.message || '정보 수정에 실패했습니다. 다시 시도해주세요.',
            confirmText: '확인'
          });
        }
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      openModal('error', {
        title: '오류',
        content: error.response?.data?.message || '정보 수정에 실패했습니다. 다시 시도해주세요.',
        confirmText: '확인'
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getDominantColor = (img) => {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(img);
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ name: 'profile_image', value: reader.result });
        setProfileImageUrl(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const color = getDominantColor(img);
          setBorderColor(color);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-lightBg dark:bg-darkdark px-4">
        <div className="w-full max-w-md relative pt-[100px] pb-8 flex flex-col gap-3 items-center bg-yl100 dark:bg-darktext rounded-3xl shadow-lg">
          <BackButton to="/mypage/info" />

          <div className="absolute -top-[92px]">
            <div
              className="w-[184px] h-[184px] rounded-full overflow-hidden shadow-xl border-4 group relative"
              style={{ borderColor: "transparent" }}
            >
              <img
                src={getProfileImageUrl()}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
                onError={e => { e.target.src = "/profile.png"; }}
              />
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="w-full mt-2 px-6">
            <div className="flex flex-col gap-8 items-center">
              <div className="flex flex-col gap-3 w-full max-w-[500px]">
                <FormInput
                  label="닉네임"
                  name="nickname"
                  value={state.nickname}
                  onChange={handleChange}
                  className="w-full"
                />
                <FormInput
                  label="전화번호"
                  name="phone_number"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={state.phone_number}
                  onChange={handleChange}
                  error={phoneError}
                  className="w-full"
                />
                <FormInput
                  label="이메일"
                  name="email"
                  type="text"
                  value={state.email}
                  onChange={handleChange}
                  error={emailError}
                  className="w-full"
                />
                <FormInput
                  label="생년월일"
                  name="birth_date"
                  type="date"
                  value={state.birth_date}
                  onChange={handleChange}
                  min="1900-01-01"
                  max={today}
                  error={birthdateError}
                  className="w-full"
                />
              </div>

              <div className="w-full max-w-[500px]">
                <Button type="submit" className="w-full">
                  저장하기
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}