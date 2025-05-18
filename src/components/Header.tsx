import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Plus, Layers, BarChart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setFullName(data.full_name);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/create', icon: <Plus size={20} />, label: 'Add Flashcard' },
    { path: '/review', icon: <Layers size={20} />, label: 'Review' },
    { path: '/stats', icon: <BarChart size={20} />, label: 'Statistics' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getUserInitial = () => {
    if (fullName) {
      return fullName.charAt(0).toUpperCase();
    }
    return user?.email ? user.email.charAt(0).toUpperCase() : 'U';
  };

  const getUserDisplayName = () => {
    if (fullName) {
      return fullName;
    }
    return user?.email ? user.email.split('@')[0] : 'User';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 md:hidden">
        <div className="flex items-center space-x-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V6.5C20 7.60457 19.1046 8.5 18 8.5H6C4.89543 8.5 4 7.60457 4 6.5V4Z" fill="#4F46E5"/>
            <path d="M4 11C4 9.89543 4.89543 9 6 9H18C19.1046 9 20 9.89543 20 11V13.5C20 14.6046 19.1046 15.5 18 15.5H6C4.89543 15.5 4 14.6046 4 13.5V11Z" fill="#10B981"/>
            <path d="M4 18C4 16.8954 4.89543 16 6 16H18C19.1046 16 20 16.8954 20 18V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V18Z" fill="#F59E0B"/>
          </svg>
          <h1 className="text-xl font-bold text-indigo-600">Memoroid</h1>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white py-2 px-4 border-t border-gray-100">
          <ul className="space-y-2">
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      )}

      <div className="hidden md:flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {user ? `Welcome back${fullName ? ', ' + fullName : ''}!` : ''}
        </h2>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <span className="font-medium text-sm">
                  {getUserInitial()}
                </span>
              </div>
              <span className="text-sm text-gray-700">{getUserDisplayName()}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;