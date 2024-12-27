import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function OngoingCall() {
  const router = useRouter()

  const handleEndCall = () => {
    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoIcon}>
          <MaterialIcons name="info" size={24} color="#fff" />
        </View>
        <Text style={styles.callerName}>GREGORY</Text>
        <Text style={styles.timer}>15:04</Text>
      </View>

      <Image
        source={{ uri: '/placeholder.svg?height=800&width=400' }}
        style={styles.videoFeed}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialIcons name="gps-fixed" size={24} color="#000" />
          <Text style={styles.controlText}>Point</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, styles.activeControl]}>
          <MaterialIcons name="videocam" size={24} color="#fff" />
          <Text style={[styles.controlText, styles.activeControlText]}>Video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, styles.activeControl]}>
          <MaterialIcons name="mic" size={24} color="#fff" />
          <Text style={[styles.controlText, styles.activeControlText]}>Mute</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.endButton]}
          onPress={handleEndCall}
        >
          <MaterialIcons name="call-end" size={24} color="#fff" />
          <Text style={[styles.controlText, styles.endButtonText]}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  timer: {
    color: '#fff',
    marginLeft: 'auto',
  },
  videoFeed: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  activeControl: {
    backgroundColor: '#34C759',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  controlText: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },
  activeControlText: {
    color: '#fff',
  },
  endButtonText: {
    color: '#fff',
  },
})
