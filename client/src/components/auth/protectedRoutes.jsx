import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../../firebase/firebaseConfig';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>; // you can style this later
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;