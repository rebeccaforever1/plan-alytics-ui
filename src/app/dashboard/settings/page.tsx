"use client"

import React, { useState } from 'react';
import { User, Settings, Shield, Star, Building, Users, CreditCard, ChevronLeft } from 'lucide-react';

// Navigation component
const SettingsNav = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'organization', label: 'Organization Settings', icon: Building },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
  ];

  return (
    <nav className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Page Layout Component
const PageLayout = ({ title, children }) => (
  <div className="flex-1 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
      {children}
    </div>
  </div>
);

// Profile Settings Page
const ProfileSettingsPage = () => (
  <PageLayout title="Profile Settings">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={24} className="text-gray-500" />
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Upload Photo
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  </PageLayout>
);

// Preferences Page
const PreferencesPage = () => (
  <PageLayout title="Preferences">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Dark Mode</label>
              <p className="text-sm text-gray-500">Use dark theme across the application</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Security & Privacy Page
const SecurityPage = () => (
  <PageLayout title="Security & Privacy">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Password & Authentication</h2>
        <div className="space-y-4">
          <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Change Password
          </button>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Data Analytics</label>
              <p className="text-sm text-gray-500">Help improve our service with usage analytics</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Marketing Communications</label>
              <p className="text-sm text-gray-500">Receive product updates and offers</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </div>
        </div>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Delete Account
          </button>
          <p className="text-sm text-red-600">This action cannot be undone</p>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Favorites Page
const FavoritesPage = () => (
  <PageLayout title="Favorites">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Bookmarked Items</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center gap-3">
                <Star size={16} className="text-yellow-500" />
                <div>
                  <h3 className="font-medium">Favorite Item {item}</h3>
                  <p className="text-sm text-gray-500">Added 2 days ago</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Dashboard</h3>
            <p className="text-sm text-gray-500">Main overview page</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Reports</h3>
            <p className="text-sm text-gray-500">Analytics and insights</p>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Organization Settings Page
const OrganizationPage = () => (
  <PageLayout title="Organization Settings">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>1-10 employees</option>
              <option>11-50 employees</option>
              <option>51-200 employees</option>
              <option>200+ employees</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Organization Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Allow External Sharing</label>
              <p className="text-sm text-gray-500">Let team members share content externally</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Enforce 2FA for all team members</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Team Management Page
const TeamManagementPage = () => (
  <PageLayout title="Team Management">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Invite Member
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'John Doe', email: 'john@company.com', role: 'Admin' },
            { name: 'Jane Smith', email: 'jane@company.com', role: 'Editor' },
            { name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer' }
          ].map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">{member.role}</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Permissions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Default Role for New Members</h3>
            <select className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Billing & Usage Page
const BillingPage = () => (
  <PageLayout title="Billing & Usage">
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div>
            <h3 className="font-semibold text-blue-800">Professional Plan</h3>
            <p className="text-blue-600">$729/month • Billed monthly</p>
          </div>
          <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
            Change Plan
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700">API Calls</h3>
            <p className="text-2xl font-bold">12,450</p>
            <p className="text-sm text-gray-500">of 50,000</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700">Storage</h3>
            <p className="text-2xl font-bold">2.3 GB</p>
            <p className="text-sm text-gray-500">of 10 GB</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700">Team Members</h3>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-500">of 10</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-gray-500" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Update
          </button>
        </div>
      </div>
    </div>
  </PageLayout>
);

// Main App Component
export default function SettingsApp() {
  const [currentPage, setCurrentPage] = useState('profile');

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfileSettingsPage />;
      case 'preferences':
        return <PreferencesPage />;
      case 'security':
        return <SecurityPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'organization':
        return <OrganizationPage />;
      case 'team':
        return <TeamManagementPage />;
      case 'billing':
        return <BillingPage />;
      default:
        return <ProfileSettingsPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SettingsNav currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}