import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, fontWeight: '700', color: focused ? '#FF6A2F' : 'rgba(255,255,255,0.3)' }}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#13131F',
        borderTopColor: 'rgba(255,255,255,0.07)',
        height: 80,
        paddingBottom: 10,
      },
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }} />
      <Tabs.Screen name="scanner" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📷" label="Scan" focused={focused} /> }} />
      <Tabs.Screen name="workout" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏋️" label="Workout" focused={focused} /> }} />
      <Tabs.Screen name="diary" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📖" label="Diary" focused={focused} /> }} />
      <Tabs.Screen name="stats" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Stats" focused={focused} /> }} />
    </Tabs>
  );
}
