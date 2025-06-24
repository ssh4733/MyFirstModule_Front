// src/components/SignupModal.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { MdCheckBox } from 'react-icons/md';

function SignupModal({ onClose }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('회원가입 성공!');
        onClose();
      } else {
        const err = await res.json();
        alert('회원가입 실패: ' + (err.message || '오류 발생'));
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert('회원가입 중 에러 발생');
    }
  };

  const userNameConfirm = async (e) => {
    try {
      const response = await fetch('/api/users/chkUserName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: form.username
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setDuplicateCheck({
          checked: true,
          isAvailable: !data.isDuplicate,
          message: data.message
        });
      } else {
        setDuplicateCheck({
          checked: true,
          isAvailable: false,
          message: data.error || '오류가 발생했습니다.'
        });
      }
    } catch (error) {
      console.error('중복확인 오류:', error);
      setDuplicateCheck({
        checked: true,
        isAvailable: false,
        message: '서버 연결에 실패했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const test = (e) => {};

  const [showPassword, setShowPassword] = useState(false); // 비밀번호 타입 토글 변경
  const isPasswordMatch = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm; // 비밀번호 확인 체크
  const [emailLocalPart, setEmailLocalPart] = useState('');
  const [emailDomain, setEmailDomain] = useState('@gmail.com');

  const modalContent = (
    <div className="modal-backdrop" >
      <div className="modal-content signup-modal" onClick={(e) => e.stopPropagation()}>
        <h3>회원가입</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="username" placeholder="아이디" value={form.username} onChange={handleChange} required className="login-input flex-7"/>
            <button type="button" onClick={userNameConfirm} className="flex-3">중복확인</button>
          </div>
          <div className="input-group">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required className="login-input flex-7"/>
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="flex-3">{showPassword ? <FaEyeSlash/> : <FaEye/>}</button>
          </div>
          <div className="input-group">
            <input type={showPassword ? 'text' : 'password'} name="passwordConfirm" placeholder="비밀번호 확인" value={form.passwordConfirm} onChange={handleChange} required className="login-input flex-7"/>
            <span className="flex-3" style={{ fontSize: '14px', color: isPasswordMatch ? 'green' : 'red' }}> {form.passwordConfirm.length > 0 && (isPasswordMatch ? 'O' : 'X')}</span>
          </div>
          <div>
            <div>
                <input type="text" name="emailLocal" placeholder="이메일" value={emailLocalPart} required className="login-input"
                    onChange={(e) => {
                        const local = e.target.value;
                        setEmailLocalPart(local);
                        setForm((prev) => ({
                        ...prev,
                        email: local + emailDomain
                        }));
                    }}
                />
                <span className="at-symbol"> @ </span>
                <select
                value={emailDomain} className="login-input"
                onChange={(e) => {
                    const domain = e.target.value;
                    setEmailDomain(domain);
                    setForm((prev) => ({
                    ...prev,
                    email: emailLocalPart + domain
                    }));
                }}
                >
                <option value="@gmail.com">gmail.com</option>
                <option value="@naver.com">naver.com</option>
                <option value="@daum.net">daum.net</option>
                </select>
            </div>
            </div>
            <div>
              캡챠
              {/* <ReCAPTCHA sitekey='' onChange={test}/> */}
            </div>
          <div>
            <button type="submit" className="modal-submit">가입하기</button>
            <button onClick={onClose} className="modal-close">닫기</button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}

export default SignupModal;
