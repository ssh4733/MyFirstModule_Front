import { useState } from 'react';
import SignupModal from '../components/SignupModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import './Login.css';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [modalType, setModalType] = useState(null); // null, 'signup', 'forgot'

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', { userName, password });
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

      {/* ✅ 모달 렌더링 */}
      {modalType === 'signup' && <SignupModal onClose={closeModal} />}
      {modalType === 'forgot' && <ForgotPasswordModal onClose={closeModal} />}
    </div>
  );
}

export default Login;
