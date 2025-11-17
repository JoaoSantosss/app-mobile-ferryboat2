import Header from '@/components/header';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { router } from "expo-router";




export default function ProfilePage() {
    const { logout } = useAuth();
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await authService.getUser();
            console.log(user)
            if (user) {
                setUserEmail(user.email || '');
                // Se não houver nome, usa o email como fallback ou deixa vazio
                setUserName(user.name || user.email?.split('@')[0] || 'Usuário');
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Sair da Conta",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            // O redirecionamento será feito automaticamente pelo _layout.tsx
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
                        }
                    }
                }
            ]
        );
    };

    return(
        <View style={styles.container}>
            <Header title="Perfil" subtitle="Gerencie sua conta"></Header>

            <View style={styles.profileCard}>
                <MaterialIcons name="account-circle" size={50} color="#155DFC" />
                <View style={styles.accountInfoContainer}>
                    <Text style={styles.profileName}>{userName || 'Carregando...'}</Text>
                    <Text style={styles.profileEmail}>{userEmail || 'Carregando...'}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.historyCard}
                onPress={() => router.push("/myTripsPage")}>

                <FontAwesome6 name="clock-rotate-left" size={28} color="#155DFC" />

                <View style={styles.historyInfoContainer}>
                    <Text style={styles.historyTitle}>Histórico de Viagens</Text>
                    <Text style={styles.historySubtitle}>Ver todas as viagens</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="exit-to-app" size={24} color="#E7000B" />
                <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
      },
      
    profileCard: {
        width:"95%",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 12,
        marginVertical: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignSelf: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },

    accountInfoContainer: {
        paddingTop:20,
        paddingBottom:20,
        paddingHorizontal:20,
        flexDirection:"column",
    },

    profileName: {
        fontSize:24,
    },
    profileEmail: {
        paddingTop:10,
        color:"#6A7282"
    },

    historyCard: {
        width: "95%",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center", 
        alignSelf: "center",
    
        // sombra
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    
    historyInfoContainer: {
        marginLeft: 15,
    },
    
    historyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2A2A2A",
    },
    
    historySubtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#6A7282",
    },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: "#FFC9C9",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 20,
    },
    
    logoutText: {
        color: "#E7000B",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
})