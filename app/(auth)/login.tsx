import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido");
      return;
    }

    try {
      await login(email, password);
      // O redirecionamento será feito automaticamente pelo _layout.tsx
    } catch (error: any) {
      // Mostra a mensagem de erro específica retornada pela API
      const errorMessage = error.message || "Não foi possível fazer login. Tente novamente.";
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <MaterialIcons name="directions-ferry" size={48} color="#FFFFFF" />
        <Text style={styles.title}>Vai de Ferry</Text>
      </View>

      <View style={styles.content}>
        
        <Text style={{fontSize:24, alignSelf:"flex-start", marginHorizontal: 20,paddingTop:50, paddingBottom:10}}>Login</Text>
        <View style={styles.loginformCard}>
            <Text>E-mail</Text>
            <TextInput
            placeholder="seu@mail.com"
            style={styles.input}
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />

            <Text>Senha</Text>
            <TextInput
            placeholder="Digite sua senha"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkContainer} 
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.linkText}>Criar conta</Text>
            </TouchableOpacity>
        </View>

        <Image 
          source={require("../../assets/Logo-Porto-do-Itaqui.png")}
          style={styles.logo}
          contentFit="contain"
        />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height:"25%",
    backgroundColor: "#155DFC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
},


  loginformCard:{
    width:"90%",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // TUDO POR CIMA DO BACKGROUND
  content: {
    // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 24
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF", // fica na área azul
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },

  button: {
    backgroundColor: "#155DFC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },

  linkText: {
    color: "#155DFC",
    fontSize: 14,
    fontWeight: "600",
  },

  logo: {
    width: 200,
    height: 100,
    marginTop: 30,
  },
});
