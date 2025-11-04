import React, { useEffect, useState } from 'react';

function LinkCard({ link, categories, onMemoChange, onCategoryChange, onDelete }) {
  const [memo, setMemo] = useState(link.memo ?? '');
  const [editingMemo, setEditingMemo] = useState(false);
  const [memoPending, setMemoPending] = useState(false);
  const [categoryPending, setCategoryPending] = useState(false);

  useEffect(() => {
    setMemo(link.memo ?? '');
  }, [link.memo]);

  const handleMemoBlur = async () => {
    if (!editingMemo) {
      return;
    }
    setMemoPending(true);
    try {
      await onMemoChange(link.id, memo);
    } finally {
      setMemoPending(false);
      setEditingMemo(false);
    }
  };

  const handleCategoryChange = async (event) => {
    const nextCategoryId = Number(event.target.value);
    if (Number.isNaN(nextCategoryId) || link.category?.id === nextCategoryId) {
      return;
    }
    setCategoryPending(true);
    try {
      await onCategoryChange(link.id, nextCategoryId);
    } catch (err) {
      event.target.value = link.category?.id ?? '';
    } finally {
      setCategoryPending(false);
    }
  };

  const currentCategory = link.category;

  return (
    <article className="link-card">
      {link.thumbnailUrl ? (
        <img src={link.thumbnailUrl} alt={`${link.title} thumbnail`} className="link-card__thumbnail" />
      ) : (
        <div className="link-card__thumbnail placeholder">No thumbnail</div>
      )}
      <div className="link-card__content">
        <div className="link-card__header">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-card__title">
            {link.title}
          </a>
          {currentCategory && (
            <span className="link-card__category" style={{ backgroundColor: currentCategory.color }}>
              {currentCategory.name}
            </span>
          )}
        </div>
        <div className="link-card__category-select">
          <label htmlFor={`category-${link.id}`}>Category</label>
          <select
            id={`category-${link.id}`}
            value={currentCategory ? currentCategory.id : ''}
            onChange={handleCategoryChange}
            disabled={categoryPending || categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value="" disabled>
                Add a category first
              </option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="link-card__memo">
          <label htmlFor={`memo-${link.id}`}>Memo</label>
          <textarea
            id={`memo-${link.id}`}
            value={memo}
            onChange={(event) => {
              setMemo(event.target.value);
              setEditingMemo(true);
            }}
            onBlur={handleMemoBlur}
            placeholder="Write a memo."
            disabled={memoPending}
            rows={3}
          />
        </div>
        <div className="link-card__actions">
          <button type="button" className="delete" onClick={() => onDelete(link.id)} disabled={memoPending || categoryPending}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default LinkCard;
