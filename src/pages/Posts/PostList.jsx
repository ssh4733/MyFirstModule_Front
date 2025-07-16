import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Dashboard/Dashboard.css';
import './PostList.css';
import PostFormModal from '../../components/PostFormModal';

function PostList() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.sub || '알 수 없음');
    } catch (err) {
      console.error('JWT 디코딩 오류:', err);
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
        setHasError(false);
      } catch (err) {
        console.error("불러오기 실패:", err);
        setHasError(true);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleCheckboxChange = (postId) => {
    setSelectedIds(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`${selectedIds.length}개 게시글을 삭제할까요?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedIds }
      });
      setPosts(prev => prev.filter(post => !selectedIds.includes(post.id)));
      setSelectedIds([]);
    } catch (err) {
      alert("삭제 실패!");
      console.error(err);
    }
  };

  const handleEdit = () => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length > 1) {
      alert("하나만 선택해야 수정할 수 있습니다.");
      return;
    }
    const selectedPost = posts.find(p => p.id === selectedIds[0]);
    if (!selectedPost) return;

    setEditTarget(selectedPost);
    setIsEditModalOpen(true);
  };

  const totalPages = Math.ceil(posts.length / pageSize);
  const pagedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="logo" onClick={() => navigate('/')}>MyFirstModule</div>
        <div className="user-info">
          <span className="username">{username}님</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2 className="main-title">PostList</h2>
        <p className="main-desc">게시글의 조회, 수정, 삭제가 가능한 페이지</p>

        <div className="recent-activity postlist-wrapper">
          <div className="section-toolbar">
            <h3 className="section-header">전체 게시글</h3>
            <div className="section-actions">
              <button
                className="table-btn edit"
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                className="table-btn delete"
                onClick={handleDelete}
                disabled={selectedIds.length === 0}
              >
                삭제
              </button>
            </div>
          </div>

          <table className="postlist-table">
            <thead>
              <tr>
                <th className="col-check">✅</th>
                <th className="col-no">No</th>
                <th className="col-title">제목</th>
                <th className="col-content">내용</th>
                <th className="col-writer">작성자</th>
                <th className="col-date">작성일</th>
                <th className="col-date">수정일</th>
              </tr>
            </thead>
            <tbody>
              {hasError ? (
                <tr><td colSpan="7" className="empty-row">❌ 게시글을 불러오는 데 실패했습니다.</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="7" className="empty-row">📭 게시글이 없습니다.</td></tr>
              ) : (
                pagedPosts.map((post, index) => (
                  <tr key={post.id}>
                    <td className="col-check">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post.id)}
                        onChange={() => handleCheckboxChange(post.id)}
                      />
                    </td>
                    <td className="col-no">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="col-title">{post.title}</td>
                    <td className="col-content">{post.content}</td>
                    <td className="col-writer">{post.createdBy || '알 수 없음'}</td>
                    <td className="col-date">{new Date(post.createdAt).toLocaleString()}</td>
                    <td className="col-date">{new Date(post.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        © 2025 MyFirstModule. All rights reserved.
      </footer>

      {isEditModalOpen && editTarget && (
        <PostFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTarget(null);
          }}
          initialData={editTarget}
          onSubmit={async ({ title, content }) => {
            try {
              const token = localStorage.getItem("token");
              await axios.put(`/api/posts/${editTarget.id}`, {
                title,
                content,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              });

              setPosts(prev =>
                prev.map(p =>
                  p.id === editTarget.id ? { ...p, title, content, updatedAt: new Date().toISOString() } : p
                )
              );

              alert("수정되었습니다.");
              setIsEditModalOpen(false);
              setEditTarget(null);
              setSelectedIds([]);
            } catch (error) {
              console.error("수정 실패:", error);
              alert("수정 실패");
            }
          }}
        />
      )}
    </div>
  );
}

export default PostList;
