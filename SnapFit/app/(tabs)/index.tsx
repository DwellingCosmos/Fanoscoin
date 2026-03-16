import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = [
  { id: '1', name: 'Oatmeal with Berries', emoji: '🥣', calories: 320, protein: 12, carbs: 54, fat: 6, time: '8:00 AM', type: 'Breakfast' },
  { id: '2', name: 'Grilled Chicken Salad', emoji: '🥗', calories: 480, protein: 42, carbs: 18, fat: 22, time: '12:30 PM', type: 'Lunch' },
  { id: '3', name: 'Greek Yogurt', emoji: '🫙', calories: 150, protein: 15, carbs: 12, fat: 3, time: '3:00 PM', type: 'Snack' },
];

const GOAL = 2000;
const EATEN = 950;
const MACROS = [
  { label: 'Protein', current: 69, goal: 150, color: '#E05252' },
  { label: 'Carbs', current: 84, goal: 200, color: '#2EC4C4' },
  { label: 'Fat', current: 31, goal: 65, color: '#F0A030' },
];

export default function HomeScreen() {
  const [activeDay, setActiveDay] = useState('Thu');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.subtitle}>Let's track your nutrition</Text>
        </View>
        <View style={styles.streak}>
          <Text style={styles.streakText}>🔥 7</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll} contentContainerStyle={styles.days}>
        {DAYS.map(d => (
          <TouchableOpacity key={d} onPress={() => setActiveDay(d)} style={[styles.dayBtn, d === activeDay && styles.dayBtnActive]}>
            <Text style={[styles.dayText, d === activeDay && styles.dayTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.calorieCard}>
        <Text style={styles.cardTitle}>CALORIES</Text>
        <View style={styles.calorieRow}>
          <View style={styles.ring}>
            <Text style={styles.ringValue}>{EATEN}</Text>
            <Text style={styles.ringLabel}>eaten</Text>
          </View>
          <View style={styles.calorieStats}>
            <View style={styles.calStat}>
              <Text style={styles.calStatVal}>{GOAL}</Text>
              <Text style={styles.calStatLabel}>Goal</Text>
            </View>
            <View style={styles.calStat}>
              <Text style={[styles.calStatVal, { color: '#FF6A2F' }]}>{EATEN}</Text>
              <Text style={styles.calStatLabel}>Eaten</Text>
            </View>
            <View style={styles.calStat}>
              <Text style={[styles.calStatVal, { color: '#00D084' }]}>{GOAL - EATEN}</Text>
              <Text style={styles.calStatLabel}>Left</Text>
            </View>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: (Math.round((EATEN / GOAL) * 100) + '%') as any }]} />
        </View>
        <View style={styles.macros}>
          {MACROS.map(m => {
            const pct = Math.round((m.current / m.goal) * 100);
            return (
              <View key={m.label} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={[styles.macroLabel, { color: m.color }]}>{m.label}</Text>
                  <Text style={styles.macroValue}>{m.current}g</Text>
                </View>
                <View style={styles.macroTrack}>
                  <View style={[styles.macroFill, { width: (pct + '%') as any, backgroundColor: m.color }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today's Meals</Text>

      {MEALS.map(meal => (
        <View key={meal.id} style={styles.mealCard}>
          <Text style={styles.mealEmoji}>{meal.emoji}</Text>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealMeta}>{meal.time} · {meal.type}</Text>
            <View style={styles.mealMacros}>
              <Text style={[styles.pill, { color: '#E05252', backgroundColor: 'rgba(224,82,82,0.1)' }]}>P {meal.protein}g</Text>
              <Text style={[styles.pill, { color: '#2EC4C4', backgroundColor: 'rgba(46,196,196,0.1)' }]}>C {meal.carbs}g</Text>
              <Text style={[styles.pill, { color: '#F0A030', backgroundColor: 'rgba(240,160,48,0.1)' }]}>F {meal.fat}g</Text>
            </View>
          </View>
          <Text style={styles.mealCal}>{meal.calories}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add Food</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090F' },
  content: { paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  streak: { backgroundColor: 'rgba(255,106,47,0.15)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,106,47,0.3)' },
  streakText: { fontSize: 14, fontWeight: '800', color: '#FF6A2F' },
  daysScroll: { marginBottom: 16 },
  days: { paddingHorizontal: 16, gap: 8 },
  dayBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  dayBtnActive: { backgroundColor: 'rgba(255,106,47,0.15)', borderColor: 'rgba(255,106,47,0.4)' },
  dayText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  dayTextActive: { color: '#FF6A2F' },
  calorieCard: { marginHorizontal: 16, backgroundColor: '#13131F', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 24 },
  cardTitle: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 16 },
  calorieRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  ring: { width: 90, height: 90, borderRadius: 45, borderWidth: 6, borderColor: '#FF6A2F', alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
  ringLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  calorieStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  calStat: { alignItems: 'center' },
  calStatVal: { fontSize: 20, fontWeight: '900', color: '#fff' },
  calStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '600', marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: '#FF6A2F', borderRadius: 3 },
  macros: { gap: 10 },
  macroItem: { gap: 4 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { fontSize: 12, fontWeight: '700' },
  macroValue: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  macroTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#fff', paddingHorizontal: 16, marginBottom: 12 },
  mealCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: '#13131F', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 10 },
  mealEmoji: { fontSize: 32, marginRight: 12 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  mealMeta: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  mealMacros: { flexDirection: 'row', gap: 6, marginTop: 6 },
  pill: { fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  mealCal: { fontSize: 16, fontWeight: '900', color: '#FF6A2F' },
  addBtn: { marginHorizontal: 16, marginTop: 8, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', padding: 18, alignItems: 'center' },
  addBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '700' },
});
