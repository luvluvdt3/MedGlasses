import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallStore } from '../store/callStore'
import { useUserStore } from '../store/userStore'

export default function IncomingCall() {
    const router = useRouter()
    const { currentCallerId, patientInfo, startCall, endCall } = useCallStore()
    const { getUserById } = useUserStore()

    const caller = getUserById(currentCallerId)

    const handleDecline = () => {
        endCall()
        router.back()
    }

    const handleAccept = () => {
        startCall(currentCallerId, patientInfo)
        router.push('/ongoing_call')
    }

    if (!caller || !patientInfo) {
        return null // or some loading state
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
                <Image
                    source={{ uri: caller.imageUrl }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{caller.name}</Text>
                <Text style={styles.title}>{caller.role}</Text>

                <View style={styles.numberContainer}>
                    <Text style={styles.number}>5</Text>
                </View>

                <View style={styles.patientCard}>
                    <View style={styles.conditionsList}>
                        {patientInfo.infos.map((info, index) => (
                            <Text key={index} style={styles.condition}>{info}</Text>
                        ))}
                    </View>
                </View>
                <View style={styles.actionButtons}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={handleDecline}
                        >
                            <MaterialIcons name="call-end" size={32} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.buttonLabel}>Decline</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={handleAccept}
                        >
                            <Ionicons name="call-outline" size={32} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.buttonLabel}>Accept</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff3b30',
        padding: 20,
        justifyContent: 'center',
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        color: '#666',
        marginBottom: 20,
    },
    numberContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    number: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    patientCard: {
        backgroundColor: '#f0f8ff',
        padding: 15,
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
    },
    patientHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    conditionsList: {
        gap: 8,
    },
    condition: {
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    declineButton: {
        backgroundColor: '#FF3B30',
    },
    acceptButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    buttonLabel: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
    },
})

