# Serviços da API

Esta pasta contém a configuração do Axios e os serviços de comunicação com a API backend.

## Estrutura

- **`config.ts`**: Configurações da API (URL base, timeout, etc.)
- **`api.ts`**: Instância configurada do Axios com interceptors
- **`types.ts`**: Tipos TypeScript para as respostas da API
- **`authService.ts`**: Serviço de autenticação (login, registro, logout)

## Como usar

### Importar a instância do Axios

```typescript
import api from '../services/api';

// Fazer uma requisição GET
const response = await api.get('/endpoint');

// Fazer uma requisição POST
const response = await api.post('/endpoint', { data });
```

### Usar um serviço existente

```typescript
import { authService } from '../services/authService';

// Login
await authService.login({ email: 'user@example.com', password: '123456' });

// Registro
await authService.register({ name: 'User', email: 'user@example.com', cpf: '12345678900', password: '123456' });

// Logout
await authService.logout();
```

## Criando um novo serviço

Siga o padrão do `authService.ts`:

```typescript
import api from './api';
import { ApiResponse } from './types';

export const meuService = {
  async buscarDados(): Promise<MeuTipo> {
    const response = await api.get<ApiResponse<MeuTipo>>('/meu-endpoint');
    return response.data.data;
  },

  async criarDados(data: MeuTipoRequest): Promise<MeuTipo> {
    const response = await api.post<ApiResponse<MeuTipo>>('/meu-endpoint', data);
    return response.data.data;
  },
};
```

## Configuração

Para alterar a URL base da API, edite o arquivo `config.ts`:

```typescript
export const API_BASE_URL = 'http://seu-ip:porta/api';
```

## Interceptors

A instância do Axios já vem configurada com:

- **Request Interceptor**: Adiciona automaticamente o token de autenticação em todas as requisições
- **Response Interceptor**: Trata erros de forma padronizada (401, 403, 404, 500, etc.)

## Tratamento de Erros

Os erros são tratados automaticamente pelos interceptors. Em caso de erro 401 (não autorizado), o token é removido automaticamente do AsyncStorage.

