function PostFormModal({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">{initialData ? "게시글 수정" : "새 글 작성"}</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const content = e.target.content.value;
          onSubmit({ title, content });
        }} className="modal-form">
          <label>
            제목
            <input type="text" name="title" defaultValue={initialData?.title} required />
          </label>
          <label>
            내용
            <textarea name="content" defaultValue={initialData?.content} required />
          </label>
          <div className="form-buttons">
            <button type="submit" className="action-btn primary">
              {initialData ? "수정" : "등록"}
            </button>
            <button type="button" className="action-btn secondary" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostFormModal;