import { create } from 'zustand'

interface User {
  id: string
  name: string
  role: string
  imageUrl: string
  contacts: string[]
}

interface UserState {
  currentUser: User | null
  users: User[]
  setCurrentUser: (user: User | null) => void
  clearCurrentUser: () => void
  getUserById: (id: string) => User | undefined
}

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Gregory Robin',
    role: 'Infirmier',
    imageUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQHnJjXeNshAxw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1559240812811?e=2147483647&v=beta&t=uhZM3coNflb8x-xa9doxgNUXN1x7u-6eOdKWhtOieXg',
    contacts: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Baptiste Baudoin',
    role: 'Patient',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    contacts: ['1']
  },
  {
    id: '3',
    name: 'Jane Doe',
    role: 'Patient',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    contacts: ['1']
  },
  {
    id: '4',
    name: 'Elise Dumas',
    role: 'Patient',
    imageUrl: 'https://avatars.githubusercontent.com/u/77581509?v=4',
    contacts: ['1']
  }
]

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: defaultUsers[0], // Set Gregory Robin as the default current user
  users: defaultUsers,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
  getUserById: (id) => get().users.find(user => user.id === id)
}))

