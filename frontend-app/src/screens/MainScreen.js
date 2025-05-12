import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const [diaryList, setDiaryList] = useState([
    { id: 1, header: '아 오늘도 힘들었다.', body: '아 진짜 집 가고싶었다.', liked: false },
    { id: 2, header: '코드 너무 안 돌아간다.', body: '나도 모르게 감자처럼 웅크렸다.', liked: false },
    { id: 3, header: '조금은 나아진 것 같다.', body: '어제보단 성장했어!', liked: false },
    { id: 4, header: '프론트 너무 재밌다.', body: '역시 나랑 잘 맞아!', liked: false },
    { id: 5, header: '하..버그잡기 힘들어.', body: '하지만 해냈다!', liked: false },
  ]);
  const [loadingId, setLoadingId] = useState(null);

  const handleLike = async (id) => {
    if (loadingId !== null) return;
    try {
      setLoadingId(id);
      const currentDiary = diaryList.find((diary) => diary.id === id);
      const newLikedStatus = !currentDiary.liked;
      await new Promise((resolve) => setTimeout(resolve, 300));
      setDiaryList((prevList) =>
        prevList.map((diary) =>
          diary.id === id ? { ...diary, liked: newLikedStatus } : diary
        )
      );
    } catch (error) {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.header}>{item.header}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <TouchableOpacity
        onPress={() => handleLike(item.id)}
        disabled={loadingId === item.id}
        style={{ opacity: loadingId === item.id ? 0.5 : 1, position: 'absolute', right: 16, top: 16 }}
      >
        <Ionicons
          name={item.liked ? 'heart' : 'heart-outline'}
          size={28}
          color={item.liked ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={diaryList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: '#555',
  },
}); 