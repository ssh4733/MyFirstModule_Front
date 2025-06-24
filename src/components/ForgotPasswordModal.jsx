// src/components/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('비밀번호 재설정 요청:', email);
    // 여기서 백엔드 API 요청 등 추가 가능
  };

  const modalContent = (
    <div className="modal-backdrop" >
      <div className="modal-content forgotpassword-modal" onClick={(e) => e.stopPropagation()}>
        <h3>비밀번호 찾기</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="가입한 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="modal-submit">재설정 링크 전송</button>
        </form>
        <button onClick={onClose} className="modal-close">닫기</button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default ForgotPasswordModal;
