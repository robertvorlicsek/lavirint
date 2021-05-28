export const comicsInitialState = {
  comicsList: [],
  editionId: '',
  comic: {},
  editionList: [],
  editionsList: [],
  errorMessage: '',
  message: '',
};

export const comicsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'GET':
      return {
        ...state,
        comicsList: payload.comics,
      };
    case 'GET_EDITION_ID':
      return {
        ...state,
        editionId: payload,
      };
    case 'GET_COMIC_BY_COMIC_ID':
      return {
        ...state,
        comic: payload.comic,
      };
    case 'GET_COMICS_BY_EDITION_ID':
      return {
        ...state,
        editionList: payload.editions,
      };
    case 'GET_EDITIONS_BY_EDITION_ID':
      return {
        ...state,
        editionsList: payload.editions,
      };
    case 'ADD':
      if (state.comicsList) {
        return {
          ...state,
          comicsList: [...state.comicsList, payload.newEntry],
        };
      } else {
        return {
          ...state,
          comicsList: [payload.newEntry],
        };
      }
    case 'UPDATE':
      const newComicList = (state.comicsList[
        state.comicsList.findIndex(el => el.id === payload.id)
      ] = payload);
      return {
        ...state,
        comicsList: newComicList,
      };

    case 'REMOVE':
      // const indexInComic = state.comicsList.findIndex(c => c.id === payload);
      // const newComicsList = [...state.comicsList];
      // newComicsList.splice(indexInComic, 1);
      return {
        ...state,
        // comicsList: newComicsList,
      };
    case 'MESSAGE':
      return {
        ...state,
        message: payload.message,
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
      return { comicsList: [] };
    default:
      return state;
  }
};
