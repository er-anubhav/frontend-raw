import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../../types';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    updateEmployeeStatus: (state, action: PayloadAction<{ id: string; status: Employee['status'] }>) => {
      const employee = state.employees.find(emp => emp.id === action.payload.id);
      if (employee) {
        employee.status = action.payload.status;
        if (action.payload.status === 'Complété') {
          employee.completedAt = new Date().toISOString();
        }
      }
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
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
  setEmployees,
  addEmployee,
  updateEmployee,
  updateEmployeeStatus,
  setSelectedEmployee,
  setLoading,
  setError,
} = employeeSlice.actions;

export default employeeSlice.reducer;