import api from './api';
import { Trip } from './types';

/**
 * Serviço de viagens
 * 
 * Contém todas as funções relacionadas às viagens
 */
export const tripService = {
  /**
   * Busca viagens por data e terminal de partida
   * 
   * @param date - Data no formato YYYY-MM-DD
   * @param from - Terminal de partida (opcional)
   * @returns Lista de viagens disponíveis
   */
  async getTripsByDate(date: string, from?: string): Promise<Trip[]> {
    try {
      let response;
      
      if (from) {
        // Se terminal de partida foi selecionado, busca com filtro
        response = await api.get<Trip[]>('/trip/date/from', {
          params: {
            date,
            from,
          },
        });
      } else {
        // Se não, busca todas as viagens da data
        response = await api.get<Trip[]>('/trip/date', {
          params: {
            date,
          },
        });
      }
      
      const trips = response.data;
      
      // Filtra viagens que estão lotadas
      // Não mostra viagens onde humanCapacityCount === humanCapacity ou vehicleCapacityCount === vehicleCapacity
      const availableTrips = trips.filter((trip) => {
        const isHumanFull = trip.humanCapacityCount >= trip.humanCapacity;
        const isVehicleFull = trip.vehicleCapacityCount >= trip.vehicleCapacity;
        return !isHumanFull && !isVehicleFull;
      });
      
      return availableTrips;
    } catch (error: any) {
      console.error('Erro ao buscar viagens:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao buscar viagens';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao buscar viagens. Tente novamente.');
      }
    }
  },
};

