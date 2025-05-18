import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Layers, 
  BarChart,
  User,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/create', icon: <Plus size={20} />, label: 'Add Flashcard' },
    { path: '/review', icon: <Layers size={20} />, label: 'Review' },
    { path: '/stats', icon: <BarChart size={20} />, label: 'Statistics' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V6.5C20 7.60457 19.1046 8.5 18 8.5H6C4.89543 8.5 4 7.60457 4 6.5V4Z" fill="#4F46E5"/>
            <path d="M4 11C4 9.89543 4.89543 9 6 9H18C19.1046 9 20 9.89543 20 11V13.5C20 14.6046 19.1046 15.5 18 15.5H6C4.89543 15.5 4 14.6046 4 13.5V11Z" fill="#10B981"/>
            <path d="M4 18C4 16.8954 4.89543 16 6 16H18C19.1046 16 20 16.8954 20 18V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V18Z" fill="#F59E0B"/>
          </svg>
          <h1 className="text-xl font-bold text-indigo-600">Memoroid</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;