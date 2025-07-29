import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterOptions } from '../../types';

type ViewType = 'dashboard' | 'new-onboarding' | 'suivi' | 'notifications' | 'responsables' | 'planning' | 'checklists' | 'equipment' | 'add-notification';

interface UiState {
  currentView: ViewType;
  filters: FilterOptions;
  expandedGroups: string[];
  modals: {
    responsable: boolean;
    checklistManager: boolean;
    planningGenerator: boolean;
  };
}

const initialState: UiState = {
  currentView: 'dashboard',
  filters: {
    department: 'Tous',
    timeframe: 'Cette semaine'
  },
  expandedGroups: ['gestion-des-arrivees', 'parametrage'],
  modals: {
    responsable: false,
    checklistManager: false,
    planningGenerator: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload;
    },
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    toggleGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      if (state.expandedGroups.includes(groupId)) {
        state.expandedGroups = state.expandedGroups.filter(id => id !== groupId);
      } else {
        state.expandedGroups.push(groupId);
      }
    },
    setExpandedGroups: (state, action: PayloadAction<string[]>) => {
      state.expandedGroups = action.payload;
    },
    openModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UiState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UiState['modals']] = false;
      });
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;