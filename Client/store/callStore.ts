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

