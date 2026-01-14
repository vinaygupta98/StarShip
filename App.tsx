import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import TabNavigator from './src/navigation/TabNavigator';
import { COLORS } from './src/theme';
import BootSplash from 'react-native-bootsplash';
const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <CartProvider>
          <NavigationContainer
          onReady={()=>{
            BootSplash.hide({ fade: true });
          }}>
            <TabNavigator />
          </NavigationContainer>
        </CartProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background }
})
export default App