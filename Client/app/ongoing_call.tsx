import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'


export default function OngoingCall() {
  const router = useRouter()
  const [showInfo, setShowInfo] = useState(false)
  
  const patientInfo = {
    infos: [
      "Baptise Baudoin: 22 male, 85 kg",
      "Cardiac Fibrillation",
      "Internal Bleeding",
      "Dizziness"
  ]
  }

  const handleEndCall = () => {
    router.back()
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.infoIcon} onPress={toggleInfo}>
          <MaterialIcons name="info" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.callerName}>GREGORY</Text>
        <Text style={styles.timer}>15:04</Text>
      </View>

      <Image
        source={{ uri: '/placeholder.svg?height=800&width=400' }}
        style={styles.videoFeed}
      />

      {showInfo && (
        <View style={styles.infoPanel}>
          {patientInfo.infos.map((info, index) => (
            <Text key={index} style={styles.condition}>{info}</Text>
          ))}
        </View>
      )}

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

      {showInfo && (
        <TouchableOpacity 
          style={styles.expandButton} 
          onPress={toggleInfo}
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
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
    backgroundColor: 'white',
    color:'black'
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
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  timer: {
    color: 'black',
    marginLeft: 'auto',
  },
  videoFeed: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  condition: {
    fontSize: 16,
    marginBottom: 8,
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
  expandButton: {
    position: 'absolute',
    bottom: 90,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

