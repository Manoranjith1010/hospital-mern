import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/services';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('authToken') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

/**
 * Async thunks
 */
export const registerUser = createAsyncThunk('auth/registerUser', async (data) => {
  const response = await authAPI.register(data);
  return response.data;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  const response = await authAPI.login(credentials.email, credentials.password);
  const { token, user } = response.data.data;
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  return { token, user };
});

export const getProfile = createAsyncThunk('auth/getProfile', async () => {
  const response = await authAPI.getProfile();
  return response.data.data;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data) => {
  const response = await authAPI.updateProfile(data);
  localStorage.setItem('user', JSON.stringify(response.data.data));
  return response.data.data;
});

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data) => {
    const response = await authAPI.changePassword(data.oldPassword, data.newPassword);
    return response.data;
  },
);

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
