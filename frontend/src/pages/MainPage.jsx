import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createCategory,
  createLinkWithAi,
  deleteLink,
  fetchCategories,
  fetchLinks,
  updateLinkCategory,
  updateMemo
} from '../api/linkApi.js';
import LinkCard from '../components/LinkCard.jsx';
import NewCategoryModal from '../components/NewCategoryModal.jsx';

const DEFAULT_CATEGORY_COLOR = '#4C6EF5';

function MainPage() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadLinks = useCallback(async (categoryId = null) => {
    try {
      const data = await fetchLinks(categoryId);
      setLinks(data);
    } catch (err) {
      setError('An error occurred while loading links.');
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
      setError('An error occurred while loading categories.');
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
      setError('An error occurred while saving. Please try again.');
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
      setError('An error occurred while saving the memo.');
      console.error(err);
    }
  };

  const handleLinkCategoryChange = async (id, categoryId) => {
    try {
      const updated = await updateLinkCategory(id, categoryId);
      setLinks((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError('An error occurred while changing the link category.');
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }
    try {
      await deleteLink(id);
      setLinks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('An error occurred while deleting the link.');
      console.error(err);
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleOpenNewCategory = () => {
    setIsNewCategoryOpen(true);
  };

  const handleCloseNewCategory = () => {
    setIsNewCategoryOpen(false);
    setNewCategoryName('');
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      return;
    }
    setError(null);
    try {
      const created = await createCategory(newCategoryName.trim(), DEFAULT_CATEGORY_COLOR);
      setNewCategoryName('');
      setIsNewCategoryOpen(false);
      await loadCategories();
      setSelectedCategoryId(created.id);
      await loadLinks(created.id);
    } catch (err) {
      setError('An error occurred while adding the category.');
      console.error(err);
    }
  };

  return (
      <div className="app">
        <header className="app__header">
          <h1>Link Stash</h1>
          <p>Please insert your Link.</p>
        </header>
        <main>
          <section className="category-panel">
            <div className="category-panel__filter">
              <div className="category-panel__filter-header">
                <h2>Category Filter</h2>
                <Link className="category-manage-link" to="/categories">
                  Manage Categories
                </Link>
              </div>
              <div className="category-filter">
                <button
                    type="button"
                    className={!selectedCategoryId ? 'active' : ''}
                    onClick={() => handleSelectCategory(null)}
                >
                  View All
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
                <button
                    type="button"
                    className="category-add-button"
                    onClick={handleOpenNewCategory}
                    aria-label="Add new category"
                >
                  +
                </button>
              </div>
            </div>
          </section>
          <form className="save-form" onSubmit={handleSave}>
            <input
                type="url"
                placeholder="Enter a URL"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={saving}
                required
            />
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Link'}
            </button>
          </form>
          {error && <div className="app__error">{error}</div>}
          <section className="link-list">
            {links.length === 0 && <p className="empty-state">No links saved yet. Try adding a new URL.</p>}
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
        {isNewCategoryOpen && (
            <NewCategoryModal
                value={newCategoryName}
                onChange={setNewCategoryName}
                onClose={handleCloseNewCategory}
                onSubmit={handleCreateCategory}
            />
        )}
      </div>
  );
}

export default MainPage;