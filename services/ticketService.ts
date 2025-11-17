import api from './api';
import { BuyTicketRequest, TicketResponse } from './types';

/**
 * Serviço de tickets
 * 
 * Contém todas as funções relacionadas à compra de tickets
 */
export const ticketService = {
  /**
   * Compra um ticket para uma viagem
   * 
   * @param ticketData - Dados da compra (tripId e carTypeId opcional)
   * @returns Dados do ticket comprado
   */
  async buyTicket(ticketData: BuyTicketRequest): Promise<TicketResponse> {
    try {
      const response = await api.post<TicketResponse>('/tickets/buy', ticketData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao comprar ticket:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao comprar ticket';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao comprar ticket. Tente novamente.');
      }
    }
  },

  async getMyTickets(): Promise<TicketResponse[]> {
    try {
      const response = await api.get<TicketResponse[]>('/tickets');
      return response.data;
    } catch (error: any) {
      console.error('Erro buscar tickets:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro buscar tickets';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro ao buscar tickets. Tente novamente.');
      }
    }
  },
};

