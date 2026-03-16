import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const GOALS = ['Lose Fat', 'Build Muscle', 'Stay Fit', 'Endurance', 'Get Stronger', 'Flexibility'];
const MUSCLES = ['Full Body', 'Upper Body', 'Lower Body', 'Core', 'Chest & Back', 'Arms'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const FREQUENCIES = ['3', '4', '5', '6'];

const TIPS: any = {
  'Squats': '• Keep chest up and back straight\n• Push knees out in line with toes\n• Drive through heels to stand up\n• Go to parallel or below for full activation',
  'Push-ups': '• Keep body in a straight line head to heels\n• Elbows at 45 degrees from body\n• Lower until chest nearly touches floor\n• Squeeze chest at the top',
  'Dumbbell Rows': '• Keep back flat and parallel to floor\n• Pull elbow straight back, not flared out\n• Squeeze shoulder blade at top\n• Lower the weight slowly',
  'Plank Hold': '• Engage core and glutes throughout\n• Keep hips level, not too high or low\n• Look at the floor to keep neck neutral\n• Breathe steadily, do not hold breath',
  'Jump Rope': '• Stay on the balls of your feet\n• Keep jumps small, just clear the rope\n• Elbows close to sides, wrists do the work\n• Land softly to protect your knees',
  'Brisk Walk': '• Swing arms naturally at your sides\n• Land heel first, roll through to toe\n• Keep pace where you feel effort\n• Maintain upright posture throughout',
  'Jogging Intervals': '• Land midfoot, not heel striking\n• Keep shoulders relaxed and low\n• Arms swing forward and back, not across\n• Breathe rhythmically, in 2 out 2',
  'Cycling': '• Adjust seat so leg is nearly straight at bottom\n• Keep cadence around 80 to 90 RPM\n• Engage core to stabilize the pelvis\n• Pull up on pedals as well as pushing',
  'Cool Down Stretch': '• Hold each stretch for 30 seconds minimum\n• Breathe deeply into each stretch\n• Never bounce or force the stretch\n• Focus on the muscles you just worked',
  'Dumbbell Press': '• Keep wrists straight, elbows at 90 degrees\n• Press up and slightly inward\n• Lower slowly for 2 to 3 seconds\n• Keep feet flat on the floor',
  'Lat Pulldown': '• Lean back slightly, pull bar to upper chest\n• Drive elbows down and back\n• Squeeze lats at the bottom\n• Control the weight on the way up',
  'Shoulder Press': '• Press directly overhead, not forward\n• Keep core tight to protect lower back\n• Lower to chin level between reps\n• Do not lock out elbows at top',
  'Tricep Dips': '• Keep elbows pointing straight back\n• Lower until upper arms are parallel to floor\n• Press through palms to rise\n• Keep shoulders down away from ears',
  'Lunges': '• Step far enough so front knee stays over ankle\n• Lower back knee toward floor\n• Keep torso upright throughout\n• Push through front heel to return',
  'Leg Press': '• Place feet shoulder width apart on platform\n• Lower until knees reach 90 degrees\n• Do not lock out knees at top\n• Keep lower back pressed into pad',
  'Calf Raises': '• Rise up as high as possible on toes\n• Pause briefly at the top\n• Lower slowly for a full stretch\n• Keep knees straight but not locked',
  'Glute Bridge': '• Drive hips up by squeezing glutes hard\n• Hold at the top for 1 to 2 seconds\n• Keep feet flat and close to body\n• Do not hyperextend lower back',
  'Bench Press': '• Grip slightly wider than shoulder width\n• Lower bar to lower chest with control\n• Plant feet firmly on the floor\n• Drive bar up and slightly back',
  'Deadlift': '• Hinge at hips, keep back flat always\n• Bar stays close to body throughout\n• Drive hips forward to stand up\n• Squeeze glutes at the top',
  'Pull-ups': '• Start from a full dead hang\n• Pull elbows down toward hips\n• Chin clears the bar at top\n• Lower slowly for maximum benefit',
  'Barbell Rows': '• Hinge forward to about 45 degrees\n• Pull bar to lower ribcage area\n• Keep elbows close to sides\n• Squeeze shoulder blades together',
  'Dumbbell Curls': '• Keep elbows pinned at your sides\n• Rotate wrist as you curl up\n• Squeeze bicep hard at the top\n• Lower fully for complete range of motion',
  'Overhead Press': '• Press bar directly overhead, not forward\n• Move head back slightly to clear bar path\n• Lock out arms fully at the top\n• Keep core braced throughout',
  'Lateral Raises': '• Slight bend in elbows throughout\n• Raise to shoulder height only\n• Lead with elbows, not wrists\n• Lower slowly, do not swing weight',
  'Face Pulls': '• Pull to face level, not neck or chest\n• Flare elbows out and back\n• Externally rotate at the top\n• Use light weight and high reps',
  'Back Squat': '• Bar rests on upper traps, not neck\n• Take a deep breath before descending\n• Drive knees out throughout movement\n• Lead with hips on the way up',
  'Front Squat': '• Keep elbows high to hold bar position\n• Stay very upright throughout\n• Knees track over toes aggressively\n• Core must stay very tight',
  'Romanian Deadlift': '• Hinge at hips keeping back flat\n• Feel the stretch in hamstrings\n• Bar stays close to legs throughout\n• Stop when back starts to round',
  'Dips': '• Lean forward slightly for chest focus\n• Lower until shoulders below elbows\n• Press through palms to rise\n• Keep shoulders down throughout',
  'Warm Up Walk': '• Start at a comfortable easy pace\n• Gradually increase speed over 5 minutes\n• Swing arms to increase heart rate\n• Focus on breathing deeply',
  'Easy Jog': '• Pace should feel very comfortable\n• You should be able to hold conversation\n• Keep cadence around 160 to 170 steps per minute\n• Focus on relaxed form',
  'Sprint Intervals': '• Accelerate gradually at start of sprint\n• Drive knees high and pump arms hard\n• Stay on balls of feet throughout\n• Recover fully before next sprint',
  'Cat-Cow': '• Start on hands and knees, wrists under shoulders\n• Inhale to arch back and lift head\n• Exhale to round spine and tuck chin\n• Move slowly with your breath',
  'Hip Flexor Stretch': '• Kneel on back knee, front foot forward\n• Push hips forward until you feel the stretch\n• Keep torso upright, do not lean forward\n• Hold for 30 to 45 seconds each side',
  'Hamstring Stretch': '• Sit with one leg extended, one bent\n• Hinge forward from hips, not waist\n• Reach toward foot keeping back flat\n• Hold at point of tension, not pain',
  'Sun Salutation': '• Flow through each pose with the breath\n• Take your time, no rush\n• Modify poses to your flexibility level\n• Focus on the connection of breath and movement',
  'Downward Dog': '• Press hands firmly into mat\n• Lift hips up and back strongly\n• Try to press heels toward floor\n• Keep neck relaxed, head between arms',
  'Pigeon Pose': '• Square hips toward the mat\n• Flex front foot to protect the knee\n• Walk hands forward to deepen stretch\n• Breathe into the hip for release',
  'Butterfly Stretch': '• Sit tall, bring soles of feet together\n• Hold feet and gently press knees down\n• Hinge forward from hips to deepen\n• Never force knees down with hands',
};

const DEFAULT_TIP = '• Focus on controlled movement throughout\n• Breathe out on the effort phase\n• Keep core engaged for stability\n• Quality of movement beats quantity';

const EXERCISE_ILLUSTRATIONS: any = {
  'Squats': '🏋️',
  'Push-ups': '💪',
  'Plank Hold': '🧘',
  'Jump Rope': '⚡',
  'Brisk Walk': '🚶',
  'Jogging Intervals': '🏃',
  'Cycling': '🚴',
  'Lunges': '🦵',
  'Dumbbell Press': '🏋️',
  'Lat Pulldown': '🔝',
  'Shoulder Press': '🙌',
  'Tricep Dips': '💺',
  'Bench Press': '🏋️',
  'Deadlift': '⚡',
  'Pull-ups': '🔝',
  'Barbell Rows': '🚣',
  'Dumbbell Curls': '💪',
  'Overhead Press': '🙌',
  'Lateral Raises': '↔️',
  'Face Pulls': '🎯',
  'Back Squat': '🏋️',
  'Dips': '📉',
  'Sprint Intervals': '⚡',
  'Cat-Cow': '🐱',
  'Downward Dog': '🐕',
  'Pigeon Pose': '🕊️',
  'Sun Salutation': '☀️',
  'Butterfly Stretch': '🦋',
};

const getEmoji = (name: string) => EXERCISE_ILLUSTRATIONS[name] || '🏃';

const PLANS: any = {
  'Lose Fat': { days: [
    { day: 'Day 1', focus: 'Full Body Circuit', exercises: ['Squats', 'Push-ups', 'Dumbbell Rows', 'Plank Hold', 'Jump Rope'] },
    { day: 'Day 2', focus: 'Cardio', exercises: ['Brisk Walk', 'Jogging Intervals', 'Cycling', 'Cool Down Stretch'] },
    { day: 'Day 3', focus: 'Upper Body', exercises: ['Dumbbell Press', 'Lat Pulldown', 'Shoulder Press', 'Tricep Dips'] },
    { day: 'Day 4', focus: 'Lower Body', exercises: ['Lunges', 'Leg Press', 'Calf Raises', 'Glute Bridge'] },
  ]},
  'Build Muscle': { days: [
    { day: 'Day 1', focus: 'Chest & Triceps', exercises: ['Bench Press', 'Dumbbell Press', 'Tricep Dips', 'Push-ups'] },
    { day: 'Day 2', focus: 'Back & Biceps', exercises: ['Deadlift', 'Pull-ups', 'Barbell Rows', 'Dumbbell Curls'] },
    { day: 'Day 3', focus: 'Legs', exercises: ['Squats', 'Leg Press', 'Romanian Deadlift', 'Calf Raises'] },
    { day: 'Day 4', focus: 'Shoulders', exercises: ['Overhead Press', 'Shoulder Press', 'Lateral Raises', 'Face Pulls'] },
  ]},
  'Stay Fit': { days: [
    { day: 'Day 1', focus: 'Full Body', exercises: ['Squats', 'Push-ups', 'Dumbbell Rows', 'Lunges', 'Plank Hold'] },
    { day: 'Day 2', focus: 'Cardio & Mobility', exercises: ['Jogging Intervals', 'Cycling', 'Cool Down Stretch'] },
    { day: 'Day 3', focus: 'Strength', exercises: ['Deadlift', 'Bench Press', 'Pull-ups', 'Shoulder Press'] },
  ]},
  'Endurance': { days: [
    { day: 'Day 1', focus: 'Long Run', exercises: ['Warm Up Walk', 'Easy Jog', 'Jogging Intervals', 'Cool Down Stretch'] },
    { day: 'Day 2', focus: 'Cross Training', exercises: ['Cycling', 'Plank Hold', 'Calf Raises', 'Cool Down Stretch'] },
    { day: 'Day 3', focus: 'Intervals', exercises: ['Sprint Intervals', 'Brisk Walk', 'Cool Down Stretch'] },
  ]},
  'Get Stronger': { days: [
    { day: 'Day 1', focus: 'Squat Focus', exercises: ['Back Squat', 'Squats', 'Leg Press', 'Romanian Deadlift'] },
    { day: 'Day 2', focus: 'Press Focus', exercises: ['Bench Press', 'Overhead Press', 'Dips', 'Shoulder Press'] },
    { day: 'Day 3', focus: 'Pull Focus', exercises: ['Deadlift', 'Barbell Rows', 'Pull-ups', 'Dumbbell Curls'] },
  ]},
  'Flexibility': { days: [
    { day: 'Day 1', focus: 'Full Body Stretch', exercises: ['Cat-Cow', 'Hip Flexor Stretch', 'Hamstring Stretch', 'Cool Down Stretch'] },
    { day: 'Day 2', focus: 'Yoga Flow', exercises: ['Sun Salutation', 'Downward Dog', 'Pigeon Pose', 'Butterfly Stretch'] },
    { day: 'Day 3', focus: 'Deep Stretch', exercises: ['Butterfly Stretch', 'Hamstring Stretch', 'Hip Flexor Stretch', 'Cool Down Stretch'] },
  ]},
};

function Chip({ label, active, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ExerciseCard({ exercise, userImage }: any) {
  const [expanded, setExpanded] = useState(false);
  const tips = TIPS[exercise] || DEFAULT_TIP;

  return (
    <View style={styles.exerciseCard}>
      <TouchableOpacity style={styles.exerciseHeader} onPress={() => setExpanded(!expanded)}>
        <View style={styles.exerciseLeft}>
          <View style={styles.exerciseIconBox}>
            <Text style={styles.exerciseEmoji}>{getEmoji(exercise)}</Text>
          </View>
          <View>
            <Text style={styles.exerciseName}>{exercise}</Text>
            <Text style={styles.exerciseTap}>Tap for form tips</Text>
          </View>
        </View>
        <Text style={styles.exerciseArrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.tipsContainer}>
          {userImage && (
            <View style={styles.illustrationBox}>
              <Image source={{ uri: userImage }} style={styles.userIllustration} />
              <View style={styles.illustrationOverlay}>
                <Text style={styles.illustrationEmoji}>{getEmoji(exercise)}</Text>
                <Text style={styles.illustrationLabel}>{exercise}</Text>
              </View>
            </View>
          )}
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>Form Guide</Text>
            {tips.split('\n').map((tip: string, i: number) => (
              <Text key={i} style={styles.tipLine}>{tip}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

export default function WorkoutScreen() {
  const [step, setStep] = useState<'photo' | 'form' | 'plan'>('photo');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [goal, setGoal] = useState('Lose Fat');
  const [muscle, setMuscle] = useState('Full Body');
  const [level, setLevel] = useState('Beginner');
  const [frequency, setFrequency] = useState('4');
  const [activeDay, setActiveDay] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Photo library access is required.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });
    if (!res.canceled) { setUserImage(res.assets[0].uri); setStep('form'); }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access is required.'); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: false });
    if (!res.canceled) { setUserImage(res.assets[0].uri); setStep('form'); }
  };

  const plan = PLANS[goal] || PLANS['Lose Fat'];
  const days = plan.days.slice(0, parseInt(frequency));
  const currentDay = days[activeDay] || days[0];

  if (step === 'photo') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Planner</Text>
          <Text style={styles.subtitle}>Personalized for your body</Text>
        </View>
        <View style={styles.photoPrompt}>
          <Text style={styles.photoIcon}>📸</Text>
          <Text style={styles.photoTitle}>Add Your Photo</Text>
          <Text style={styles.photoDesc}>Your photo appears alongside every exercise so you can visualize yourself doing each movement</Text>
          <TouchableOpacity style={styles.photoBtnMain} onPress={takePhoto}>
            <Text style={styles.photoBtnText}>📷  Take Photo Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoBtnSecondary} onPress={pickImage}>
            <Text style={styles.photoBtnSecText}>🖼️  Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('form')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (step === 'form') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Build Your Plan</Text>
          <Text style={styles.subtitle}>Customize your workout</Text>
        </View>
        {userImage && (
          <View style={styles.userPhotoRow}>
            <Image source={{ uri: userImage }} style={styles.userPhotoThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userPhotoName}>Your Profile Photo</Text>
              <Text style={styles.userPhotoSub}>Shows alongside each exercise</Text>
            </View>
            <TouchableOpacity onPress={() => setStep('photo')} style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.form}>
          <Text style={styles.label}>Your Goal</Text>
          <View style={styles.chips}>{GOALS.map(g => <Chip key={g} label={g} active={goal === g} onPress={() => setGoal(g)} />)}</View>
          <Text style={styles.label}>Focus Area</Text>
          <View style={styles.chips}>{MUSCLES.map(m => <Chip key={m} label={m} active={muscle === m} onPress={() => setMuscle(m)} />)}</View>
          <Text style={styles.label}>Experience Level</Text>
          <View style={styles.chips}>{LEVELS.map(l => <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />)}</View>
          <Text style={styles.label}>Days per Week</Text>
          <View style={styles.chips}>{FREQUENCIES.map(f => <Chip key={f} label={f + ' days'} active={frequency === f} onPress={() => setFrequency(f)} />)}</View>
          <TouchableOpacity style={styles.generateBtn} onPress={() => { setActiveDay(0); setStep('plan'); }}>
            <Text style={styles.generateBtnText}>Generate My Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.planHeader}>
        {userImage
          ? <Image source={{ uri: userImage }} style={styles.planUserPhoto} />
          : <View style={styles.planAvatarPlaceholder}><Text style={{ fontSize: 22 }}>👤</Text></View>
        }
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>{goal} Plan</Text>
          <Text style={styles.planSub}>{level} · {frequency} days/week</Text>
        </View>
        <TouchableOpacity onPress={() => setStep('form')} style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabs} contentContainerStyle={styles.dayTabsContent}>
        {days.map((d: any, i: number) => (
          <TouchableOpacity key={i} onPress={() => setActiveDay(i)} style={[styles.dayTab, activeDay === i && styles.dayTabActive]}>
            <Text style={[styles.dayTabText, activeDay === i && styles.dayTabTextActive]}>{d.day}</Text>
            <Text style={[styles.dayTabFocus, activeDay === i && styles.dayTabFocusActive]}>{d.focus}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.dayCard}>
        <Text style={styles.dayCardTitle}>{currentDay.focus}</Text>
        <Text style={styles.dayCardSub}>{currentDay.exercises.length} exercises · Tap each for form guide</Text>
      </View>

      {currentDay.exercises.map((ex: string, i: number) => (
        <ExerciseCard key={ex + i} exercise={ex} userImage={userImage} />
      ))}

      <TouchableOpacity style={styles.regenBtn} onPress={() => setStep('form')}>
        <Text style={styles.regenBtnText}>Change Plan</Text>
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
  photoPrompt: { marginHorizontal: 16, backgroundColor: '#13131F', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  photoIcon: { fontSize: 64, marginBottom: 16 },
  photoTitle: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 10 },
  photoDesc: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  photoBtnMain: { backgroundColor: '#FF6A2F', borderRadius: 16, padding: 16, alignItems: 'center', width: '100%', marginBottom: 12 },
  photoBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  photoBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginBottom: 20 },
  photoBtnSecText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  skipText: { color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: '600' },
  userPhotoRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: '#13131F', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 8, gap: 12 },
  userPhotoThumb: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FF6A2F' },
  userPhotoName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  userPhotoSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  changePhotoBtn: { backgroundColor: 'rgba(255,106,47,0.1)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,106,47,0.3)' },
  changePhotoText: { color: '#FF6A2F', fontWeight: '700', fontSize: 12 },
  form: { paddingHorizontal: 16, gap: 8 },
  label: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  chipActive: { backgroundColor: 'rgba(255,106,47,0.15)', borderColor: 'rgba(255,106,47,0.4)' },
  chipText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.45)' },
  chipTextActive: { color: '#FF6A2F' },
  generateBtn: { backgroundColor: '#FF6A2F', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 16 },
  generateBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  planHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, gap: 12 },
  planUserPhoto: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#FF6A2F' },
  planAvatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,106,47,0.15)', borderWidth: 2, borderColor: '#FF6A2F', alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  planSub: { fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 },
  editBtn: { backgroundColor: 'rgba(255,106,47,0.1)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,106,47,0.3)' },
  editBtnText: { color: '#FF6A2F', fontWeight: '700', fontSize: 13 },
  dayTabs: { marginBottom: 16 },
  dayTabsContent: { paddingHorizontal: 16, gap: 10 },
  dayTab: { backgroundColor: '#13131F', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', minWidth: 110 },
  dayTabActive: { backgroundColor: 'rgba(255,106,47,0.15)', borderColor: 'rgba(255,106,47,0.4)' },
  dayTabText: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.5)' },
  dayTabTextActive: { color: '#FF6A2F' },
  dayTabFocus: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  dayTabFocusActive: { color: 'rgba(255,106,47,0.7)' },
  dayCard: { marginHorizontal: 16, backgroundColor: 'rgba(255,106,47,0.08)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,106,47,0.2)', marginBottom: 16 },
  dayCardTitle: { fontSize: 18, fontWeight: '900', color: '#FF6A2F' },
  dayCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  exerciseCard: { marginHorizontal: 16, backgroundColor: '#13131F', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 10, overflow: 'hidden' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  exerciseLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exerciseIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,106,47,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,106,47,0.2)' },
  exerciseEmoji: { fontSize: 26 },
  exerciseName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  exerciseTap: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  exerciseArrow: { fontSize: 12, color: '#FF6A2F', fontWeight: '700' },
  tipsContainer: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  illustrationBox: { position: 'relative', height: 180, backgroundColor: 'rgba(0,0,0,0.3)' },
  userIllustration: { width: '100%', height: '100%', opacity: 0.6 },
  illustrationOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  illustrationEmoji: { fontSize: 28 },
  illustrationLabel: { fontSize: 14, fontWeight: '800', color: '#fff' },
  tipsBox: { padding: 16, gap: 6 },
  tipsTitle: { fontSize: 13, fontWeight: '800', color: '#FF6A2F', marginBottom: 6 },
  tipLine: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  regenBtn: { margin: 16, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,106,47,0.3)', alignItems: 'center', marginTop: 24, backgroundColor: 'rgba(255,106,47,0.08)' },
  regenBtnText: { color: '#FF6A2F', fontWeight: '700', fontSize: 14 },
});
