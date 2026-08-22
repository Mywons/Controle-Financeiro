import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabBar, TabKey } from './src/components/TabBar';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { RecurringScreen } from './src/screens/RecurringScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { colors } from './src/theme';

export default function App() {
  const [tab, setTab] = useState<TabKey>('dashboard');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.screen}>
          {tab === 'dashboard' && <DashboardScreen />}
          {tab === 'transactions' && <TransactionsScreen />}
          {tab === 'recurring' && <RecurringScreen />}
        </View>
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
