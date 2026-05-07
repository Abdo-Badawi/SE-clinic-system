import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { lang } = useAppStore();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return <AppRouter />;
}
