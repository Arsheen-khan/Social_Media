import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const location = useLocation();
  const indicatorRef = useRef(null);
  const navRef = useRef(null);

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/create', icon: 'plus', label: 'Create' },
    { path: '/chat', icon: 'chat', label: 'Chat' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];

  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeIndex !== -1 && indicatorRef.current && navRef.current) {
      const navItem = navRef.current.children[activeIndex];
      if (navItem) {
        const itemRect = navItem.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        
        gsap.to(indicatorRef.current, {
          x: itemRect.left - navRect.left + (itemRect.width / 2) - 20,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    }
  }, [location.pathname]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'chat':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="relative max-w-md mx-auto">
        {/* Active indicator */}
        <div
          ref={indicatorRef}
          className="absolute top-0 w-10 h-1 gradient-primary rounded-full"
          style={{ left: 0 }}
        />
        
        <div ref={navRef} className="flex items-center justify-around pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              {getIcon(item.icon)}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
