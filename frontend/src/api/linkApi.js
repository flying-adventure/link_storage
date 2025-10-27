const BASE_HEADERS = {
  'Content-Type': 'application/json'
};

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function fetchLinks(categoryId) {
  const query = typeof categoryId === 'number' ? `?categoryId=${categoryId}` : '';
  const response = await fetch(`/api/links${query}`);
  return handleResponse(response);
}

export async function createLinkWithAi(url) {
  const response = await fetch('/api/links/ai-save', {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify({ url })
  });
  return handleResponse(response);
}

export async function updateMemo(id, memo) {
  const response = await fetch(`/api/links/${id}/memo`, {
    method: 'PATCH',
    headers: BASE_HEADERS,
    body: JSON.stringify({ memo })
  });
  return handleResponse(response);
}

export async function updateLinkCategory(id, categoryId) {
  const response = await fetch(`/api/links/${id}/category`, {
    method: 'PATCH',
    headers: BASE_HEADERS,
    body: JSON.stringify({ categoryId })
  });
  return handleResponse(response);
}

export async function deleteLink(id) {
  const response = await fetch(`/api/links/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}

export async function fetchCategories() {
  const response = await fetch('/api/categories');
  return handleResponse(response);
}

export async function createCategory(name, color) {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: BASE_HEADERS,
    body: JSON.stringify({ name, color })
  });
  return handleResponse(response);
}

export async function updateCategory(id, name, color) {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: BASE_HEADERS,
    body: JSON.stringify({ name, color })
  });
  return handleResponse(response);
}

export async function deleteCategory(id) {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}
