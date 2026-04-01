import { useState, useEffect, useCallback } from 'react';
import { getCourses, getCourse, deleteCourse, createCourse, updateCourse } from '../api';
import CourseForm from './CourseForm';
import CourseDetail from './CourseDetail';

export default function Dashboard({ token, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [detailCourse, setDetailCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourses(token);
      const list = Array.isArray(data) ? data : (data.courses || data.data || []);
      setCourses(list);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleView = async (id) => {
    try {
      const data = await getCourse(token, id);
      setDetailCourse(Array.isArray(data) ? data[0] : (data.course || data.data || data));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(token, deleteId);
      showToast('Course deleted successfully');
      setDeleteId(null);
      fetchCourses();
    } catch (err) {
      showToast(err.message, 'error');
      setDeleteId(null);
    }
  };

  const handleSave = () => {
    showToast(editCourse ? 'Course updated successfully' : 'Course created successfully');
    setShowForm(false);
    setEditCourse(null);
    fetchCourses();
  };

  const filtered = courses.filter((c) =>
    `${c.courseName} ${c.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-800">Course Management</span>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
            <p className="text-gray-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
          </div>
          <button
            onClick={() => { setEditCourse(null); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Course
          </button>
        </div>

        <div className="relative mb-6">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">{search ? 'No courses match your search.' : 'No courses yet. Click Add Course to get started.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => {
              const id = course.id || course._id;
              return (
                <div key={id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                      {new Date(course.createdAt).getFullYear()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${course.supervisorId ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {course.supervisorId ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{course.courseName}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 flex-1 mb-4">{course.description}</p>
                  <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleView(id)}
                      className="flex-1 text-xs text-indigo-600 hover:bg-indigo-50 font-medium py-1.5 rounded transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { setEditCourse(course); setShowForm(true); }}
                      className="flex-1 text-xs text-gray-600 hover:bg-gray-50 font-medium py-1.5 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(id)}
                      className="flex-1 text-xs text-red-500 hover:bg-red-50 font-medium py-1.5 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <CourseForm
          token={token}
          course={editCourse}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditCourse(null); }}
          createCourse={createCourse}
          updateCourse={updateCourse}
        />
      )}

      {detailCourse && (
        <CourseDetail course={detailCourse} onClose={() => setDetailCourse(null)} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-center font-semibold text-gray-900 mb-2">Delete Course?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
