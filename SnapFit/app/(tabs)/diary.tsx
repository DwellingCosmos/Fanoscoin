import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const DIARY_DATA = [
  {
    date: 'Today',
    totalCalories: 1420,
    meals: [
      { id: '1', name: 'Oatmeal with Berries', emoji: '🥣', calories: 320, protein: 12, carbs: 54, fat: 6, time: '8:00 AM', mealType: 'Breakfast' },
      { id: '2', name: 'Grilled Chicken Salad', emoji: '🥗', calories: 480, protein: 42, carbs: 18, fat: 22, time: '12:30 PM', mealType: 'Lunch' },
      { id: '3', name: 'Greek Yogurt', emoji: '🫙', calories: 150, protein: 15, carbs: 12, fat: 3, time: '3:00 PM', mealType: 'Snack' },
      { id: '4', name: 'Salmon & Rice', emoji: '🍱', calories: 470, protein: 38, carbs: 45, fat: 14, time: '7:00 PM', mealType: 'Dinner' },
    ]
  },
  {
    date: 'Yesterday',
    totalCalories: 1680,
    meals: [
      { id: '5', name: 'Scrambled Eggs & Toast', emoji: '🍳', calories: 380, protein: 22, carbs: 28, fat: 18, time: '9:00 AM', mealType: 'Breakfast' },
      { id: '6', name: 'Beef Burrito Bowl', emoji: '🌯', calories: 620, protein: 35, carbs: 68, fat: 20, time: '1:00 PM', mealType: 'Lunch' },
      { id: '7', name: 'Protein Shake', emoji: '🥤', calories: 180, protein: 30, carbs: 8, fat: 3, time: '4:00 PM', mealType: 'Snack' },
      { id: '8', name: 'Pasta Bolognese', emoji: '🍝', calories: 500, protein: 28, carbs: 62, fat: 16, time: '7:30 PM', mealType: 'Dinner' },
    ]
  },
  {
    date: 'Mar 11',
    totalCalories: 1550,
    meals: [
      { id: '9', name: 'Avocado Toast', emoji: '🥑', calories: 340, protein: 10, carbs: 32, fat: 20, time: '8:30 AM', mealType: 'Breakfast' },
      { id: '10', name: 'Tuna Wrap', emoji: '🫔', calories: 420, protein: 34, carbs: 38, fat: 12, time: '12:00 PM', mealType: 'Lunch' },
      { id: '11', name: 'Mixed Nuts', emoji: '🥜', calories: 190, protein: 6, carbs: 8, fat: 16, time: '3:30 PM', mealType: 'Snack' },
      { id: '12', name: 'Grilled Steak & Veggies', emoji: '🥩', calories: 600, protein: 52, carbs: 20, fat: 28, time: '7:00 PM', mealType: 'Dinner' },
    ]
  }
];

const GOAL = 2000;

export default function DiaryScreen() {
  const [expanded, setExpanded] = useState<string>('Today');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.title}>Food Diary</Text>
        <Text style={styles.subtitle}>Track your daily nutrition</Text>
      </View>

      {DIARY_DATA.map(day => {
        const pct = Math.min((day.totalCalories / GOAL) * 100, 100);
        const isOpen = expanded === day.date;
        return (
          <View key={day.date} style={styles.dayBlock}>
            <TouchableOpacity style={styles.dayHeader} onPress={() => setExpanded(isOpen ? '' : day.date)}>
              <View>
                <Text style={styles.dayDate}>{day.date}</Text>
                <Text style={styles.dayTotal}>{day.totalCalories} / {GOAL} kcal</Text>
              </View>
              <View style={styles.dayRight}>
                <View style={styles.miniBar}>
                  <View style={[styles.miniBarFill, {
                    width: (pct + '%') as any,
                    backgroundColor: pct > 95 ? '#E05252' : '#FF6A2F'
                  }]} />
                </View>
                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.mealsList}>
                {day.meals.map(meal => (
                  <View key={meal.id} style={styles.mealCard}>
                    <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                    <View style={styles.mealInfo}>
                      <View style={styles.mealTop}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealCal}>{meal.calories} kcal</Text>
                      </View>
                      <View style={styles.mealBottom}>
                        <Text style={styles.mealTime}>{meal.time} · {meal.mealType}</Text>
                        <View style={styles.macros}>
                          <Text style={[styles.macro, { color: '#E05252' }]}>P {meal.protein}g</Text>
                          <Text style={[styles.macro, { color: '#2EC4C4' }]}>C {meal.carbs}g</Text>
                          <Text style={[styles.macro, { color: '#F0A030' }]}>F {meal.fat}g</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Log Food Manually</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090F' },
  content: { paddingBottom: 120 },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  dayBlock: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#13131F', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  dayDate: { fontSize: 16, fontWeight: '800', color: '#fff' },
  dayTotal: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  dayRight: { alignItems: 'flex-end', gap: 8 },
  miniBar: { width: 80, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 2 },
  chevron: { fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: '700' },
  mealsList: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 12, paddingBottom: 8 },
  mealCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  mealEmoji: { fontSize: 32, width: 44, textAlign: 'center' },
  mealInfo: { flex: 1 },
  mealTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealName: { fontSize: 14, fontWeight: '700', color: '#fff', flex: 1 },
  mealCal: { fontSize: 14, fontWeight: '800', color: '#FF6A2F' },
  mealBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  mealTime: { fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '600' },
  macros: { flexDirection: 'row', gap: 8 },
  macro: { fontSize: 11, fontWeight: '700' },
  addBtn: { marginHorizontal: 16, marginTop: 8, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', padding: 18, alignItems: 'center' },
  addBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '700' },
});
