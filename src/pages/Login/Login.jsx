import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupModal from '../../components/SignupModal';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [modalType, setModalType] = useState(null); // null, 'signup', 'forgot'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: userName,
        password: password,
      });

      const token = response.data;
      console.log('로그인 성공! 받은 토큰:', token);

      // 필요 시 localStorage 저장
      localStorage.setItem('token', token);

      // 로그인 후 페이지 이동 등 추가 가능
      navigate('/dashboard');

    } catch (error) {
      console.error('로그인 실패:', error.response?.data || error.message);
      alert('로그인에 실패했습니다.');
    }
  };

  const closeModal = () => setModalType(null);

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="아이디"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">로그인</button>
      </form>

      <div className="login-bottom">
        <button onClick={() => setModalType('signup')} className="link-button">회원가입</button>
        <button onClick={() => setModalType('forgot')} className="link-button">비밀번호 찾기</button>
      </div>

      {modalType === 'signup' && <SignupModal onClose={closeModal} />}
      {modalType === 'forgot' && <ForgotPasswordModal onClose={closeModal} />}
    </div>
  );
}

export default Login;
