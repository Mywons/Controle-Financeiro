import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, TabKey } from './src/components/TabBar';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { RecurringScreen } from './src/screens/RecurringScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { colors } from './src/theme';

export default function App() {
  const [tab, setTab] = useState<TabKey>('dashboard');
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(8);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 6 }),
    ]).start();
  }, [tab, fade, slide]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <Animated.View
          style={[styles.screen, { opacity: fade, transform: [{ translateY: slide }] }]}
        >
          {tab === 'dashboard' && <DashboardScreen />}
          {tab === 'transactions' && <TransactionsScreen />}
          {tab === 'recurring' && <RecurringScreen />}
        </Animated.View>
        <TabBar active={tab} onChange={setTab} />
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
  },
});
