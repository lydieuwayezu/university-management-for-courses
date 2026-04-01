

const BASE = 'https://student-management-system-backend.up.railway.app/api';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function getCourses(token) {
  const res = await fetch(`${BASE}/courses`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch courses');
  return data;
}

export async function getCourse(token, id) {
  const res = await fetch(`${BASE}/courses/${id}`, { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course');
  return data;
}

export async function createCourse(token, course) {
  const res = await fetch(`${BASE}/courses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(course),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create course');
  return data;
}

export async function updateCourse(token, id, course) {
  const res = await fetch(`${BASE}/courses/${id}`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(course),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update course');
  return data;
}

export async function deleteCourse(token, id) {
  const res = await fetch(`${BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to delete course');
  }
}
