import axios from 'axios';
import { MenuItem } from '../types/menu';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3995/api';

export const fetchMenuTree = async (): Promise<MenuItem[]> => {
  const response = await axios.get(`${API_URL}/menus/tree`);
  return response.data;
};

export const reorderMenus = async ({
  parentId,
  itemId,
  newIndex,
}: {
  parentId: string;
  itemId: string;
  newIndex: number;
}) => {
  const response = await axios.put(`${API_URL}/menus/reorder`, {
    parentId,
    itemId,
    newIndex,
  });
  return response.data;
};

export const moveMenuItem = async ({
  itemId,
  newParentId,
  newIndex,
}: {
  itemId: string;
  newParentId: string;
  newIndex: number;
}) => {
  const response = await axios.put(`${API_URL}/menus/move`, {
    itemId,
    newParentId,
    newIndex,
  });
  return response.data;
}; 