import React, { useState } from 'react';

function LinkCard({ link, onMemoChange, onDelete }) {
  const [memo, setMemo] = useState(link.memo ?? '');
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);

  const handleBlur = async () => {
    if (!editing) {
      return;
    }
    setPending(true);
    try {
      await onMemoChange(link.id, memo);
    } finally {
      setPending(false);
      setEditing(false);
    }
  };

  return (
    <article className="link-card">
      {link.thumbnailUrl ? (
        <img src={link.thumbnailUrl} alt={`${link.title} thumbnail`} className="link-card__thumbnail" />
      ) : (
        <div className="link-card__thumbnail placeholder">썸네일 없음</div>
      )}
      <div className="link-card__content">
        <div className="link-card__header">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-card__title">
            {link.title}
          </a>
          <span className={`link-card__category link-card__category--${link.category.toLowerCase()}`}>
            {link.category}
          </span>
        </div>
        <div className="link-card__memo">
          <label htmlFor={`memo-${link.id}`}>메모</label>
          <textarea
            id={`memo-${link.id}`}
            value={memo}
            onChange={(event) => {
              setMemo(event.target.value);
              setEditing(true);
            }}
            onBlur={handleBlur}
            placeholder="메모를 입력해보세요."
            disabled={pending}
            rows={3}
          />
        </div>
        <div className="link-card__actions">
          <button type="button" className="delete" onClick={() => onDelete(link.id)} disabled={pending}>
            삭제
          </button>
        </div>
      </div>
    </article>
  );
}

export default LinkCard;
