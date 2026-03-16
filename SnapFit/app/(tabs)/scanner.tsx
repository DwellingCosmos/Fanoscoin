import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const API_KEY = 'YOUR_CLAUDE_API_KEY_HERE';

export default function ScannerScreen() {
  const [mealType, setMealType] = useState('Lunch');
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [portion, setPortion] = useState(1);
  const [reasoning, setReasoning] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access is required.'); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.85, base64: true });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);
      setResult(null);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Photo library access is required.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.85, base64: true });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setImageBase64(res.assets[0].base64 || null);
      setResult(null);
    }
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    try {
      const r1 = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: 'You are a registered dietitian. Identify every food in this image, estimate portion weights, and calculate precise nutrition using USDA values. Show your reasoning step by step.' }
          ]}]
        })
      });
      const d1 = await r1.json();
      const step1 = d1.content?.[0]?.text || '';
      setReasoning(step1);

      const r2 = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 900,
          system: 'Output ONLY valid JSON, no other text.',
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: 'Based on this analysis: ' + step1 + '\n\nReturn JSON: {"name":"","calories":0,"protein_g":0,"carbs_g":0,"fat_g":0,"fiber_g":0,"serving_description":"","confidence":"high","health_score":0,"grade":"A","diet_tags":[],"allergens":[],"nutritionist_insight":"","suggestions":"","ingredients_detected":[]}' }
          ]}]
        })
      });
      const d2 = await r2.json();
      const raw = d2.content?.[0]?.text || '{}';
      setResult(JSON.parse(raw.replace(/```json|```/g, '').trim()));
    } catch (e) {
      Alert.alert('Error', 'Could not analyze. Check your API key and internet connection.');
    }
    setLoading(false);
  };

  const macro = (val: number) => (val * portion).toFixed(0);
  const gradeColor = (g: string) => ({ A: '#00D084', B: '#4DA6FF', C: '#F4C430', D: '#FF6A2F' }[g] || '#888');
  const confColor = (c: string) => ({ high: '#00D084', medium: '#F4C430', low: '#E05252' }[c] || '#888');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Food Scanner</Text>
        <Text style={styles.subtitle}>Powered by Claude</Text>
      </View>

      <View style={styles.mealTypes}>
        {MEAL_TYPES.map(t => (
          <TouchableOpacity key={t} onPress={() => setMealType(t)} style={[styles.mealTypeBtn, t === mealType && styles.mealTypeBtnActive]}>
            <Text style={[styles.mealTypeText, t === mealType && styles.mealTypeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.foodImage} resizeMode="cover" />
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setImage(null); setResult(null); }}>
            <Text style={styles.clearBtnText}>X Clear</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadArea}>
          <Text style={styles.uploadIcon}>📷</Text>
          <Text style={styles.uploadTitle}>Scan Your Food</Text>
          <Text style={styles.uploadSub}>Take a photo or choose from library</Text>
          <View style={styles.uploadBtns}>
            <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
              <Text style={styles.uploadBtnText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnSecondary]} onPress={pickImage}>
              <Text style={styles.uploadBtnText}>Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {image && !result && (
        <TouchableOpacity style={[styles.analyzeBtn, loading && { opacity: 0.7 }]} onPress={analyze} disabled={loading}>
          {loading
            ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.analyzeBtnText}>Analyzing...</Text>
              </View>
            : <Text style={styles.analyzeBtnText}>Analyze Now</Text>
          }
        </TouchableOpacity>
      )}

      {result && (
        <View style={styles.result}>
          <View style={styles.resultHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{result.name}</Text>
              <Text style={styles.serving}>{result.serving_description}</Text>
            </View>
            <View style={[styles.grade, { backgroundColor: gradeColor(result.grade) + '20', borderColor: gradeColor(result.grade) + '50' }]}>
              <Text style={[styles.gradeText, { color: gradeColor(result.grade) }]}>{result.grade}</Text>
            </View>
          </View>

          <View style={[styles.confidence, { backgroundColor: confColor(result.confidence) + '10', borderColor: confColor(result.confidence) + '30' }]}>
            <Text style={[styles.confidenceText, { color: confColor(result.confidence) }]}>
              {result.confidence === 'high' ? 'HIGH' : 'MEDIUM'} CONFIDENCE
            </Text>
          </View>

          <View style={styles.calorieBox}>
            <Text style={styles.calNumber}>{macro(result.calories)}</Text>
            <Text style={styles.calLabel}>calories</Text>
          </View>

          <View style={styles.portionRow}>
            <Text style={styles.portionLabel}>Portion:</Text>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(p => (
              <TouchableOpacity key={p} onPress={() => setPortion(p)} style={[styles.portionBtn, portion === p && styles.portionBtnActive]}>
                <Text style={[styles.portionBtnText, portion === p && styles.portionBtnTextActive]}>{p}x</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.macroGrid}>
            {[
              { label: 'Protein', value: macro(result.protein_g), color: '#E05252' },
              { label: 'Carbs', value: macro(result.carbs_g), color: '#2EC4C4' },
              { label: 'Fat', value: macro(result.fat_g), color: '#F0A030' },
              { label: 'Fiber', value: macro(result.fiber_g), color: '#00D084' },
            ].map(m => (
              <View key={m.label} style={styles.macroBox}>
                <Text style={[styles.macroBoxValue, { color: m.color }]}>{m.value}g</Text>
                <Text style={styles.macroBoxLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.healthScore}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.healthLabel}>Health Score</Text>
              <Text style={styles.healthValue}>{result.health_score}/100</Text>
            </View>
            <View style={styles.healthTrack}>
              <View style={[styles.healthFill, {
                width: (result.health_score + '%') as any,
                backgroundColor: result.health_score > 70 ? '#00D084' : result.health_score > 40 ? '#F4C430' : '#E05252'
              }]} />
            </View>
          </View>

          {result.diet_tags?.length > 0 && (
            <View style={styles.tags}>
              {result.diet_tags.map((t: string) => (
                <View key={t} style={styles.tagGreen}><Text style={styles.tagGreenText}>{t}</Text></View>
              ))}
            </View>
          )}

          {result.allergens?.length > 0 && (
            <View style={styles.tags}>
              {result.allergens.map((a: string) => (
                <View key={a} style={styles.tagRed}><Text style={styles.tagRedText}>! {a}</Text></View>
              ))}
            </View>
          )}

          {result.nutritionist_insight ? (
            <View style={styles.insight}>
              <Text style={styles.insightText}>{result.nutritionist_insight}</Text>
            </View>
          ) : null}

          {result.suggestions ? (
            <View style={styles.suggestion}>
              <Text style={styles.suggestionText}>{result.suggestions}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.reasoningBtn} onPress={() => setShowReasoning(!showReasoning)}>
            <Text style={styles.reasoningBtnText}>{showReasoning ? 'Hide' : 'View'} AI Reasoning</Text>
          </TouchableOpacity>
          {showReasoning && (
            <View style={styles.reasoningBox}>
              <Text style={styles.reasoningText}>{reasoning}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addDiaryBtn}>
            <Text style={styles.addDiaryBtnText}>+ Add to {mealType}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090F' },
  content: { paddingBottom: 120 },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  mealTypes: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  mealTypeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  mealTypeBtnActive: { backgroundColor: 'rgba(255,106,47,0.15)', borderColor: 'rgba(255,106,47,0.4)' },
  mealTypeText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  mealTypeTextActive: { color: '#FF6A2F' },
  imageContainer: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden' },
  foodImage: { width: '100%', height: 240 },
  clearBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  clearBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  uploadArea: { marginHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', padding: 40, alignItems: 'center' },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6 },
  uploadSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },
  uploadBtns: { flexDirection: 'row', gap: 12 },
  uploadBtn: { backgroundColor: '#FF6A2F', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  uploadBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  uploadBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  analyzeBtn: { margin: 16, backgroundColor: '#FF6A2F', borderRadius: 16, padding: 18, alignItems: 'center' },
  analyzeBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  result: { marginHorizontal: 16, gap: 12 },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#13131F', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  foodName: { fontSize: 20, fontWeight: '900', color: '#fff' },
  serving: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 },
  grade: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  gradeText: { fontSize: 20, fontWeight: '900' },
  confidence: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignSelf: 'flex-start' },
  confidenceText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  calorieBox: { backgroundColor: 'rgba(255,106,47,0.1)', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,106,47,0.25)' },
  calNumber: { fontSize: 52, fontWeight: '900', color: '#FF6A2F' },
  calLabel: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  portionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  portionLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  portionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  portionBtnActive: { backgroundColor: 'rgba(255,106,47,0.2)', borderColor: 'rgba(255,106,47,0.5)' },
  portionBtnText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  portionBtnTextActive: { color: '#FF6A2F' },
  macroGrid: { flexDirection: 'row', gap: 10 },
  macroBox: { flex: 1, backgroundColor: '#13131F', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  macroBoxValue: { fontSize: 20, fontWeight: '900' },
  macroBoxLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: 2 },
  healthScore: { backgroundColor: '#13131F', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', gap: 8 },
  healthLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  healthValue: { fontSize: 13, fontWeight: '800', color: '#fff' },
  healthTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' },
  healthFill: { height: '100%', borderRadius: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagGreen: { backgroundColor: 'rgba(0,208,132,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagGreenText: { fontSize: 12, fontWeight: '700', color: '#00D084' },
  tagRed: { backgroundColor: 'rgba(224,82,82,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tagRedText: { fontSize: 12, fontWeight: '700', color: '#E05252' },
  insight: { backgroundColor: 'rgba(0,208,132,0.06)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,208,132,0.2)' },
  insightText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  suggestion: { backgroundColor: 'rgba(244,196,48,0.06)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(244,196,48,0.2)' },
  suggestionText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  reasoningBtn: { padding: 12, alignItems: 'center' },
  reasoningBtnText: { color: '#FF6A2F', fontWeight: '700', fontSize: 13 },
  reasoningBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  reasoningText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 20 },
  addDiaryBtn: { backgroundColor: '#FF6A2F', borderRadius: 16, padding: 18, alignItems: 'center' },
  addDiaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
