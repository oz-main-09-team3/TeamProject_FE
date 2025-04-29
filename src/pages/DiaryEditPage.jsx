import React, { useState, useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor from '@toast-ui/editor';
import testimage from '../assets/profile.png';

const DiaryEditPage = () => {
  const [mood, setMood] = useState('슬픔'); 
  const [originalContent, setOriginalContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const moodImageSrc = testimage;

  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleGoBack = () => {
    if (isEditing) {
      if (window.confirm('저장하지 않은 변경사항이 있습니다. 나가시겠습니까?')) {
        console.log('수정 취소, 뒤로가기');
      }
    } else {
      console.log('뒤로가기');
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown();
      console.log('저장된 내용:', content);
      console.log('선택된 감정:', mood);
      alert('일기가 수정되었습니다.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      if (editorRef.current) {
        editorRef.current.setMarkdown(originalContent);
      }
      console.log('수정 취소');
    }
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        const diaryData = {
          content: '테스트',
          mood: '슬픔'
        };
        
        setOriginalContent(diaryData.content);
        setMood(diaryData.mood);
        
        if (editorContainerRef.current) {
          editorRef.current = new Editor({
            el: editorContainerRef.current,
            height: '400px',
            initialEditType: 'markdown',
            initialValue: diaryData.content,
            toolbarItems: [
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'image', 'link'],
              ['code', 'codeblock']
            ]
          });
        }
      } catch (error) {
        console.error('일기 데이터를 가져오는 중 오류 발생:', error);
      }
    };
    
    fetchDiaryData();
    
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  const moodButtons = [
    "짜릿해", "기쁨", "사랑", "기대감", 
    "기쁨", "행복함", "뿌듯함", "츄릅",
    "인생..", "꾸엑", "지침", "놀람",
    "현타", "그래요", "당황", "슬픔",
    "불안함", "어이없음", "울고싶음", "우울함",
    "화남", "열받음", "자신감", "쑥스러움",
    "니가?", "억울함", "슬픔", "소노"
  ];

  return (
    <div className="flex max-w-6xl mx-auto h-screen bg-white font-sans">
      <div className="flex-grow p-5 flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <button 
            className="p-3 bg-gray-200 rounded-full text-lg w-10 h-10 flex items-center justify-center" 
            onClick={handleGoBack}
          >
            ←
          </button>
          <div className="flex space-x-3">
            <button 
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              onClick={handleCancel}
            >
              취소
            </button>
            <button 
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>

        <div className="flex mb-6 justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-amber-700 flex justify-center items-center overflow-hidden relative">
            <div className="absolute inset-0 rounded-full border-4 border-amber-700"></div>
            <img 
              src={moodImageSrc} 
              alt="현재 기분" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">
            {formatDate()}
          </div>
          <div className="text-sm text-gray-500">
            수정 중...
          </div>
        </div>
        
        <div className="w-full rounded-lg border border-gray-200 shadow-sm mb-4">
          <div ref={editorContainerRef} className="min-h-[400px]"></div>
        </div>
        
        <div className="text-right text-gray-400 text-sm mb-4">
          0 / 20
        </div>
      </div>
      
      <div className="w-1/3 p-5 flex flex-col border-l border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          이모지는 하나만 골라주세요!
        </h3>
        
        <div className="text-sm text-gray-500 mb-4">
          현재 선택: <span className="font-medium">{mood}</span>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-4 gap-3">
            {moodButtons.map((buttonText, index) => (
              <MoodButton 
                key={index} 
                text={buttonText} 
                isSelected={mood === buttonText}
                onClick={() => handleMoodChange(buttonText)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MoodButton = ({ text, isSelected, onClick }) => (
  <button 
    className={`py-1 px-2 transition-colors rounded-md text-sm h-12 w-full flex items-center justify-center
      ${isSelected ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100 hover:bg-gray-200'}`}
    onClick={onClick}
    style={{ wordBreak: 'keep-all', whiteSpace: 'normal', lineHeight: '1.2' }}
  >
    {text}
  </button>
);

export default DiaryEditPage;