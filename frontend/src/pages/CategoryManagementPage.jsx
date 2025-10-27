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
      setError('카테고리를 불러오는 중 문제가 발생했습니다.');
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
      setError('카테고리를 생성하는 중 문제가 발생했습니다.');
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
      setError('카테고리를 수정하는 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('이 카테고리를 삭제하시겠습니까?')) {
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
      setError('카테고리를 삭제하는 중 오류가 발생했습니다. 연결된 링크가 있는지 확인해주세요.');
      console.error(err);
    }
  };

  return (
    <div className="app category-management">
      <header className="app__header category-management__header">
        <h1>카테고리 관리</h1>
        <p>카테고리를 추가하고 이름과 색상을 수정하거나 삭제할 수 있습니다.</p>
        <Link className="category-management__back-link" to="/">
          ← 메인으로 돌아가기
        </Link>
      </header>
      <main>
        {error && <div className="app__error">{error}</div>}
        <section className="category-panel category-management__panel">
          <h2>사용자 정의 카테고리 관리</h2>
          <form className="category-form" onSubmit={handleCreateCategory}>
            <input
              type="text"
              placeholder="새 카테고리 이름"
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
            <button type="submit">추가</button>
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
                      <button type="submit">저장</button>
                      <button type="button" onClick={cancelEditingCategory}>
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="category-display">
                    <span className="category-display__color" style={{ backgroundColor: category.color }} />
                    <span className="category-display__name">{category.name}</span>
                    <div className="category-display__actions">
                      <button type="button" onClick={() => startEditingCategory(category)}>
                        수정
                      </button>
                      <button type="button" onClick={() => handleDeleteCategory(category.id)}>
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="category-list__empty">카테고리를 추가해보세요.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default CategoryManagementPage;
