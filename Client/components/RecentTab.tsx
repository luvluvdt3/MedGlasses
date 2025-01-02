import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useCallStore } from '../store/callStore'
import { useUserStore } from '../store/userStore'
import { useRouter } from 'expo-router'

interface RecentContact {
  id: string
  name: string
  imageUrl: string
  time: string
  priority: number
  status: 'closed' | 'active' | 'closed-request'
  isMissed?: boolean
  phoneNumber?: string
  patientInfo: {
    infos: string[]
  }
}

const recentContacts: RecentContact[] = [
  {
    id: '1',
    name: 'Gregory Robin',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    time: '2 minutes ago',
    priority: 5,
    status: 'closed',
    patientInfo: {
      infos: [
        'Baptise Baudoin: 22 male, 85 kg',
        'Cardiac Fibrillation',
        'Internal Bleeding',
        'Dizziness'
      ]
    }
  },
  {
    id: '2',
    name: '+33 6 45 89 33 78',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    time: '5 minutes ago',
    priority: 2,
    status: 'active',
    isMissed: true,
    patientInfo: {
      infos: [
        'Jane Doe: 55 female',
        'Small burns'
      ]
    }
  },
  {
    id: '3',
    name: '+33 6 45 89 33 78',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    time: '25 minutes ago',
    priority: 5,
    status: 'closed-request',
    patientInfo: {
      infos: [
        'Elise Dumas: 42 female, 65kg',
        'Fifth-degree burns'
      ]
    }
  }
]

type TabType = 'recent' | 'priority' | 'missed'

const SegmentedControl = ({ activeTab, onTabChange }: { 
  activeTab: TabType
  onTabChange: (tab: TabType) => void 
}) => (
  <View style={styles.segmentedControl}>
    <TouchableOpacity 
      style={[styles.segment, activeTab === 'recent' && styles.segmentActive]}
      onPress={() => onTabChange('recent')}
    >
      <Text style={[styles.segmentText, activeTab === 'recent' && styles.segmentTextActive]}>
        Recent
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.segment, activeTab === 'priority' && styles.segmentActive]}
      onPress={() => onTabChange('priority')}
    >
      <Text style={[styles.segmentText, activeTab === 'priority' && styles.segmentTextActive]}>
        Highest Priority
      </Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.segment, activeTab === 'missed' && styles.segmentActive]}
      onPress={() => onTabChange('missed')}
    >
      <Text style={[styles.segmentText, activeTab === 'missed' && styles.segmentTextActive]}>
        Missed
      </Text>
    </TouchableOpacity>
  </View>
)

const ContactCard = ({ contact }) => {
  const router = useRouter()
  const startCall = useCallStore(state => state.startCall)

  const getStatusColor = () => {
    switch (contact.status) {
      case 'closed':
      case 'closed-request':
        return '#e8f5e9'
      case 'active':
        return '#fff9c4'
      default:
        return '#ffffff'
    }
  }

  const getStatusText = () => {
    switch (contact.status) {
      case 'closed':
        return 'Closed Case'
      case 'closed-request':
        return 'Closed Request'
      case 'active':
        return 'Case Still in Need'
      default:
        return ''
    }
  }

  const handleCall = () => {
    startCall(contact.id, contact.patientInfo)
    router.push('/ongoing_call')
  }

  return (
    <View style={[styles.card, { backgroundColor: getStatusColor() }]}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: contact.imageUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{contact.name}</Text>
            <View style={styles.timeContainer}>
              {contact.isMissed && <MaterialIcons name="phone-missed" size={16} color="red" />}
              <Text style={styles.time}>{contact.time}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>{contact.priority}</Text>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <MaterialIcons name="phone" size={24} color="#fff" />
            <Text style={styles.callButtonText}>RAPPELER</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.statusContainer, { backgroundColor: contact.status === 'active' ? '#ffeb3b' : '#4caf50' }]}>
        {contact.status === 'active' ? (
          <MaterialIcons name="warning" size={24} color="#000" />
        ) : (
          <MaterialIcons name="check-circle" size={24} color="#fff" />
        )}
        <Text style={[styles.statusText, { color: contact.status === 'active' ? '#000' : '#fff' }]}>
          {getStatusText()}
        </Text>
      </View>

      <View style={styles.patientInfo}>
        {contact.patientInfo.infos.map((info, index) => (
          <Text key={index} style={styles.condition}>{info}</Text>
        ))}
      </View>
    </View>
  )
}

export const RecentTab = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('recent')
  const recentContacts = useCallStore(state => state.recentContacts)

  const getFilteredContacts = () => {
    switch (activeTab) {
      case 'priority':
        return [...recentContacts].sort((a, b) => b.priority - a.priority)
      case 'missed':
        return recentContacts.filter(contact => contact.isMissed)
      default:
        return recentContacts
    }
  }

  return (
    <View style={styles.container}>
      <SegmentedControl activeTab={activeTab} onTabChange={setActiveTab} />
      <ScrollView style={styles.scrollView}>
        {getFilteredContacts().map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  segmentedControl: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    color: '#007AFF',
    fontSize: 16,
  },
  segmentTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    color: '#666',
    marginLeft: 4,
  },
  rightContent: {
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    backgroundColor: '#ff3d00',
    borderRadius: 4,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientInfo: {
    padding: 10,
  },
  condition: {
    fontSize: 16,
    marginBottom: 4,
  },
})

