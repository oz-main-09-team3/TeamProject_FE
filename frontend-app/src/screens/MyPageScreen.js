import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Alert } from 'react-native';

const MENU_ITEMS = [
  { id: 'edit', headerText: '내 정보 수정', bodyText: '프로필, 비밀번호 변경', rightIcon: '>' },
  { id: 'withdraw', headerText: '회원 탈퇴', bodyText: '계정 삭제', rightIcon: '>' },
];

export default function MyPageScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuClick = (item) => {
    if (item.id === 'withdraw') {
      setIsModalOpen(true);
    } else {
      Alert.alert('이동', `${item.headerText} 페이지로 이동`);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    Alert.alert('탈퇴', '탈퇴 처리 로직 실행');
  };

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 영역 (임시) */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImage} />
        <Text style={styles.profileName}>몽이마덜</Text>
      </View>
      {/* 메뉴 리스트 */}
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuClick(item)}>
            <View>
              <Text style={styles.menuHeader}>{item.headerText}</Text>
              <Text style={styles.menuBody}>{item.bodyText}</Text>
            </View>
            <Text style={styles.menuIcon}>{item.rightIcon}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      {/* 탈퇴 모달 */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>회원 탈퇴</Text>
            <Text style={styles.modalText}>정말 탈퇴하시겠습니까? 탈퇴하면 모든 데이터가 삭제됩니다!</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.modalButton}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={[styles.modalButton, { marginLeft: 10 }] }>
                <Text style={{ color: 'red' }}>탈퇴하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEE',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  menuHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuBody: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  menuIcon: {
    fontSize: 18,
    color: '#AAA',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
}); 