import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, MenuType } from '../../types/menu';
import { fetchMenuTree, reorderMenus, moveMenuItem } from '../../services/menu.service';
import { useAuth } from '../../hooks/useAuth';
import { Logger } from '../../utils/logger';

interface MenuTreeProps {
  onMenuSelect?: (menu: MenuItem) => void;
  className?: string;
}

export const MenuTree: React.FC<MenuTreeProps> = ({ onMenuSelect, className }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // دریافت ساختار درختی منو
  const { data: menuTree = [], isLoading } = useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: fetchMenuTree
  });

  // میوتیشن برای تغییر ترتیب منوها
  const reorderMutation = useMutation({
    mutationFn: reorderMenus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'tree'] });
    }
  });

  // میوتیشن برای جابجایی منوها
  const moveMutation = useMutation({
    mutationFn: moveMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus', 'tree'] });
    }
  });

  // مدیریت درگ و دراپ
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.draggableId;
    const destinationId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    try {
      if (result.type === 'menu') {
        // جابجایی بین منوها
        if (result.source.droppableId !== result.destination.droppableId) {
          await moveMutation.mutateAsync({
            menuId: sourceId,
            newParentId: destinationId === 'root' ? null : destinationId
          });
        } else {
          // تغییر ترتیب در یک سطح
          const parentId = destinationId === 'root' ? null : destinationId;
          const items = findMenuItems(menuTree, parentId);
          const newOrder = reorder(items, sourceIndex, destinationIndex);
          
          await reorderMutation.mutateAsync({
            parentId,
            menuIds: newOrder.map(item => item.id)
          });
        }
      }
    } catch (error) {
      Logger.error('Error in drag and drop:', error);
    }
  };

  // رندر آیتم منو
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasAccess = checkMenuAccess(item, user);
    if (!hasAccess) return null;

    return (
      <Draggable key={item.id} draggableId={item.id} index={level}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="menu-item"
            onClick={() => onMenuSelect?.(item)}
          >
            <div className="menu-item-content" style={{ paddingLeft: `${level * 20}px` }}>
              {item.icon && <span className="menu-item-icon">{item.icon}</span>}
              <span className="menu-item-title">{item.title}</span>
              {item.type === MenuType.FORM && (
                <span className="menu-item-badge">فرم</span>
              )}
            </div>

            {item.children && item.children.length > 0 && (
              <Droppable droppableId={item.id} type="menu">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="menu-children"
                  >
                    {(item.children || []).map((child, index) => 
                      renderMenuItem(child, level + 1)
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  if (isLoading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="menu">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`menu-tree ${className || ''}`}
          >
            {menuTree.map((item, index) => renderMenuItem(item, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// توابع کمکی
const findMenuItems = (items: MenuItem[] = [], parentId: string | null): MenuItem[] => {
  if (!parentId) return items;

  for (const item of items) {
    if (item.id === parentId) return item.children || [];
    if (item.children) {
      const result = findMenuItems(item.children, parentId);
      if (result.length) return result;
    }
  }
  return [];
};

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

type AuthUser = {
  permissions?: string[];
  roles?: string[];
};

const checkMenuAccess = (menu: MenuItem, user: AuthUser | null) => {
  if (!menu.permissions?.length && !menu.roles?.length) return true;
  if (!user) return false;
  
  const hasPermission = menu.permissions?.some(p => user.permissions?.includes(p));
  const hasRole = menu.roles?.some(r => user.roles?.includes(r));
  
  return hasPermission || hasRole;
};

export default MenuTree; 