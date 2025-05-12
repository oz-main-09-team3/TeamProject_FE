import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MainScreen from '../screens/MainScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Main') {
            return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />;
          } else if (route.name === 'MyPage') {
            return <MaterialIcons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} options={{ title: '메인' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }} />
    </Tab.Navigator>
  );
} 