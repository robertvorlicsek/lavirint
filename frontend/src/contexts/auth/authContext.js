import {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useCallback,
} from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { authReducer, authInitialState } from './authReducer';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

// Auth context for the provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      dispatch({ type: 'AUTH', payload: storedData });
    }
  }, []);

  const signup = async authData => {
    const mode =
      // 'signup';
      'login';
    try {
      const responseData = await sendRequest(
        `/api/users/${mode}`,
        'POST',
        JSON.stringify(authData),
        {
          'Content-Type': 'application/json',
        }
      );

      dispatch({ type: 'AUTH', payload: responseData });
      history.push(`/`);
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
    }
  };

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT', payload: 'Logout uspešan' });
    history.push(`/`);
  }, [history]);

  useEffect(() => {
    let logoutTimer;
    if (state.token && state.tokenExpirationDate) {
      const remainingTime =
        state.tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [state.token, logout, state.tokenExpirationDate]);

  const switchToSignup = mode => {
    dispatch({ type: 'SWITCH_TO_SIGNUP', payload: mode });
  };

  const emptyMessages = useCallback(
    () => dispatch({ type: 'EMPTY_MESSAGES' }),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        signup,
        token: state.token,
        logout,
        switchToSignup,
        signupMode: state.signupMode,
        errorMessage: state.errorMessage,
        emptyMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
