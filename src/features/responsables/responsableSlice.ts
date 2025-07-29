import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Responsable } from '../../types';

interface ResponsableState {
  responsables: Responsable[];
  loading: boolean;
  error: string | null;
}

const initialState: ResponsableState = {
  responsables: [],
  loading: false,
  error: null,
};

const responsableSlice = createSlice({
  name: 'responsables',
  initialState,
  reducers: {
    setResponsables: (state, action: PayloadAction<Responsable[]>) => {
      state.responsables = action.payload;
    },
    addResponsable: (state, action: PayloadAction<Responsable>) => {
      state.responsables.push(action.payload);
    },
    updateResponsable: (state, action: PayloadAction<Responsable>) => {
      const index = state.responsables.findIndex(resp => resp.id === action.payload.id);
      if (index !== -1) {
        state.responsables[index] = action.payload;
      }
    },
    removeResponsable: (state, action: PayloadAction<string>) => {
      state.responsables = state.responsables.filter(resp => resp.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setResponsables,
  addResponsable,
  updateResponsable,
  removeResponsable,
  setLoading,
  setError,
} = responsableSlice.actions;

export default responsableSlice.reducer;