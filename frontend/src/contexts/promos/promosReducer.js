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
    case 'UPDATE':
      const newEntries = state.promosList.filter(p => p.id !== payload.id);
      newEntries.unshift(payload);
      return {
        ...state,
        promosList: newEntries,
      };
    case 'SET_FIRST':
      const indexInPromoArr = state.promosList.findIndex(p => p.id === payload);
      const newPromosListArr = [...state.promosList];
      const firstEl = newPromosListArr.splice(indexInPromoArr, 1);
      newPromosListArr.unshift(firstEl[0]);
      return {
        ...state,
        promosList: newPromosListArr,
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
