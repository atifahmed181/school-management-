import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import NotificationContainer from '../components/ui/NotificationContainer';
import MainLayout from '../layouts/MainLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Pages that should NOT use the MainLayout (login, register, landing page)
  const noLayoutPages = ['/', '/login', '/register'];
  const useLayout = !noLayoutPages.includes(router.pathname);

  return (
    <AuthProvider>
      <NotificationProvider>
        {useLayout ? (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ) : (
          <Component {...pageProps} />
        )}
        <NotificationContainer />
      </NotificationProvider>
    </AuthProvider>
  );
} 