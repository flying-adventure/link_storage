import React from 'react';

function NewCategoryModal({ value, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h3>Add New Category</h3>
        <form className="modal__form" onSubmit={onSubmit}>
          <label className="modal__label" htmlFor="new-category-name">
            Category name
          </label>
          <input
            id="new-category-name"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter a category name"
            autoFocus
            required
          />
          <div className="modal__actions">
            <button type="button" className="modal__button modal__button--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__button modal__button--primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCategoryModal;
