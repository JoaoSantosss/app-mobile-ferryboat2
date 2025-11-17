
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { authService } from "../../services/authService";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("")
  const [name, setName] = useState("")
  const { login } = useAuth();
  const router = useRouter();

  // Função para formatar CPF (remove caracteres não numéricos)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers;
  };

  // Função para validar CPF básico
  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleRegister = async () => {
    // Validações
    if (!name || !email || !cpf || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido");
      return;
    }

    // Validação de CPF
    if (!validateCPF(cpf)) {
      Alert.alert("Erro", "Por favor, insira um CPF válido (11 dígitos)");
      return;
    }

    // Validação de senha
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      // Registra o usuário
      await authService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        cpf: formatCPF(cpf),
        password: password,
      });

      // Mostra mensagem de sucesso
      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso! Faça login para continuar.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      // Mostra a mensagem de erro específica retornada pela API
      const errorMessage = error.message || "Não foi possível realizar o cadastro. Tente novamente.";
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>

        <View style={styles.header}>
            <MaterialIcons name="directions-ferry" size={48} color="#FFFFFF" />
            <Text style={styles.title}>Vai de Ferry</Text>
        </View>

        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 50 }}
        >

            <View style={styles.content}>
                
                <Text style={{fontSize:24, alignSelf:"flex-start", marginHorizontal: 20,paddingTop:50, paddingBottom:10}}>Cadastro</Text>
                <View style={styles.loginformCard}>
                
                    <Text>Nome Completo</Text>
                    <TextInput
                    placeholder="Seu nome"
                    style={styles.input}
                    placeholderTextColor="#777"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    keyboardType="default"
                    />

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

                    <Text>CPF</Text>
                    <TextInput
                    placeholder="000.000.000-00"
                    style={styles.input}
                    placeholderTextColor="#777"
                    value={cpf}
                    onChangeText={(text) => setCpf(formatCPF(text))}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    maxLength={11}
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

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.linkContainer} 
                    onPress={() => router.push("/(auth)/login")}
                    >
                    <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <Image 
                source={require("../../assets/Logo-Porto-do-Itaqui.png")}
                style={styles.logo}
                contentFit="contain"
                />
                
            </View>
        
        </ScrollView>

      
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
