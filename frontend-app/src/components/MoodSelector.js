import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { EMOJI_TEXT_MAP } from '../constants/Emoji';

const MoodSelector = ({ emotions, selectedMood, onSelectMood, isDarkMode }) => {
  // 이모지 URL 포맷팅
  const getEmojiImageUrl = (emotion) => {
    if (emotion?.image_url) {
      // 이미 완전한 URL인지 확인
      if (emotion.image_url.startsWith('http')) {
        return emotion.image_url;
      }
      
      // 상대 경로인 경우 백엔드 URL 추가
      return `https://your-backend-url.com${emotion.image_url}`;
    }
    
    // ID만 있는 경우 기본 경로로 구성
    return `https://your-backend-url.com/static/emotions/${emotion.id}.png`;
  };

  // 선택된 감정의 텍스트 찾기
  const getSelectedMoodText = () => {
    if (!selectedMood) return '없음';
    
    const emotion = emotions.find(e => String(e.id) === String(selectedMood));
    if (emotion?.name) return emotion.name;
    
    return EMOJI_TEXT_MAP[Number(selectedMood)] || '없음';
  };

  // 이모션 렌더링 함수
  const renderEmotionItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.moodButton,
        selectedMood === String(item.id) && [
          styles.selectedMoodButton,
          { 
            backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow,
            borderColor: isDarkMode ? COLORS.darkOrange : COLORS.lightOrange,
          }
        ]
      ]}
      onPress={() => onSelectMood(String(item.id))}
    >
      <View style={styles.moodButtonContent}>
        <Image
          source={{ uri: getEmojiImageUrl(item) }}
          style={styles.moodImage}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.moodText,
            {
              color: isDarkMode 
                ? (selectedMood === String(item.id) ? COLORS.darktext : 'rgba(255,255,255,0.7)') 
                : (selectedMood === String(item.id) ? COLORS.lighttext : 'rgba(0,0,0,0.7)')
            }
          ]}
        >
          {item.name || EMOJI_TEXT_MAP[item.id] || `감정${item.id}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectedMoodContainer}>
        <Text style={[
          styles.selectedMoodLabel,
          { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
        ]}>
          현재 선택:
        </Text>
        <Text style={[
          styles.selectedMoodText,
          { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
        ]}>
          {getSelectedMoodText()}
        </Text>
      </View>
      
      <FlatList
        data={emotions}
        renderItem={renderEmotionItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.moodRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.moodGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  selectedMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedMoodLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  selectedMoodText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodGrid: {
    paddingBottom: 16,
  },
  moodRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodButton: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 12,
  },
  selectedMoodButton: {
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
  },
  moodButtonContent: {
    alignItems: 'center',
  },
  moodImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MoodSelector;