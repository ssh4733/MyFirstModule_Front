import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    try {
    const decoded = jwtDecode(token);
    setUsername(decoded.sub || '알 수 없음');
    } catch (err) {
      console.error('JWT 디코딩 오류:', err);
      alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleStatsClick = () => {
    alert('추후 업데이트 예정입니다.');
  };

  const handleSettingsClick = () => {
    alert('추후 업데이트 예정입니다.');
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="logo">MyFirstModule</div>
        <div className="user-info">
          <span className="username">{username}님</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="main-content">
          <h2 className="main-title">DashBoard</h2>
          <p className="main-desc">추후 리팩토링 단계를 통해 업로드 예정</p>
          
          <div className="quick-actions">
            <div className="action-card">
              <h3>📄 게시글 관리</h3>
              <p>게시글 목록을 확인하고 관리할 수 있습니다.</p>
              <button className="action-btn primary" onClick={() => navigate('/posts')}>
                게시글 목록 보기
              </button>
            </div>

            <div className="action-card">
              <h3>✍️ 새 글 작성</h3>
              <p>새로운 게시글을 작성할 수 있습니다.</p>
              <button className="action-btn primary" onClick={() => navigate('/posts/new')}>
                새 글 작성하기
              </button>
            </div>

            <div className="action-card">
              <h3>📊 통계 관리</h3>
              <p>게시글 통계와 사용자 활동을 확인할 수 있습니다.</p>
              <button className="action-btn secondary" onClick={handleStatsClick}>
                통계 보기
              </button>
            </div>

            <div className="action-card">
              <h3>⚙️ 시스템 설정</h3>
              <p>게시판 설정과 권한 부여 및 관리를 할 수 있습니다.</p>
              <button className="action-btn secondary" onClick={handleSettingsClick}>
                설정 관리
              </button>
            </div>
          </div>

          <div className="recent-activity">
            <h3>최근 활동 (개발중)</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time"></span>
                <span className="activity-desc"></span>
              </div>
              <div className="activity-item">
                <span className="activity-time"></span>
                <span className="activity-desc"></span>
              </div>
              <div className="activity-item">
                <span className="activity-time"></span>
                <span className="activity-desc"></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        © 2025 MyFirstModule. All rights reserved.
      </footer>
    </div>
  );
}

export default Dashboard;