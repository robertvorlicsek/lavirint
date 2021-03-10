export const authInitialState = {
  loggedIn: false,
  userId: null,
  username: null,
  token: null,
  tokenExpirationDate: null,
  message: '',
  errorMessage: '',
};

export const authReducer = (state, { type, payload }) => {
  switch (type) {
    case 'AUTH':
      const tokenExpirationDate =
        payload.expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: payload.userId,
          token: payload.token,
          expiration: tokenExpirationDate,
        })
      );
      return {
        ...state,
        loggedIn: !!payload.token,
        userId: payload.userId,
        username: payload.username,
        token: payload.token,
        tokenExpirationDate: new Date(tokenExpirationDate),
      };
    case 'LOGOUT':
      localStorage.removeItem('userData');
      return {
        ...state,
        loggedIn: false,
        userId: null,
        username: null,
        token: null,
        tokenExpirationDate: null,
      };
    case 'SWITCH_TO_SIGNUP':
      return {
        ...state,
        signupMode: payload,
      };
    case 'MESSAGE':
      return {
        ...state,
        message: payload,
      };
    case 'EMPTY_MESSAGES':
      return {
        ...state,
        message: '',
        errorMessage: '',
      };
    case 'ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: payload,
      };
    case 'EMPTY':
      return { promosList: [] };
    default:
      return state;
  }
};
