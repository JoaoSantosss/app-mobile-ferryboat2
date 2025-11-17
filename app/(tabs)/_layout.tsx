import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#155DFC',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="buy_trips"
        options={{
          title: 'Comprar',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='shopping-cart' color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account' color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
