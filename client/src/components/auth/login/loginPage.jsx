import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig';
import LoginForm from './loginForm';

function LoginPage() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/sknext', { replace: true });
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
        <div className="loginPage">
            <LoginForm/>
        </div>
    </>
  )
}

export default LoginPage