import React, { useState } from 'react';
import {
  User, Home, Box, Star, Archive, ShoppingCart, Shield, Bell, Settings, LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    category: 'Account',
    items: [
      { title: 'User Information', icon: User, id: 'user-info' },
      { title: 'Address Book', icon: Home, id: 'address-book' },
    ],
  },
  {
    category: 'Orders & Shopping',
    items: [
      { title: 'My Orders', icon: Box, id: 'orders' },
      { title: 'Wishlist', icon: Star, id: 'wishlist' },
      { title: 'Recently Viewed', icon: Archive, id: 'recent' },
      { title: 'Payment Methods', icon: ShoppingCart, id: 'payment' },
    ],
  },
  {
    category: 'Account Settings',
    items: [
      { title: 'Security Settings', icon: Shield, id: 'security' },
      { title: 'Notifications', icon: Bell, id: 'notifications' },
      { title: 'Reviews & Ratings', icon: Star, id: 'reviews' },
      { title: 'Coupons & Rewards', icon: Star, id: 'coupons' },
      { title: 'Preferences', icon: Settings, id: 'preferences' },
    ],
  },
];

const userInfo = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 555-123-4567',
  dob: '1990-01-01',
  gender: 'Male',
  avatar: '/placeholder.svg',
};

const sectionContent: Record<string, React.ReactNode> = {
  'user-info': (
    <div className="p-8 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <div className="bg-white p-6 rounded shadow flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userInfo.avatar} alt="Profile" />
            <AvatarFallback className="bg-gray-900 text-white">JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg">{userInfo.name}</div>
            <div className="text-gray-500">{userInfo.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-xs text-gray-400">Phone</div>
            <div className="font-medium">{userInfo.phone}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Date of Birth</div>
            <div className="font-medium">{userInfo.dob}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Gender</div>
            <div className="font-medium">{userInfo.gender}</div>
          </div>
        </div>
        <Button className="mt-6 w-32">Edit Profile</Button>
      </div>
    </div>
  ),
  'address-book': (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Address Book</h2>
      <ul className="space-y-4">
        <li className="bg-white p-6 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">Home</div>
            <div className="text-gray-500 text-sm">123 Main St, Springfield, IL 62704</div>
            <div className="text-gray-400 text-xs mt-1">Default Shipping Address</div>
          </div>
          <Button variant="outline" className="mt-2 md:mt-0">Edit</Button>
        </li>
        <li className="bg-white p-6 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">Office</div>
            <div className="text-gray-500 text-sm">456 Corporate Blvd, Chicago, IL 60616</div>
          </div>
          <Button variant="outline" className="mt-2 md:mt-0">Edit</Button>
        </li>
        <li className="bg-white p-6 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">Other</div>
            <div className="text-gray-500 text-sm">789 Lakeview Dr, Peoria, IL 61614</div>
          </div>
          <Button variant="outline" className="mt-2 md:mt-0">Edit</Button>
        </li>
      </ul>
      <Button className="mt-6">Add New Address</Button>
    </div>
  ),
  orders: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-4">
        <li className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <div className="font-semibold">Order #12345</div>
            <div className="text-gray-500 text-sm">Placed on 2024-05-01</div>
            <div className="text-gray-700 mt-1">2x T-Shirts, 1x Jeans</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">$89.99</div>
            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Delivered</span>
          </div>
        </li>
        <li className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <div className="font-semibold">Order #12344</div>
            <div className="text-gray-500 text-sm">Placed on 2024-04-15</div>
            <div className="text-gray-700 mt-1">1x Hoodie</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">$39.99</div>
            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Shipped</span>
          </div>
        </li>
      </ul>
    </div>
  ),
  wishlist: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <li className="bg-white p-4 rounded shadow flex flex-col items-center">
          <img src="/placeholder.svg" alt="Product" className="w-24 h-24 mb-2" />
          <div className="font-semibold">Wireless Headphones</div>
          <div className="text-gray-500">$199.99</div>
          <Button className="mt-2 w-full">Add to Cart</Button>
        </li>
        <li className="bg-white p-4 rounded shadow flex flex-col items-center">
          <img src="/placeholder.svg" alt="Product" className="w-24 h-24 mb-2" />
          <div className="font-semibold">Smart Watch</div>
          <div className="text-gray-500">$99.99</div>
          <Button className="mt-2 w-full">Add to Cart</Button>
        </li>
      </ul>
    </div>
  ),
  recent: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <ul className="flex space-x-6">
        <li className="bg-white p-4 rounded shadow flex flex-col items-center">
          <img src="/placeholder.svg" alt="Product" className="w-20 h-20 mb-2" />
          <div className="font-semibold">Running Shoes</div>
        </li>
        <li className="bg-white p-4 rounded shadow flex flex-col items-center">
          <img src="/placeholder.svg" alt="Product" className="w-20 h-20 mb-2" />
          <div className="font-semibold">Backpack</div>
        </li>
      </ul>
    </div>
  ),
  payment: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      <ul className="space-y-4">
        <li className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">Visa ending in 1234</div>
            <div className="text-gray-500 text-sm">Expires 12/26</div>
          </div>
          <Button variant="outline">Remove</Button>
        </li>
        <li className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">Mastercard ending in 5678</div>
            <div className="text-gray-500 text-sm">Expires 09/25</div>
          </div>
          <Button variant="outline">Remove</Button>
        </li>
      </ul>
      <Button className="mt-6">Add New Payment Method</Button>
    </div>
  ),
  security: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
      <div className="bg-white p-6 rounded shadow mb-4">
        <div className="font-semibold mb-2">Change Password</div>
        <Button variant="outline">Change</Button>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <div className="font-semibold mb-2">Two-Factor Authentication</div>
        <Button variant="outline">Enable</Button>
      </div>
    </div>
  ),
  notifications: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="bg-white p-6 rounded shadow mb-4 flex items-center justify-between">
        <div>Email Notifications</div>
        <input type="checkbox" checked readOnly className="accent-gray-900 w-5 h-5" />
      </div>
      <div className="bg-white p-6 rounded shadow flex items-center justify-between">
        <div>SMS Notifications</div>
        <input type="checkbox" className="accent-gray-900 w-5 h-5" />
      </div>
    </div>
  ),
  reviews: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
      <ul className="space-y-4">
        <li className="bg-white p-4 rounded shadow">
          <div className="font-semibold">Running Shoes</div>
          <div className="text-yellow-500">★★★★☆</div>
          <div className="text-gray-600 text-sm">"Very comfortable and stylish!"</div>
        </li>
        <li className="bg-white p-4 rounded shadow">
          <div className="font-semibold">Smart Watch</div>
          <div className="text-yellow-500">★★★☆☆</div>
          <div className="text-gray-600 text-sm">"Good features but battery life could be better."</div>
        </li>
      </ul>
    </div>
  ),
  coupons: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Coupons & Rewards</h2>
      <ul className="space-y-4">
        <li className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">WELCOME10</div>
            <div className="text-gray-500 text-sm">10% off on your first order</div>
          </div>
          <Button variant="outline">Apply</Button>
        </li>
        <li className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">FREESHIP</div>
            <div className="text-gray-500 text-sm">Free shipping on orders over $50</div>
          </div>
          <Button variant="outline">Apply</Button>
        </li>
      </ul>
    </div>
  ),
  preferences: (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Preferences</h2>
      <div className="bg-white p-6 rounded shadow mb-4 flex items-center justify-between">
        <div>Language</div>
        <select className="border rounded px-2 py-1">
          <option>English</option>
          <option>Spanish</option>
        </select>
      </div>
      <div className="bg-white p-6 rounded shadow flex items-center justify-between">
        <div>Theme</div>
        <select className="border rounded px-2 py-1">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
    </div>
  ),
};

export default function Profile() {
  const [activeSection, setActiveSection] = useState('user-info');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={userInfo.avatar} alt="Profile" />
              <AvatarFallback className="bg-gray-900 text-white">JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{userInfo.name}</h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
          <ul className="mb-6">
            {menuItems[0].items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                    ${activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders & Shopping</div>
          <ul className="mb-6">
            {menuItems[1].items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                    ${activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Settings</div>
          <ul>
            {menuItems[2].items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                    ${activeSection === item.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-100">
            <LogOut className="h-5 w-5 mr-2" /> Logout
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {sectionContent[activeSection]}
      </main>
    </div>
  );
} 