import React from 'react'
import { StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ContactsTab } from '../components/ContactsTab'
import { RecentTab } from '../components/RecentTab'
import { FavoriteTab } from '../components/FavoriteTab'

const Tab = createMaterialTopTabNavigator()

export default function ContactsScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.tabIndicator,
          }}
        >
          <Tab.Screen name="RECENT" component={RecentTab} />
          <Tab.Screen name="CONTACTS" component={ContactsTab} />
          <Tab.Screen name="FAVORITE" component={FavoriteTab} />
        </Tab.Navigator>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  tabIndicator: {
    backgroundColor: '#007AFF',
  },
})

