import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from '../api/linkApi.js';

const DEFAULT_CATEGORY_COLOR = '#4C6EF5';

function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: DEFAULT_CATEGORY_COLOR });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState({ name: '', color: DEFAULT_CATEGORY_COLOR });
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError('An error occurred while loading categories.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.name.trim()) {
      return;
    }
    setError(null);
    try {
      await createCategory(newCategory.name.trim(), newCategory.color.trim());
      setNewCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
      await loadCategories();
    } catch (err) {
      setError('An error occurred while creating the category.');
      console.error(err);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategory({ name: category.name, color: category.color });
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditingCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    if (!editingCategoryId) {
      return;
    }
    setError(null);
    try {
      await updateCategory(
          editingCategoryId,
          editingCategory.name.trim(),
          editingCategory.color.trim()
      );
      setEditingCategoryId(null);
      setEditingCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
      await loadCategories();
    } catch (err) {
      setError('An error occurred while updating the category.');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    setError(null);
    try {
      await deleteCategory(categoryId);
      await loadCategories();
      if (editingCategoryId === categoryId) {
        cancelEditingCategory();
      }
    } catch (err) {
      setError('An error occurred while deleting the category. Check if there are any associated links.');
      console.error(err);
    }
  };

  return (
      <div className="app category-management">
        <header className="app__header category-management__header">
          <h1>Manage Categories</h1>
          <p>Add, edit (name and color), or delete your categories here.</p>
          <Link className="category-management__back-link" to="/">
            ← Back to Main
          </Link>
        </header>
        <main>
          {error && <div className="app__error">{error}</div>}
          <section className="category-panel category-management__panel">
            <h2>Manage Categories</h2>
            <form className="category-form" onSubmit={handleCreateCategory}>
              <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory.name}
                  onChange={(event) => setNewCategory((prev) => ({ ...prev, name: event.target.value }))}
                  required
              />
              <input
                  type="color"
                  value={newCategory.color}
                  onChange={(event) => setNewCategory((prev) => ({ ...prev, color: event.target.value }))}
                  required
              />
              <button type="submit">Add</button>
            </form>
            <ul className="category-list">
              {categories.map((category) => (
                  <li key={category.id} className="category-list__item">
                    {editingCategoryId === category.id ? (
                        <form className="category-edit" onSubmit={handleUpdateCategory}>
                          <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(event) =>
                                  setEditingCategory((prev) => ({ ...prev, name: event.target.value }))
                              }
                              required
                          />
                          <input
                              type="color"
                              value={editingCategory.color}
                              onChange={(event) =>
                                  setEditingCategory((prev) => ({ ...prev, color: event.target.value }))
                              }
                              required
                          />
                          <div className="category-edit__actions">
                            <button type="submit">Save</button>
                            <button type="button" onClick={cancelEditingCategory}>
                              Cancel
                            </button>
                          </div>
                        </form>
                    ) : (
                        <div className="category-display">
                          <span className="category-display__color" style={{ backgroundColor: category.color }} />
                          <span className="category-display__name">{category.name}</span>
                          <div className="category-display__actions">
                            <button type="button" onClick={() => startEditingCategory(category)}>
                              Edit
                            </button>
                            <button type="button" onClick={() => handleDeleteCategory(category.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                    )}
                  </li>
              ))}
              {categories.length === 0 && (
                  <li className="category-list__empty">Try adding a new category.</li>
              )}
            </ul>
          </section>
        </main>
      </div>
  );
}

export default CategoryManagementPage;