import React from 'react';
import { MenuManager } from '../components/menu/MenuManager';
import '../styles/components/menu.css';

const MenuManagement: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>مدیریت منوها</h1>
        <p>در این بخش می‌توانید ساختار منوی سیستم را مدیریت کنید.</p>
      </header>

      <MenuManager />
    </div>
  );
};

export default MenuManagement; 