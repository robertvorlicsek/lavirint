export const promosInitialState = {
  promosList: [],
  errorMessage: '',
  message: '',
};

export const promosReducer = (state, { type, payload }) => {
  switch (type) {
    case 'GET':
      return {
        ...state,
        promosList: payload.promos,
      };
    case 'ADD':
      return {
        ...state,
        promosList: [...state.promosList, payload],
      };
    case 'REMOVE':
      const indexInPromo = state.promosList.findIndex(p => p.id === payload);
      const newPromosList = [...state.promosList];
      newPromosList.splice(indexInPromo, 1);
      return {
        ...state,
        promosList: newPromosList,
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
