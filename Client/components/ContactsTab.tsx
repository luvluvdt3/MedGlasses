import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'

const ACTION_WIDTH = 150

interface Contact {
  id: string
  name: string
  imageUrl: string
}

interface ContactsTabProps {
  onCreateContact: () => void
}

const contacts: Contact[] = [
  { id: '1', name: 'Amy Adams', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '2', name: 'Jessica Avery', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '3', name: 'Christopher Bailey', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '4', name: 'Joseph Baker', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '5', name: 'James Bennett', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '6', name: 'Megan Berry', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
  { id: '7', name: 'Hannah Blair', imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4' },
]

const ContactItem = ({ contact }: { contact: Contact }) => {
  const translateX = useSharedValue(0)
  const prevTranslateX = useSharedValue(0)

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = prevTranslateX.value
    },
    onActive: (event, context) => {
      const newTranslateX = context.startX + event.translationX
      translateX.value = Math.min(0, Math.max(-ACTION_WIDTH, newTranslateX))
    },
    onEnd: () => {
      const shouldSnap = translateX.value < -ACTION_WIDTH / 2
      translateX.value = withSpring(shouldSnap ? -ACTION_WIDTH : 0, {
        damping: 20,
        stiffness: 200,
      })
      prevTranslateX.value = shouldSnap ? -ACTION_WIDTH : 0
    },
  })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View style={styles.contactItemContainer}>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFC107' }]}>
          <Ionicons name="star" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#9E9E9E' }]}>
          <Ionicons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.contactContent, rStyle]}>
          <Image source={{ uri: contact.imageUrl }} style={styles.contactImage} />
          <Text style={styles.contactName}>{contact.name}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export const ContactsTab = ({ onCreateContact }: ContactsTabProps) => {
  const [currentSection, setCurrentSection] = React.useState('A')
  const [isScrolling, setIsScrolling] = React.useState(false)
  const scrollTimeout = React.useRef<NodeJS.Timeout>()

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y
    const sectionHeight = 60
    const currentIndex = Math.floor(y / sectionHeight)
    const currentContact = contacts[currentIndex]
    if (currentContact) {
      setCurrentSection(currentContact.name[0])
    }

    setIsScrolling(true)
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#666" />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={onCreateContact}>
        <Ionicons name="person-add" size={24} color="#007AFF" />
        <Text style={styles.createButtonText}>Create new contact</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.contactsList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        {Object.entries(
          contacts.reduce((acc, contact) => {
            const firstLetter = contact.name[0]
            if (!acc[firstLetter]) {
              acc[firstLetter] = []
            }
            acc[firstLetter].push(contact)
            return acc
          }, {} as Record<string, Contact[]>)
        ).map(([letter, letterContacts]) => (
          <View key={letter}>
            <Text style={styles.sectionHeader}>{letter}</Text>
            {letterContacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </View>
        ))}
      </ScrollView>

      {isScrolling && currentSection && (
        <View style={styles.sectionIndicator}>
          <Text style={styles.sectionIndicatorText}>{currentSection}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    margin: 10,
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 10,
  },
  contactsList: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItemContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: ACTION_WIDTH / 3,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
  },
  sectionIndicator: {
    position: 'absolute',
    right: 10,
    top: '50%',
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionIndicatorText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
})

