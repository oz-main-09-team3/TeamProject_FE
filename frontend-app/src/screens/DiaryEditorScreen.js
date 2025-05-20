import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// 컴포넌트
import MoodSelector from '../components/MoodSelector';

// 스토어
import useDiaryStore from '../store/diaryStore';
import useUiStore from '../store/uiStore';

const DiaryEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diary } = route.params || {};
  const { isDarkMode } = useUiStore();
  
  // 상태
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(true);
  
  // Zustand 스토어 사용
  const { 
    fetchEmotions, 
    createDiary, 
    updateDiary, 
    isLoading, 
    error 
  } = useDiaryStore();

  // 현재 날짜 포맷팅
  const formatDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  // 날짜 표시용 (수정 모드일 경우 기존 날짜, 작성 모드일 경우 오늘 날짜)
  const dateToShow = diary?.date || formatDate();

  // 이모션 목록 가져오기
  useEffect(() => {
    const loadEmotions = async () => {
      setIsLoadingEmotions(true);
      try {
        const emotionsData = await fetchEmotions();
        
        // 이모션 데이터 형식 변환 (React Native 컴포넌트용)
        const formattedEmotions = Object.entries(emotionsData).map(([id, emotion]) => ({
          id: parseInt(id),
          name: emotion.name,
          image_url: emotion.image_url,
        }));
        
        setEmotions(formattedEmotions);
      } catch (error) {
        console.error('이모션 로딩 실패:', error);
        Alert.alert('오류', '감정 이모지를 불러오는데 실패했습니다.');
      } finally {
        setIsLoadingEmotions(false);
      }
    };
    
    loadEmotions();
  }, [fetchEmotions]);

  // 수정 모드인 경우, 기존 데이터 설정
  useEffect(() => {
    if (diary) {
      setContent(diary.content || '');
      setMood(String(diary.emotionId));
      setIsEditing(true);
    }
  }, [diary]);

  // 텍스트 변경 핸들러
  const handleContentChange = (text) => {
    setContent(text);
    setIsEditing(true);
  };

  // 감정 선택 핸들러
  const handleMoodChange = (newMood) => {
    setMood(newMood);
    setIsEditing(true);
  };

  // 저장 핸들러
  const handleSave = () => {
    // 필수 입력 확인
    if (!mood) {
      Alert.alert('알림', '기분을 선택해주세요.');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('알림', '일기 내용을 입력해주세요.');
      return;
    }
    
    // 저장 확인 다이얼로그
    Alert.alert(
      '일기 저장',
      '작성한 내용을 저장하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '저장',
          onPress: async () => {
            try {
              const diaryData = {
                emotion_id: parseInt(mood, 10),
                content: content,
                visibility: true
              };
              
              let result;
              
              // 수정 모드와 작성 모드 구분
              if (diary?.id) {
                result = await updateDiary(diary.id, diaryData);
                Alert.alert('완료', '일기가 수정되었습니다.');
              } else {
                result = await createDiary(diaryData);
                Alert.alert('완료', '새로운 일기가 저장되었습니다.');
              }
              
              // 저장 후 메인 화면으로 이동
              navigation.navigate('MainTabs');
            } catch (error) {
              console.error('일기 저장 실패:', error);
              Alert.alert('오류', `일기 저장에 실패했습니다: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    if (isEditing && (content.trim() || mood)) {
      Alert.alert(
        '작성 취소',
        '저장하지 않은 내용이 있습니다. 나가시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '나가기',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

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
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? COLORS.darktext : COLORS.lighttext} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              { 
                backgroundColor: isEditing 
                  ? (isDarkMode ? COLORS.darkOrange : COLORS.lightOrange)
                  : 'gray',
                opacity: isEditing ? 1 : 0.5,
              }
            ]}
            onPress={handleSave}
            disabled={!isEditing || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>저장</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        {/* 날짜 및 상태 */}
        <View style={styles.dateContainer}>
          <Text style={[
            styles.dateText,
            { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
          ]}>
            {dateToShow}
          </Text>
          
          <Text style={[
            styles.statusText,
            { color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
          ]}>
            {diary?.id ? '수정 중...' : '작성 중...'}
          </Text>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* 일기 본문 입력 */}
          <View style={[
            styles.editorContainer,
            { 
              backgroundColor: 'white',
              borderColor: isDarkMode ? COLORS.darkCopper : COLORS.lightGold
            }
          ]}>
            <TextInput
              style={styles.contentInput}
              multiline
              placeholder="오늘의 일기를 작성해주세요..."
              placeholderTextColor="gray"
              value={content}
              onChangeText={handleContentChange}
            />
          </View>
          
          {/* 감정 선택 */}
          <View style={styles.moodSection}>
            <Text style={[
              styles.moodTitle,
              { color: isDarkMode ? COLORS.darktext : COLORS.lighttext }
            ]}>
              오늘의 기분
            </Text>
            
            {isLoadingEmotions ? (
              <ActivityIndicator 
                size="large"
                color={isDarkMode ? COLORS.darkOrange : COLORS.lightOrange}
                style={styles.loadingIndicator}
              />
            ) : (
              <MoodSelector
                emotions={emotions}
                selectedMood={mood}
                onSelectMood={handleMoodChange}
                isDarkMode={isDarkMode}
              />
            )}
          </View>
        </ScrollView>
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
  saveButton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  editorContainer: {
    minHeight: 240,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlignVertical: 'top',
  },
  moodSection: {
    marginBottom: 24,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default DiaryEditorScreen;