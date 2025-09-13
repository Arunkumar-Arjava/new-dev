import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const AddChildModal = ({ isOpen, onClose, parentEmail, onAddChild, Parent_id }) => {
  const [formData, setFormData] = useState({
    child_first_name: '',
    child_last_name: '',
    class_id: '',
    parent_id: Parent_id || ''
  });
  const [classrooms] = useState([
    { id: '1', name: 'Butterfly' },
    { id: '2', name: 'Purple' },
    { id: '3', name: 'Rainbow' },
    { id: '4', name: 'Sunshine' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ child_first_name: '', child_last_name: '', class_id: '', parent_id: Parent_id || '' });
    }
  }, [isOpen, Parent_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    const obj = { ...formData };

    if (!obj.child_first_name?.trim()) {
      toast.error('First Name is required!');
      return;
    }

    if (!obj.child_last_name?.trim()) {
      toast.error('Last Name is required!');
      return;
    }

    if (!obj.class_id) {
      toast.error('Class Room selection is required!');
      return;
    }

    if (!obj.parent_id) {
      toast.error('Parent information is required!');
      return;
    }

    onClose();
    obj.class_id = parseInt(obj.class_id);
    onAddChild(obj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h5 className="text-lg font-semibold text-gray-900">Child Basic Information</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="child_first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="child_first_name"
                  type="text"
                  maxLength="20"
                  value={formData.child_first_name}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002e4d]"
                />
              </div>

              <div>
                <label htmlFor="child_last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="child_last_name"
                  type="text"
                  maxLength="20"
                  value={formData.child_last_name}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002e4d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Class Room
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#002e4d]"
                >
                  <option value="">Select Classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Email
                </label>
                <input
                  type="text"
                  name='parent_email'
                  value={parentEmail}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  className="w-full border border-gray-400 rounded-md p-2 bg-gray-100 cursor-not-allowed focus:outline-none"
                />
                <input type="hidden" name="parent_id" value={formData.parent_id} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#002e4d] text-[#002e4d] px-6 py-2 rounded-md font-semibold hover:bg-[#002e4d] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#002e4d] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002e4d]/90 transition-colors"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChildModal;