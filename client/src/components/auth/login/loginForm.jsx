import {useState} from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../../../firebase/auth'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')
    const [error, setError] = useState(false)
    const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        const userCredential = await doSignInWithEmailAndPassword(email, password);
        console.log('Logged in user:', userCredential.user);
        navigate('/sknext');
    } catch (err) {
        console.error(err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
        <div className='authform'>
            <h1>เข้าสู่ระบบ</h1>
            <form action="" className="authform-email" onSubmit={handleLogin}>
                <div className="text-input">
                    <label htmlFor="">อีเมล</label>
                    <input type="text" placeholder='กรุณาใส่อีเมล'value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="text-input">
                    <label htmlFor="">รหัสผ่าน</label>
                    <input type="password" placeholder='กรุณาใส่รหัสผ่าน' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button>
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>    
    </>
  )
}

export default LoginForm