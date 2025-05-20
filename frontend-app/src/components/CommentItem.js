import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const CommentItem = ({ comment, isDarkMode, onDeleteComment, onLikeComment, isLiked }) => {
  // 프로필 이미지 URL 포맷팅
  const getProfileImageUrl = () => {
    const defaultImage = 'https://your-backend-url.com/static/default-profile.png';
    
    if (!comment.user || !comment.user.profile) {
      return defaultImage;
    }
    
    // S3/CloudFront URL 처리 로직을 여기에 구현할 수 있음
    return comment.user.profile;
  };

  // 날짜 포맷팅
  const formatCommentDate = (dateString) => {
    if (!dateString) return '날짜 없음';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  // 사용자 이름 및 정보 추출
  const nickname = comment.user ? comment.user.nickname : '사용자';
  const username = comment.user ? comment.user.username : '';
  const commentId = comment.id || comment.comment_id;
  const content = comment.content;
  const createdAt = comment.created_at;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }
    ]}>
      {/* 헤더: 프로필 이미지, 닉네임, 날짜 */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: getProfileImageUrl() }}
            style={styles.profileImage}
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지 설정 로직
              e.currentTarget.src = 'https://your-backend-url.com/static/default-profile.png';
            }}
          />
          <View>
            <Text style={[
              styles.nickname,
              { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
            ]}>
              {nickname}
            </Text>
            {username && (
              <Text style={styles.username}>
                @{username}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.date}>
          {formatCommentDate(createdAt)}
        </Text>
      </View>

      {/* 댓글 내용 */}
      <Text style={[
        styles.content,
        { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
      ]}>
        {content}
      </Text>

      {/* 액션 버튼 */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLikeComment && onLikeComment(commentId)}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={16}
            color={isLiked ? "#e03131" : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)')}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDeleteComment && onDeleteComment(commentId)}
        >
          <Ionicons
            name="trash-outline"
            size={16}
            color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  nickname: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    color: 'gray',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
});

export default CommentItem;