import api from './api';
import { AuthData, LoginRequest, RegisterRequest, RegisterResponse, AuthDataFormatted } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Serviço de autenticação
 * 
 * Contém todas as funções relacionadas à autenticação do usuário
 */
export const authService = {
  /**
   * Realiza o login do usuário
   * 
   * @param credentials - Credenciais de login (email e senha)
   * @returns Dados de autenticação (token e informações do usuário)
   */
  async login(credentials: LoginRequest): Promise<AuthDataFormatted> {
    try {
      // A resposta da API vem diretamente, não dentro de um objeto data
      const response = await api.post<AuthData>('/user/auth', credentials);
      
      // A resposta já vem no formato { token, userDto }
      const { token, userDto } = response.data;
      
      if (!token) {
        throw new Error('Token não recebido do servidor');
      }
      
      // Formata os dados para o formato interno
      const formattedData: AuthDataFormatted = {
        token,
        user: {
          id: userDto.id,
          email: userDto.email,
          name: userDto.name,
        },
      };
      
      // Salva o token no AsyncStorage
      await AsyncStorage.setItem('@auth:token', token);
      await AsyncStorage.setItem('@auth:isAuthenticated', 'true');
      await AsyncStorage.setItem('@auth:user', JSON.stringify(formattedData.user));
      
      return formattedData;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Trata erros de forma mais específica
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Credenciais inválidas';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao fazer login. Tente novamente.');
      }
    }
  },

  /**
   * Registra um novo usuário
   * 
   * @param userData - Dados do novo usuário
   * @returns Dados do usuário registrado (id e email)
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/user', userData);
      
      // A resposta vem no formato { id, email }
      const { id, email } = response.data;
      
      if (!id || !email) {
        throw new Error('Dados do usuário não recebidos do servidor');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao registrar usuário';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao registrar usuário. Tente novamente.');
      }
    }
  },

  /**
   * Realiza o logout do usuário
   * 
   * Remove o token e dados do usuário do AsyncStorage
   */
  async logout(): Promise<void> {
    try {
      // Opcional: chamar endpoint de logout no backend
      // await api.post('/auth/logout');
      
      // Remove dados de autenticação do AsyncStorage
      await AsyncStorage.multiRemove([
        '@auth:token',
        '@auth:isAuthenticated',
        '@auth:user',
      ]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  /**
   * Verifica se o usuário está autenticado
   * 
   * @returns true se o usuário estiver autenticado, false caso contrário
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('@auth:token');
      const isAuth = await AsyncStorage.getItem('@auth:isAuthenticated');
      return !!(token && isAuth === 'true');
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  },

  /**
   * Obtém o token de autenticação atual
   * 
   * @returns Token de autenticação ou null
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@auth:token');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  /**
   * Obtém os dados do usuário atual
   * 
   * @returns Dados do usuário ou null
   */
  async getUser(): Promise<{ id: string; email: string; name?: string } | null> {
    try {
      const userJson = await AsyncStorage.getItem('@auth:user');
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },
};

