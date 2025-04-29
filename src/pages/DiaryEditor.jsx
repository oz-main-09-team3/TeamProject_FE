import React, { useState, useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor from '@toast-ui/editor';
import testimage from '../assets/profile.png'

const DiaryEditor = () => {
  const [mood, setMood] = useState('기본');
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const moodImageSrc = testimage; 

  const formatDate = () => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  const handleGoBack = () => {
    console.log('뒤로가기');
  };

  useEffect(() => {
    if (!editorContainerRef.current) return;

    editorRef.current = new Editor({
      el: editorContainerRef.current,
      height: '500px',
      previewStyle: 'vertical',
      initialEditType: 'markdown',
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock']
      ]
    });

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
        <div className="mb-8">
          <button 
            className="p-3 bg-gray-200 rounded-full text-lg w-10 h-10 flex items-center justify-center" 
            onClick={handleGoBack}
          >
            ←
          </button>
        </div>

        <div className="flex mb-8 w-full">
          <div className="ml-[60%] w-28 h-28 rounded-full border-2 border-amber-700 flex justify-center items-center overflow-hidden relative">
            <div className="absolute inset-0 rounded-full border-4 border-amber-700"></div>
            <img 
              src={moodImageSrc} 
              alt="현재 기분" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-2xl font-bold mb-4">
          {formatDate()}
        </div>
        
        <div className="w-full rounded-lg border border-gray-200 shadow-sm mb-4">
          <div ref={editorContainerRef} className="min-h-[400px]"></div>
        </div>
        
        <div className="text-right text-gray-400 text-sm">
          0 / 20
        </div>
      </div>
      
      <div className="w-1/3 p-5 flex flex-col">
        <h3 className="text-center text-base mb-4">
          이모지는 하나만 골라주세요!
        </h3>
        
        <div className="mt-[100%]"></div>
        
        <div className="grid grid-cols-4 gap-3">
          {moodButtons.map((buttonText, index) => (
            <MoodButton 
              key={index} 
              text={buttonText} 
              onClick={() => handleMoodChange(buttonText)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MoodButton = ({ text, onClick }) => (
  <button 
    className="py-1 px-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md text-sm h-12 w-full flex items-center justify-center"
    onClick={onClick}
    style={{ wordBreak: 'keep-all', whiteSpace: 'normal', lineHeight: '1.2' }}
  >
    {text}
  </button>
);

export default DiaryEditor;