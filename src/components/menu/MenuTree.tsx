import React from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, MenuType } from '../../types/menu';
import { fetchMenuTree, reorderMenus, moveMenuItem } from '../../services/menu.service';
import { useAuth } from '../../hooks/useAuth';
import { Logger } from '../../utils/logger';
import type { User as AuthUser } from '../../types/auth';

interface MenuTreeProps {
  onSelect: (item: MenuItem) => void;
  selectedId?: string;
}

const MenuTree: React.FC<MenuTreeProps> = ({ onSelect, selectedId }) => {
  const { data: menuItems, isLoading } = useQuery(['menuTree'], fetchMenuTree);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const reorderMutation = useMutation(reorderMenus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menuTree']);
    },
  });

  const moveMutation = useMutation(moveMenuItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(['menuTree']);
    },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    const itemId = result.draggableId;

    if (sourceId === destinationId) {
      reorderMutation.mutate({
        parentId: sourceId,
        itemId,
        newIndex: result.destination.index,
      });
    } else {
      moveMutation.mutate({
        itemId,
        newParentId: destinationId,
        newIndex: result.destination.index,
      });
    }
  };

  const renderMenuItem = (item: MenuItem, level: number) => {
    return (
      <Draggable key={item.id} draggableId={item.id} index={level}>
        {(provided: DraggableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`menu-item ${selectedId === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item)}
          >
            <span className="menu-item-title">{item.title}</span>
            {item.children && item.children.length > 0 && (
              <Droppable droppableId={item.id} type="menu">
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="menu-children"
                  >
                    {item.children?.map((child, index) => 
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

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="menu">
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="menu-tree"
          >
            {menuItems?.map((item, index) => renderMenuItem(item, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const checkMenuAccess = (menu: MenuItem, user: AuthUser | null) => {
  if (!menu.permissions?.length && !menu.roles?.length) return true;
  if (!user) return false;
  
  const hasPermission = menu.permissions?.some(p => user.permissions?.includes(p));
  const hasRole = menu.roles?.some(r => user.roles?.includes(r));
  
  return hasPermission || hasRole;
};

export default MenuTree; 