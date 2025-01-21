import { create } from 'zustand'

interface PatientInfo {
  infos: string[]
}

interface RecentContact {
  id: string
  name: string
  imageUrl: string
  time: string
  priority: number
  status: 'closed' | 'active' | 'closed-request'
  isMissed?: boolean
  phoneNumber?: string
  patientInfo: PatientInfo
}

interface CallState {
  isOnCall: boolean
  currentCallerId: string | null
  callDuration: number
  patientInfo: PatientInfo | null
  recentContacts: RecentContact[]
  setIsOnCall: (isOnCall: boolean) => void
  setCurrentCallerId: (id: string | null) => void
  setCallDuration: (duration: number) => void
  setPatientInfo: (info: PatientInfo | null) => void
  startCall: (callerId: string, patientInfo: PatientInfo) => void
  endCall: () => void
  addRecentContact: (contact: RecentContact) => void
}

const defaultRecentContacts: RecentContact[] = [
  {
    id: '1',
    name: 'Gregory Robin',
    imageUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQHnJjXeNshAxw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1559240812811?e=2147483647&v=beta&t=uhZM3coNflb8x-xa9doxgNUXN1x7u-6eOdKWhtOieXg',
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
    imageUrl: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg',
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
    imageUrl: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg',
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

export const useCallStore = create<CallState>((set, get) => ({
  isOnCall: false,
  currentCallerId: null,
  callDuration: 0,
  patientInfo: null,
  recentContacts: defaultRecentContacts,
  setIsOnCall: (isOnCall) => set({ isOnCall }),
  setCurrentCallerId: (id) => set({ currentCallerId: id }),
  setCallDuration: (duration) => set({ callDuration: duration }),
  setPatientInfo: (info) => set({ patientInfo: info }),
  startCall: (callerId, patientInfo) => set({ 
    isOnCall: true, 
    currentCallerId: callerId, 
    callDuration: 0,
    patientInfo 
  }),
  endCall: () => set({ 
    isOnCall: false, 
    currentCallerId: null, 
    callDuration: 0,
    patientInfo: null 
  }),
  addRecentContact: (contact) => set(state => ({
    recentContacts: [contact, ...state.recentContacts]
  }))
}))

