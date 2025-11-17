import api from './api';
import { CarType } from './types';

/**
 * Serviço de tipos de carro
 * 
 * Contém todas as funções relacionadas aos tipos de carro
 */
export const carTypeService = {
  /**
   * Busca todos os tipos de carro disponíveis
   * 
   * @returns Lista de tipos de carro
   */
  async getAllCarTypes(): Promise<CarType[]> {
    try {
      const response = await api.get<CarType[]>('/car-type');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar tipos de carro:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao buscar tipos de carro';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao buscar tipos de carro. Tente novamente.');
      }
    }
  },

  /**
   * Busca um tipo de carro por ID
   * 
   * @param id - ID do tipo de carro
   * @returns Tipo de carro
   */
  async getCarTypeById(id: string): Promise<CarType> {
    try {
      const response = await api.get<CarType>(`/car-type/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar tipo de carro:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao buscar tipo de carro';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao buscar tipo de carro. Tente novamente.');
      }
    }
  },
};

