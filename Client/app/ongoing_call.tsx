import React, {useState, useEffect, useRef, MutableRefObject} from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallStore } from '../store/callStore'
import { useUserStore } from '../store/userStore'
import { Audio } from 'expo-av';

const SOCKET_SERVER_URL = "ws://192.168.40.32:5000/ws"

export default function OngoingCall() {
  const router = useRouter()
  const [showInfo, setShowInfo] = useState(false)
  const [isPointing, setIsPointing] = useState(false)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const { currentCallerId, patientInfo, callDuration, endCall, setCallDuration } = useCallStore()
  const { getUserById } = useUserStore()
  const [imageUris, setImageUris] = useState<string[]>([]);
  let socket = useRef<WebSocket | null>(null);
// State pour gérer le son
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const caller = getUserById('1')

  function HandlerVideo(bytes: Uint8Array) {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64Data = btoa(binary);
    const base64Image = `data:image/jpeg;base64,${base64Data}`;

    setImageUris((prevUris) => {
      const newUris = [...prevUris, base64Image];
      // Limiter le nombre d'images à 10
      if (newUris.length > 10) {
        newUris.shift();  // Supprime la première (la plus ancienne) image
      }
      return newUris;
    });
  }


// Handler pour jouer l'audio MP3
  async function HandlerAudio(bytes: Uint8Array<ArrayBuffer>) {
    try {
      // Convertir les bytes en Base64
      const base64Audio = btoa(String.fromCharCode(...bytes));
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`; // Utilisation du format MP3

      // Si un son est déjà en cours de lecture, libérer l'ancien avant de charger un nouveau
      if (sound !== null) {
        await sound.stopAsync();  // Arrêter l'audio en cours
        await sound.unloadAsync();  // Libérer la mémoire
      }

      // Utiliser expo-av pour jouer l'audio
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);  // Stocker la nouvelle référence du son dans l'état
      await newSound.playAsync(); // Jouer le son

      // Gérer l'arrêt et la libération du son après la lecture
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        // Vérifier si le status est valide
        if (status && status.isLoaded && status.durationMillis && status.positionMillis) {
          // Vérifier si la position est égale à la durée (fin de lecture)
          if (status.positionMillis >= status.durationMillis) {
            await newSound.unloadAsync();  // Libérer après la fin
            setSound(null);  // Réinitialiser le state
          }
        }
      });

    } catch (error) {
      console.error("Erreur lors de la lecture de l'audio MP3:", error);
    }
  }




  useEffect(() => {
    socket.current = new WebSocket(SOCKET_SERVER_URL);

    socket.current.onopen = () => {
      socket.current?.send("Medecin");
      console.log("WebSocket connected");
    };

    socket.current.onmessage = async (event) => {
      if (typeof event.data === "string") {
        console.log("Text message received:", event.data);
      } else {
        const bytes = new Uint8Array(event.data);
        const header = bytes[0];
        const payload = bytes.slice(1);

        if (header === 0x01)
          HandlerVideo(payload);
        else
          await HandlerAudio(payload);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    const timer = setInterval(() => {
      setCallDuration(callDuration + 1)
    }, 1000)

    return () => clearInterval(timer);
  }, [200000]);  // Only re-run when `callDuration` changes


  const forceUpdate = React.useCallback(() => {}, []);
  const handleEndCall = () => {
    endCall()
    router.back()
    router.back()
  }

  const handleLayout = (event: any) => {
    const { width, height }= event.nativeEvent.layout;
    setImageDimensions({width: Math.floor(width), height: Math.floor(height) });
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const togglePointing = () => {
    if (isPointing) {
      setPoints([])
    }
    setIsPointing(!isPointing)
  }

  const handleImagePress = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!isPointing) return;

    const { locationX, locationY } = event.nativeEvent;
    setPoints([{ x: locationX, y: locationY }]);
    const { width, height } = imageDimensions;
    if (socket.current && socket.current?.readyState === WebSocket.OPEN)
      socket.current?.send(Math.floor(locationX / width * 100) + "," + Math.floor(locationY / height * 100));
  }

  if (!caller || !patientInfo) {
    return null
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.infoIcon} onPress={toggleInfo}>
            <MaterialIcons name="info" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.callerName}>{caller.name.toUpperCase()}</Text>
          <Text style={styles.timer}>{new Date(callDuration * 1000).toISOString().substr(14, 5)}</Text>
        </View>

        <TouchableOpacity activeOpacity={1} onPress={handleImagePress} style={styles.videoFeedContainer}>
          {imageUris.map((uri, index) => (
              <Image
                  key={index}  // La clé est unique pour chaque image
                  source={{ uri }}
                  style={[styles.videoFeed, { position: 'absolute', top: 0, left: 0 }]} // Positionner chaque image par-dessus l'autre
                  onLayout={handleLayout}
              />
          ))}
          {points.map((point, index) => (
              <MaterialIcons
                  key={index}
                  name="gps-fixed"
                  size={24}
                  color="#0FF"
                  style={{
                    position: 'absolute',
                    left: point.x - 12, // Centrer l'icône
                    top: point.y - 12,  // Centrer l'icône
                  }}
              />
          ))}
        </TouchableOpacity>

        {showInfo && (
            <View style={styles.infoPanel}>
              {patientInfo.infos.map((info, index) => (
                  <Text key={index} style={styles.condition}>{info}</Text>
              ))}
            </View>
        )}

        <View style={styles.controls}>
          <TouchableOpacity
              style={[styles.controlButton, isPointing && styles.activeControl]}
              onPress={togglePointing}
          >
            <MaterialIcons name="gps-fixed" size={24} color={isPointing ? "#fff" : "#000"} />
            <Text style={[styles.controlText, isPointing && styles.activeControlText]}>Point</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, styles.activeControlMute]}>
            <MaterialIcons name="mic" size={24} color="#ffff" />
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
    color:'black',
    height: 200,
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
  videoFeedContainer: {
    position: 'absolute',
    top: 120,
    width: '100%',
    height: '35%',
    marginTop: 80,
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
    height: 100,
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
    backgroundColor: '#0FF',
  },
  activeControlMute: {
    backgroundColor: '#000',
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
});