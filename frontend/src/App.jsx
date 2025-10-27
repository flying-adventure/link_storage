import React, { useCallback, useEffect, useState } from 'react';
import {
  createCategory,
  createLinkWithAi,
  deleteCategory,
  deleteLink,
  fetchCategories,
  fetchLinks,
  updateCategory,
  updateLinkCategory,
  updateMemo
} from './api/linkApi.js';
import LinkCard from './components/LinkCard.jsx';

const DEFAULT_CATEGORY_COLOR = '#4C6EF5';

function App() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: DEFAULT_CATEGORY_COLOR });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState({ name: '', color: DEFAULT_CATEGORY_COLOR });

  const loadLinks = useCallback(async (categoryId = null) => {
    try {
      const data = await fetchLinks(categoryId);
      setLinks(data);
    } catch (err) {
      setError('링크를 불러오는 중 문제가 발생했습니다.');
      console.error(err);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      setSelectedCategoryId((current) => {
        if (current && !data.some((category) => category.id === current)) {
          return null;
        }
        return current;
      });
    } catch (err) {
      setError('카테고리를 불러오는 중 문제가 발생했습니다.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadLinks(selectedCategoryId);
  }, [loadLinks, selectedCategoryId]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!url.trim()) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createLinkWithAi(url.trim());
      await loadLinks(selectedCategoryId);
      setUrl('');
    } catch (err) {
      setError('AI 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleMemoChange = async (id, memo) => {
    try {
      const updated = await updateMemo(id, memo);
      setLinks((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError('메모를 저장하는 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleLinkCategoryChange = async (id, categoryId) => {
    try {
      const updated = await updateLinkCategory(id, categoryId);
      setLinks((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError('링크 카테고리를 변경하는 중 오류가 발생했습니다.');
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    try {
      await deleteLink(id);
      setLinks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('링크를 삭제하는 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.name.trim()) {
      return;
    }
    setError(null);
    try {
      const created = await createCategory(newCategory.name.trim(), newCategory.color.trim());
      setNewCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
      await loadCategories();
      setSelectedCategoryId(created.id);
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
      await updateCategory(editingCategoryId, editingCategory.name.trim(), editingCategory.color.trim());
      setEditingCategoryId(null);
      setEditingCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
      await loadCategories();
      await loadLinks(selectedCategoryId);
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
      setEditingCategoryId((current) => {
        if (current === categoryId) {
          setEditingCategory({ name: '', color: DEFAULT_CATEGORY_COLOR });
          return null;
        }
        return current;
      });
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      } else {
        await loadLinks(selectedCategoryId);
      }
    } catch (err) {
      setError('카테고리를 삭제하는 중 오류가 발생했습니다. 연결된 링크가 있는지 확인해주세요.');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>스마트 링크 보관함</h1>
        <p>AI가 자동으로 제목과 카테고리를 추천해 드립니다.</p>
      </header>
      <main>
        <section className="category-panel">
          <div className="category-panel__filter">
            <h2>카테고리 필터</h2>
            <div className="category-filter">
              <button
                type="button"
                className={!selectedCategoryId ? 'active' : ''}
                onClick={() => handleSelectCategory(null)}
              >
                전체 보기
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={selectedCategoryId === category.id ? 'active' : ''}
                  style={{
                    borderColor: category.color,
                    color: selectedCategoryId === category.id ? '#fff' : category.color,
                    backgroundColor: selectedCategoryId === category.id ? category.color : 'transparent'
                  }}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="category-panel__manage">
            <h2>사용자 정의 카테고리 관리</h2>
            <form className="category-form" onSubmit={handleCreateCategory}>
              <input
                type="text"
                placeholder="새 카테고리 이름"
                value={newCategory.name}
                onChange={(event) => setNewCategory((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                type="color"
                value={newCategory.color}
                onChange={(event) => setNewCategory((prev) => ({ ...prev, color: event.target.value }))}
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
                        onChange={(event) => setEditingCategory((prev) => ({ ...prev, name: event.target.value }))}
                        required
                      />
                      <input
                        type="color"
                        value={editingCategory.color}
                        onChange={(event) => setEditingCategory((prev) => ({ ...prev, color: event.target.value }))}
                        required
                      />
                      <div className="category-edit__actions">
                        <button type="submit">저장</button>
                        <button type="button" onClick={cancelEditingCategory}>취소</button>
                      </div>
                    </form>
                  ) : (
                    <div className="category-display">
                      <span className="category-display__color" style={{ backgroundColor: category.color }} />
                      <span className="category-display__name">{category.name}</span>
                      <div className="category-display__actions">
                        <button type="button" onClick={() => startEditingCategory(category)}>수정</button>
                        <button type="button" onClick={() => handleDeleteCategory(category.id)}>삭제</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {categories.length === 0 && <li className="category-list__empty">카테고리를 추가해보세요.</li>}
            </ul>
          </div>
        </section>
        <form className="save-form" onSubmit={handleSave}>
          <input
            type="url"
            placeholder="URL을 입력하세요"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={saving}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? '저장 중...' : 'AI로 저장하기'}
          </button>
        </form>
        {error && <div className="app__error">{error}</div>}
        <section className="link-list">
          {links.length === 0 && <p className="empty-state">저장된 링크가 없습니다. URL을 추가해보세요.</p>}
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              categories={categories}
              onMemoChange={handleMemoChange}
              onCategoryChange={handleLinkCategoryChange}
              onDelete={handleDelete}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
