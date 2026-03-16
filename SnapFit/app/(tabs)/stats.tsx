import { View, Text, StyleSheet, ScrollView } from 'react-native';

const WEEKLY = [
  { day: 'Mon', cal: 1820, goal: 2000 },
  { day: 'Tue', cal: 2150, goal: 2000 },
  { day: 'Wed', cal: 1650, goal: 2000 },
  { day: 'Thu', cal: 950, goal: 2000 },
  { day: 'Fri', cal: 0, goal: 2000 },
  { day: 'Sat', cal: 0, goal: 2000 },
  { day: 'Sun', cal: 0, goal: 2000 },
];

const STATS = [
  { icon: '⚖️', value: '78.4', unit: 'kg', label: 'Current Weight', color: '#FF6A2F' },
  { icon: '🏋️', value: '12', unit: 'sessions', label: 'Workouts', color: '#4DA6FF' },
  { icon: '🔥', value: '1740', unit: 'kcal/day', label: 'Avg Calories', color: '#F4C430' },
  { icon: '🥩', value: '128', unit: 'g/day', label: 'Avg Protein', color: '#E05252' },
  { icon: '📅', value: '18', unit: 'days', label: 'Active Days', color: '#00D084' },
  { icon: '💧', value: '2.1', unit: 'L/day', label: 'Avg Water', color: '#2EC4C4' },
];

const MAX_CAL = 2400;

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.title}>Progress & Stats</Text>
        <Text style={styles.subtitle}>March 2026</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>WEIGHT GOAL</Text>
        <View style={styles.weightRow}>
          <View style={styles.weightItem}>
            <Text style={styles.weightVal}>82</Text>
            <Text style={styles.weightLabel}>Start</Text>
          </View>
          <View style={styles.weightCurrent}>
            <Text style={styles.weightCurrentVal}>78.4</Text>
            <Text style={styles.weightNow}>Now</Text>
          </View>
          <View style={styles.weightItem}>
            <Text style={styles.weightVal}>73</Text>
            <Text style={styles.weightLabel}>Goal</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '42%' }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressPct}>42% complete</Text>
          <Text style={styles.progressLeft}>5.4 kg to go</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>WEEKLY CALORIES</Text>
        <View style={styles.chart}>
          {WEEKLY.map((d, i) => {
            const pct = d.cal > 0 ? d.cal / MAX_CAL : 0;
            const isToday = i === 3;
            const isOver = d.cal > d.goal;
            const barColor = isToday ? '#FF6A2F' : isOver ? '#E05252' : '#4DA6FF';
            return (
              <View key={d.day} style={styles.bar}>
                {d.cal > 0 && <Text style={styles.barCal}>{d.cal}</Text>}
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {
                    height: (Math.round(pct * 140) + 'px') as any,
                    backgroundColor: d.cal === 0 ? 'rgba(255,255,255,0.06)' : barColor,
                    height: d.cal === 0 ? 140 : Math.max(Math.round(pct * 140), 4),
                  }]} />
                </View>
                <Text style={[styles.barDay, isToday && { color: '#FF6A2F' }]}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionTitle}>This Month</Text>
      <View style={styles.statsGrid}>
        {STATS.map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statUnit}>{s.unit}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090F' },
  content: { paddingBottom: 120 },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  card: { margin: 16, marginTop: 0, backgroundColor: '#13131F', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 16 },
  cardTitle: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 16 },
  weightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  weightItem: { alignItems: 'center' },
  weightVal: { fontSize: 22, fontWeight: '900', color: '#fff' },
  weightLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '600', marginTop: 2 },
  weightCurrent: { alignItems: 'center', backgroundColor: 'rgba(255,106,47,0.1)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,106,47,0.25)' },
  weightCurrentVal: { fontSize: 20, fontWeight: '900', color: '#FF6A2F' },
  weightNow: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  progressTrack: { height: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00D084', borderRadius: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progressPct: { fontSize: 12, color: '#00D084', fontWeight: '700' },
  progressLeft: { fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '600' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  bar: { flex: 1, alignItems: 'center', gap: 4 },
  barCal: { fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },
  barTrack: { width: '70%', height: 140, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  barDay: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#fff', paddingHorizontal: 16, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, paddingBottom: 20 },
  statCard: { width: '30%', flex: 1, backgroundColor: '#13131F', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', alignItems: 'center', gap: 3 },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statUnit: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '600', textAlign: 'center' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '700', textAlign: 'center' },
});
