import React, { useEffect, useState, ReactNode } from 'react';

// store
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

// component
import Loader from '../Loader/Loader';

interface AuthLoaderProps {
  children: ReactNode;
}

const AuthLoader: React.FC<AuthLoaderProps> = ({ children }) => {
  const { validateToken } = useAuthStore();
  const { openAlert } = useUIStore();

  const [pending, setPending] = useState<boolean>(true);

  useEffect(() => {
    validateAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAuth = async () => {
    setPending(true);
    const valid_token = await validateToken();
    if (!valid_token) {
      // Puedes activar la alerta si lo deseas
      openAlert("Sesión expirada", "error");
    }
    setPending(false);
  };

  if (pending) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLoader;
