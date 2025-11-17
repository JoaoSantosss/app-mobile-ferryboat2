import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Aguarda o carregamento do estado de autenticação

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Se não está autenticado e não está na tela de login, redireciona para login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Se está autenticado e está na tela de login, redireciona para as tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack>
      {/* Login vem primeiro */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* Páginas com abas aparecem só depois */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen 
        name="myTripsPage"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
  