import {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { authReducer, authInitialState } from './authReducer';

import { useHistory } from 'react-router-dom';
const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

// Auth context for the provider
export const AuthProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const history = useHistory();

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

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
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(`/api/users/${mode}`, {
        method: 'POST',
        body: JSON.stringify(authData),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: httpAbortCtrl.signal,
      });
      const responseData = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      dispatch({ type: 'AUTH', payload: responseData });
      history.push(`/promo`);
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
  };

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT', payload: 'Logout uspešan' });
    history.push(`/promo`);
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
