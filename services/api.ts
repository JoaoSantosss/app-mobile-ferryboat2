import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Instância do Axios configurada para o projeto
 * 
 * Esta instância já vem com:
 * - URL base configurada
 * - Timeout padrão
 * - Interceptors para adicionar token de autenticação
 * - Tratamento de erros padronizado
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de Request
 * 
 * Adiciona o token de autenticação automaticamente em todas as requisições
 * quando o usuário estiver autenticado
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Busca o token de autenticação do AsyncStorage
      const token = await AsyncStorage.getItem('@auth:token');
      
      if (token && config.headers) {
        // Adiciona o token no header Authorization
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao buscar token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    // Trata erros na configuração da requisição
    console.error('Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * 
 * Trata respostas e erros de forma padronizada
 */
api.interceptors.response.use(
  (response) => {
    // Retorna a resposta diretamente se tudo estiver ok
    return response;
  },
  async (error: AxiosError) => {
    // Tratamento de erros padronizado
    if (error.response) {
      // O servidor respondeu com um status de erro
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Não autorizado - token inválido ou expirado
          console.error('Erro 401: Não autorizado');
          // Remove o token inválido
          await AsyncStorage.removeItem('@auth:token');
          await AsyncStorage.removeItem('@auth:isAuthenticated');
          // Aqui você pode redirecionar para a tela de login se necessário
          break;

        case 403:
          // Proibido - usuário não tem permissão
          console.error('Erro 403: Acesso proibido');
          break;

        case 404:
          // Recurso não encontrado
          console.error('Erro 404: Recurso não encontrado');
          break;

        case 500:
          // Erro interno do servidor
          console.error('Erro 500: Erro interno do servidor');
          break;

        default:
          console.error(`Erro ${status}:`, data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de rede: Sem resposta do servidor');
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

