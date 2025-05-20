import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';
import { COLORS } from '../constants/colors';

const DiaryCard = ({ diary, onPress, onLike, isDarkMode }) => {
  // 좋아요 애니메이션
  const likeScale = new Animated.Value(1);
  
  // 이모지 이미지 URL 포맷팅
  const getEmojiSrc = () => {
    let emotionId = diary.emotionId;
    if (emotionId && typeof emotionId === 'object') {
      emotionId = emotionId.id;
    }
    return `https://your-backend-url.com/static/emotions/${emotionId || 1}.png`;
  };

  // 좋아요 핸들러
  const handleLike = () => {
    // 애니메이션 실행
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // 실제 좋아요 토글
    onLike();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLORS.darkBg : COLORS.yl100 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* 왼쪽: 이모지 */}
        <Image
          source={{ uri: getEmojiSrc() }}
          style={styles.emojiImage}
          resizeMode="contain"
        />
        
        {/* 중앙: 제목/내용 및 날짜 */}
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.bodyText, 
              { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
            ]}
            numberOfLines={2}
          >
            {diary.body}
          </Text>
          <Text 
            style={[
              styles.dateText, 
              { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
            ]}
          >
            {formatDate(diary.createdAt)}
          </Text>
        </View>
        
        {/* 오른쪽: 좋아요 버튼 */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLike}
        >
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Ionicons
              name={diary.liked ? 'heart' : 'heart-outline'}
              size={24}
              color={diary.liked ? '#e03131' : isDarkMode ? COLORS.darktext : COLORS.lighttext}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
  },
  likeButton: {
    padding: 8,
  },
});

export default DiaryCard;