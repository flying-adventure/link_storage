import React, { useCallback, useEffect, useState } from 'react';
import { createLinkWithAi, deleteLink, fetchLinks, updateMemo } from './api/linkApi.js';
import LinkCard from './components/LinkCard.jsx';

function App() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadLinks = useCallback(async () => {
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      setError('링크를 불러오는 중 문제가 발생했습니다.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!url.trim()) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await createLinkWithAi(url.trim());
      setLinks((prev) => [saved, ...prev]);
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

  return (
    <div className="app">
      <header className="app__header">
        <h1>스마트 링크 보관함</h1>
        <p>AI가 자동으로 제목과 카테고리를 추천해 드립니다.</p>
      </header>
      <main>
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
              onMemoChange={handleMemoChange}
              onDelete={handleDelete}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
