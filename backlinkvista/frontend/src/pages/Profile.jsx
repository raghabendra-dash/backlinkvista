import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { Camera, Mail, Phone, Globe, MapPin, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    companyWebsite: user?.companyWebsite || '',
    whatsappUpdates: user?.whatsappUpdates || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full text-white">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">Advertiser</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    ${user?.balance}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-3" />
                  <span>{user?.companyWebsite}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{user?.country}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-pink-500 hover:text-pink-600"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields */}
                {/* Add form fields for all user information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  {/* Add more form fields */}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;