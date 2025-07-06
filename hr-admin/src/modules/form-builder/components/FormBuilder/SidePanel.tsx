import React from 'react';

interface SidePanelProps {
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ children }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {children}
    </div>
  );
};

export default SidePanel; 