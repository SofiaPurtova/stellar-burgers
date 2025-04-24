import { authReducer } from './authSlice';
import { initialState, setAuthChecked } from './authSlice';
import {
  checkUserAuth,
  loginUser,
  registerUser,
  logoutUser,
  updateUser
} from './authSlice';
import { TLoginData, TRegisterData } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

// Мокируем API вызовы
jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  refreshToken: jest.fn()
}));

// Тестовые данные
const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'password123'
};

const mockRegisterData: TRegisterData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const mockRequestId = 'test-request-id';

describe('authSlice', () => {
  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('setAuthChecked', () => {
    it('should set isAuthChecked', () => {
      const state = authReducer(initialState, setAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('checkUserAuth', () => {
    it('should handle pending', () => {
      const state = authReducer(
        initialState,
        checkUserAuth.pending(mockRequestId)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = authReducer(
        initialState,
        checkUserAuth.fulfilled(mockUser, mockRequestId)
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected', () => {
      const error = new Error('Auth check failed');
      const state = authReducer(
        initialState,
        checkUserAuth.rejected(error, mockRequestId)
      );
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('loginUser', () => {
    it('should handle pending', () => {
      const state = authReducer(
        initialState,
        loginUser.pending(mockRequestId, mockLoginData)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = authReducer(
        initialState,
        loginUser.fulfilled(mockUser, mockRequestId, mockLoginData)
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });
    it('should handle rejected', () => {
      const error = new Error('Login failed');
      const state = authReducer(
        initialState,
        loginUser.rejected(error, mockRequestId, mockLoginData)
      );
      expect(state.error).toBe(error.message);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('should handle pending', () => {
      const state = authReducer(
        initialState,
        registerUser.pending(mockRequestId, mockRegisterData)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = authReducer(
        initialState,
        registerUser.fulfilled(mockUser, mockRequestId, mockRegisterData)
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle rejected', () => {
      const error = new Error('Registration failed');
      const state = authReducer(
        initialState,
        registerUser.rejected(error, mockRequestId, mockRegisterData)
      );
      expect(state.error).toBe(error.message);
    });
  });

  describe('logoutUser', () => {
    it('should handle fulfilled', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };
      const state = authReducer(
        loggedInState,
        logoutUser.fulfilled(true, mockRequestId)
      );
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should handle fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const state = authReducer(
        initialState,
        updateUser.fulfilled(updatedUser, mockRequestId, {
          name: 'Updated Name'
        })
      );
      expect(state.user).toEqual(updatedUser);
    });

    it('should handle rejected', () => {
      const error = new Error('Update failed');
      const state = authReducer(
        initialState,
        updateUser.rejected(error, mockRequestId, { name: 'Updated Name' })
      );
      expect(state.error).toBe(error.message);
    });
  });
});
