export const settingsInitialState = {
  settings: {},
  disableIntro: false,
};

export const settingsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'GET':
      return {
        ...state,
        settings: payload.settings,
      };
    case 'ADD':
      return {
        ...state,
        settings: payload,
      };
    case 'UPDATE':
      return {
        ...state,
        settings: payload,
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
    default:
      return state;
  }
};
