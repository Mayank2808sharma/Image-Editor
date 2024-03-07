// withAuth.js
import { useRouter } from 'next/navigation';
import { useAuth } from './authContext';
import React, { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }, [isAuthenticated, router]);

    if (isChecking) {
      return null; // or a loading indicator
    }

    return <WrappedComponent {...props} />;
  };

  // Assigning display name
  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
