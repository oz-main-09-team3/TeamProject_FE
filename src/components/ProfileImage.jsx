import React from 'react';

export default function ProfileImage() {
  return (
    <div className="absolute -top-[92px]">
      <div className="w-[184px] h-[184px] rounded-full overflow-hidden border-4 bg-lightBg dark:bg-darkdark shadow-md">
        <img
          src="/profile.png"
          alt="프로필 이미지"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
} 