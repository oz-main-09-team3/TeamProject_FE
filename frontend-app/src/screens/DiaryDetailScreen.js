import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// 컴포넌트
import CommentItem from '../components/CommentItem';

// 스토어
import useDiaryStore from '../store/diaryStore';
import useUiStore from '../store/uiStore';

// API 및 유틸
// import { addLike, removeLike } from '../service/likeApi';
import { formatDate } from '../utils/dateUtils';

const DiaryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diary } = route.params || {};
  const { isDarkMode } = useUiStore();
  
  // 상태
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  
  // Zustand 스토어 사용
  const { 
    currentDiary, 
    isLoading, 
    error, 
    fetchDiary, 
    deleteDiary 
  } = useDiaryStore();

  // 다이어리 ID
  const diaryId = diary?.id || route.params?.id;

  // 다이어리 상세 정보 가져오기
  useEffect(() => {
    const loadDiaryDetail = async () => {
      if (!diaryId) {
        Alert.alert('오류', '일기 ID를 찾을 수 없습니다.');
        navigation.goBack();
        return;
      }
      
      try {
        await fetchDiary(diaryId);
      } catch (error) {
        Alert.alert('오류', '일기를 불러오는데 실패했습니다.');
        navigation.goBack();
      }
    };
    
    loadDiaryDetail();
  }, [diaryId, fetchDiary, navigation]);

  // 현재 다이어리 정보에서 좋아요 상태 및 댓글 목록 초기화
  useEffect(() => {
    if (currentDiary) {
      setIsLiked(currentDiary.liked || false);
      setLikeCount(currentDiary.likeCount || 0);
      
      if (currentDiary.comments && Array.isArray(currentDiary.comments)) {
        setComments(currentDiary.comments);
      }
    }
  }, [currentDiary]);

  // 좋아요 토글 핸들러
  const handleLike = async () => {
    if (!diaryId) return;
    
    try {
      if (isLiked) {
        await removeLike(diaryId);
        setLikeCount(prevCount => Math.max(0, prevCount - 1));
      } else {
        await addLike(diaryId);
        setLikeCount(prevCount => prevCount + 1);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 일기 삭제 핸들러
  const handleDelete = () => {
    Alert.alert(
      '일기 삭제',
      '정말로 이 일기를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDiary(diaryId);
              Alert.alert('완료', '일기가 삭제되었습니다.');
              navigation.navigate('MainTabs');
            } catch (error) {
              Alert.alert('오류', '일기 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  // 댓글 작성 핸들러
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoadingComment(true);
    
    try {
      // 댓글 API 직접 호출 (실제 구현에서는 comment 스토어 사용)
      const response = await fetch(`https://your-backend-url.com/api/diary/${diaryId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '댓글 작성에 실패했습니다.');
      }
      
      // 새 댓글 추가하고 입력창 초기화
      setComments([...comments, data]);
      setNewComment('');
      
      // 다이어리 상세 정보 새로고침
      await fetchDiary(diaryId);
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    } finally {
      setIsLoadingComment(false);
    }
  };

  // 이모지 이미지 URL 가져오기
  const getEmojiImageUrl = () => {
    if (!currentDiary) return null;
    
    const emotionId = currentDiary.emotionId || 1;
    return `https://your-backend-url.com/static/emotions/${emotionId}.png`;
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? COLORS.darkdark : COLORS.lightBg }]}>
        <ActivityIndicator size="large" color={isDarkMode ? COLORS.darkOrange : COLORS.lightOrange} />
        <Text style={{ color: isDarkMode ? COLORS.darktext : COLORS.lighttext }}>
          일기를 불러오는 중...
        </Text>
      </View>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDarkMode ? COLORS.darkdark : COLORS.lightBg }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: isDarkMode ? COLORS.darkOrange : COLORS.lightOrange }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 다이어리가 없을 때
  if (!currentDiary) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: isDarkMode ? COLORS.darkdark : COLORS.lightBg }]}>
        <Text style={{ color: isDarkMode ? COLORS.darktext : COLORS.lighttext }}>
          일기를 찾을 수 없습니다.
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: isDarkMode ? COLORS.darkOrange : COLORS.lightOrange }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? COLORS.darkdark : COLORS.lightBg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? COLORS.darktext : COLORS.lighttext} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow }
              ]}
              onPress={handleLike}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#e03131' : (isDarkMode ? COLORS.darktext : COLORS.lighttext)}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isDarkMode ? COLORS.darkCopper : COLORS.lightYellow }
              ]}
              onPress={() => navigation.navigate('DiaryEditor', { diary: currentDiary })}
            >
              <Ionicons name="pencil" size={20} color={isDarkMode ? COLORS.darktext : COLORS.lighttext} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: '#e03131' }
              ]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* 이모지 및 날짜 */}
            <View style={styles.emojiContainer}>
              <Image
                source={{ uri: getEmojiImageUrl() }}
                style={styles.emojiImage}
                resizeMode="contain"
              />
              
              <Text style={[
                styles.dateText,
                { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
              ]}>
                {formatDate(currentDiary.createdAt)}
              </Text>
            </View>
            
            {/* 일기 본문 */}
            <View style={[
              styles.diaryContent,
              { backgroundColor: 'white', borderColor: isDarkMode ? COLORS.darkCopper : COLORS.lightGold }
            ]}>
              <Text style={styles.diaryText}>
                {currentDiary.content}
              </Text>
              
              {/* 작성자 정보 */}
              {currentDiary.userName && (
                <View style={styles.authorInfo}>
                  {currentDiary.userProfile && (
                    <Image
                      source={{ uri: currentDiary.userProfile }}
                      style={styles.authorImage}
                    />
                  )}
                  <View>
                    <Text style={styles.authorName}>{currentDiary.userNickname || currentDiary.userName}</Text>
                    <Text style={styles.authorUsername}>@{currentDiary.userName}</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* 좋아요 정보 */}
            {likeCount > 0 && (
              <View style={styles.likeInfo}>
                <Ionicons name="heart" size={16} color="#e03131" />
                <Text style={[
                  styles.likeText,
                  { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
                ]}>
                  {likeCount}명이 좋아합니다
                </Text>
              </View>
            )}
            
            {/* 댓글 목록 */}
            <View style={styles.commentsContainer}>
              <Text style={[
                styles.commentsTitle,
                { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
              ]}>
                댓글 ({comments.length})
              </Text>
              
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id || comment.comment_id}
                    comment={comment}
                    isDarkMode={isDarkMode}
                    onDeleteComment={() => {
                      // 댓글 삭제 로직 구현
                      Alert.alert(
                        '댓글 삭제',
                        '이 댓글을 삭제하시겠습니까?',
                        [
                          { text: '취소', style: 'cancel' },
                          { 
                            text: '삭제', 
                            style: 'destructive',
                            onPress: async () => {
                              // 댓글 삭제 API 호출
                              try {
                                await fetch(`https://your-backend-url.com/api/diary/${diaryId}/comments/${comment.id || comment.comment_id}/`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                  },
                                });
                                
                                // 댓글 목록 업데이트
                                setComments(comments.filter(c => 
                                  (c.id || c.comment_id) !== (comment.id || comment.comment_id)
                                ));
                              } catch (error) {
                                Alert.alert('오류', '댓글 삭제에 실패했습니다.');
                              }
                            }
                          }
                        ]
                      );
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyComments}>
                  <Text style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                    아직 댓글이 없습니다.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        
        {/* 댓글 입력 */}
        <View style={[
          styles.commentInputContainer,
          { 
            backgroundColor: isDarkMode ? COLORS.darkBg : 'white',
            borderTopColor: isDarkMode ? COLORS.darkCopper : COLORS.lightGold,
          }
        ]}>
          <TextInput
            style={[
              styles.commentInput,
              { 
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: isDarkMode ? COLORS.darktext : COLORS.lighttext,
              }
            ]}
            placeholder="댓글을 입력하세요..."
            placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: isDarkMode ? COLORS.darkOrange : COLORS.lightOrange }
            ]}
            onPress={handleSubmitComment}
            disabled={isLoadingComment || !newComment.trim()}
          >
            {isLoadingComment ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  diaryContent: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
  },
  diaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  authorUsername: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  likeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  likeText: {
    fontSize: 14,
  },
  commentsContainer: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyComments: {
    padding: 16,
    alignItems: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e03131',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DiaryDetailScreen;