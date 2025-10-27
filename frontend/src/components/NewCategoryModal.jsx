import React from 'react';

function NewCategoryModal({ value, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>새 카테고리 추가</h3>
        <form className="modal__form" onSubmit={onSubmit}>
          <label className="modal__label" htmlFor="new-category-name">
            카테고리 이름
          </label>
          <input
            id="new-category-name"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="카테고리 이름을 입력하세요"
            autoFocus
            required
          />
          <div className="modal__actions">
            <button type="button" className="modal__button modal__button--secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal__button modal__button--primary">
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCategoryModal;
