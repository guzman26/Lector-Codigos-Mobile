import React from 'react';
import './Footer.css';

interface NavTab {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

interface FooterProps {
  tabs: NavTab[];
  onTabClick: (tabId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ tabs, onTabClick }) => {
  const handleTabClick = (tabId: string) => {
    onTabClick(tabId);
  };

  return (
    <footer className='footer'>
      <nav className='footer-nav'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${tab.isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            type='button'
            aria-label={tab.label}
          >
            <span className='nav-icon' aria-hidden='true'>
              {tab.icon}
            </span>
            <span className='nav-label'>{tab.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
