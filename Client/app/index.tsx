import React from 'react'
import { StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ContactsTab } from '../components/ContactsTab'
import { RecentTab } from '../components/RecentTab'
import { FavoriteTab } from '../components/FavoriteTab'
import { useRouter } from 'expo-router'

const Tab = createMaterialTopTabNavigator()

export default function ContactsScreen() {
  const router = useRouter()

  const handleCreateContact = () => {
    console.log("not implemented");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
        }}
      >
        <Tab.Screen name="RECENT" component={RecentTab} />
        <Tab.Screen 
          name="CONTACTS" 
          component={() => <ContactsTab onCreateContact={handleCreateContact} />} 
        />
        <Tab.Screen name="FAVORITE" component={FavoriteTab} />
      </Tab.Navigator>
    </SafeAreaView>
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

