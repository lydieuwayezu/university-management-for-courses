


	

import { useState, useEffect } from 'react';

const EMPTY = { courseCode: '', courseName: '', description: '', credits: '', department: '', instructor: '' };

export default function CourseForm({ token, course, onSave, onCancel, createCourse, updateCourse }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        courseCode: course.courseCode || '',
        courseName: course.courseName || '',
        description: course.description || '',
        credits: course.credits || '',
        department: course.department || '',
        instructor: course.instructor || '',
      });
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, credits: Number(form.credits) };
      if (course) {
        await updateCourse(token, course._id || course.id, payload);
      } else {
        await createCourse(token, payload);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'courseCode', label: 'Course Code', placeholder: 'e.g. CS101' },
    { key: 'courseName', label: 'Course Name', placeholder: 'e.g. Introduction to Programming' },
    { key: 'description', label: 'Description', placeholder: 'Course description...' },
    { key: 'credits', label: 'Credits', placeholder: 'e.g. 3', type: 'number' },
    { key: 'department', label: 'Department', placeholder: 'e.g. Computer Science' },
    { key: 'instructor', label: 'Instructor', placeholder: 'e.g. Dr. Smith' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {fields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type || 'text'}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
