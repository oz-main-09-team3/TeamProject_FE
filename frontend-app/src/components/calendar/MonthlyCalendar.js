import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useUiStore from '../../store/uiStore';
import { COLORS } from '../../constants/colors';

const BACKEND_URL = 'https://your-backend-url.com'; // .env 파일에서 로드하는 것이 좋습니다

const MonthlyCalendar = ({ diaries = [], emotionMap = {}, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isDarkMode } = useUiStore();
  
  // 화면 너비에 따라 셀 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.floor((screenWidth - 32) / 7); // 패딩 고려
  
  // 날짜 키 포맷팅
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 일기별 날짜 데이터
  const getDiaryByDate = () => {
    const diaryMap = {};
    
    diaries.forEach(diary => {
      const date = new Date(diary.createdAt);
      const dateKey = formatDateKey(date);
      
      if (!diaryMap[dateKey] || new Date(diary.createdAt) > new Date(diaryMap[dateKey].createdAt)) {
        diaryMap[dateKey] = diary;
      }
    });
    
    return diaryMap;
  };

  const diaryMap = getDiaryByDate();

  // 이모지 URL 가져오기
  const getEmojiSrc = (diary) => {
    let emotionId = diary.emotionId;
    if (emotionId && typeof emotionId === 'object') {
      emotionId = emotionId.id;
    }
    return `${BACKEND_URL}/static/emotions/${emotionId || 1}.png`;
  };

  // 월별 데이터 가져오기
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    return { year, month, firstDay, lastDay, startWeek, daysInMonth };
  };

  // 캘린더 날짜 생성
  const generateCalendarDays = () => {
    const { year, month, startWeek, daysInMonth } = getMonthData();
    const days = [];
    
    // 이전 달 날짜 추가
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }
    
    // 현재 달 날짜 추가
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }
    
    // 다음 달 날짜 추가 (6주 채우기)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }
    
    return days;
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    const dateKey = formatDateKey(date);
    if (onDateClick) {
      onDateClick(dateKey);
    }
  };

  // 이전달 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // 다음달 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = generateCalendarDays();
  const today = new Date();
  const todayKey = formatDateKey(today);

  // 캘린더 렌더링
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle, 
          {color: isDarkMode ? COLORS.darktext : COLORS.lighttext}
        ]}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </Text>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={goToPrevMonth}
            style={[
              styles.navButton,
              {backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow}
            ]}
          >
            <Ionicons 
              name="chevron-back" 
              size={16} 
              color={isDarkMode ? COLORS.darktext : COLORS.lighttext} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToNextMonth}
            style={[
              styles.navButton,
              {backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow}
            ]}
          >
            <Ionicons 
              name="chevron-forward" 
              size={16} 
              color={isDarkMode ? COLORS.darktext : COLORS.lighttext} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekdaysRow}>
        {weekDays.map((day, index) => (
          <View
            key={day}
            style={[styles.weekdayCell, {width: cellSize}]}
          >
            <Text
              style={[
                styles.weekdayText,
                index === 0 ? styles.sundayText : index === 6 ? styles.saturdayText : null,
                {color: isDarkMode 
                  ? (index === 0 ? '#ff6b6b' : index === 6 ? '#74c0fc' : COLORS.darktext) 
                  : (index === 0 ? '#e03131' : index === 6 ? '#1971c2' : COLORS.lighttext)
                }
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          const dateKey = formatDateKey(day.date);
          const diary = diaryMap[dateKey];
          const isToday = dateKey === todayKey;
          const dayOfWeek = day.date.getDay();
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleDateClick(day.date)}
              style={[
                styles.dayCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isDarkMode
                    ? (day.isCurrentMonth ? COLORS.darkBg : COLORS.brown900)
                    : (day.isCurrentMonth ? COLORS.lightBg : COLORS.yl100),
                  borderColor: isDarkMode 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(0,0,0,0.1)',
                },
                isToday && (isDarkMode 
                  ? styles.todayCellDark 
                  : styles.todayCellLight)
              ]}
            >
              {/* 날짜 번호 */}
              <Text
                style={[
                  styles.dayNumber,
                  !day.isCurrentMonth && styles.otherMonthDay,
                  dayOfWeek === 0 && styles.sundayText,
                  dayOfWeek === 6 && styles.saturdayText,
                  isToday && styles.todayText,
                  {color: isDarkMode 
                    ? (day.isCurrentMonth ? COLORS.darktext : 'rgba(255,255,255,0.3)') 
                    : (day.isCurrentMonth ? COLORS.lighttext : 'rgba(0,0,0,0.3)')
                  }
                ]}
              >
                {day.date.getDate()}
              </Text>
              
              {/* 이모지 */}
              {diary && (
                <Image
                  source={{ uri: getEmojiSrc(diary) }}
                  style={styles.emojiImage}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayCell: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    borderWidth: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumber: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
    alignSelf: 'flex-start',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  todayCellLight: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  todayCellDark: {
    backgroundColor: 'rgba(66, 135, 245, 0.2)',
  },
  todayText: {
    fontWeight: 'bold',
  },
  sundayText: {
    color: '#e03131',
  },
  saturdayText: {
    color: '#1971c2',
  },
  emojiImage: {
    position: 'absolute',
    top: '25%',
    width: '90%',
    height: '75%',
  },
});

export default MonthlyCalendar;