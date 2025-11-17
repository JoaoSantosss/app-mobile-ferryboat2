/**
 * Tipos TypeScript para as respostas da API
 */

// Tipo genérico para respostas de sucesso da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

// Tipo para respostas de erro da API
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Tipo para dados do usuário retornado pela API
export interface UserDto {
  id: string;
  email: string;
  name: string;
}

// Tipo para dados de autenticação (resposta do login)
export interface AuthData {
  token: string;
  userDto: UserDto;
}

// Tipo para dados de autenticação formatado (usado internamente)
export interface AuthDataFormatted {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    cpf?: string;
  };
}

// Tipo para requisição de login
export interface LoginRequest {
  email: string;
  password: string;
}

// Tipo para requisição de registro
export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

// Tipo para resposta do registro
export interface RegisterResponse {
  id: string;
  email: string;
}

// Tipo para viagem (Trip)
export interface Trip {
  id: string;
  from: string;
  to: string;
  tripDate: string;
  humanCapacity: number;
  vehicleCapacity: number;
  humanCapacityCount: number;
  vehicleCapacityCount: number;
  tripStatus: string;
  price: number;
}

// Tipo para tipo de carro (CarType)
export interface CarType {
  id: string;
  carType: string;
  space: number;
  cost: number;
}

// Tipo para requisição de compra de ticket
export interface BuyTicketRequest {
  tripId: string;
  carTypeId?: string; // Opcional, se não for fornecido, é apenas passagem de passageiro
}

// Tipo para resposta da compra de ticket
export interface TicketResponse {
  userId: string;
  tripId: string;
  tripFrom: string;
  tripTo: string;
  carType: string | null;
  status: string;
  tripDate: string;
  createdAt: string;
}


