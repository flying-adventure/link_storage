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

export async function fetchLinks() {
  const response = await fetch('/api/links');
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

export async function deleteLink(id) {
  const response = await fetch(`/api/links/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}
