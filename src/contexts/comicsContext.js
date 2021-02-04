import { createContext, useContext, useReducer, useCallback } from 'react';
const ComicsContext = createContext();
export const useComicsContext = () => useContext(ComicsContext);

const initalState = { comicsList: [], editionId: '' };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GET':
      return {
        ...state,
        comicsList: payload,
      };
    case 'GET_COMIC_ID':
      return {
        ...state,
        editionId: payload,
      };
    case 'ADD':
      return {
        ...state,
        comicsList: [...state.comicsList, payload],
      };
    case 'REMOVE':
      const indexInComic = state.comicsList.findIndex(c => c.id === payload);
      const newComic = [...state.comicsList];
      newComic.splice(indexInComic, 1);
      return {
        ...state,
        comicsList: newComic,
      };
    case 'EMPTY':
      return { comicsList: [] };
    default:
      return state;
  }
};

// Cart context for the provider
export const ComicsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initalState);

  const getComics = useCallback(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('http://localhost:3000/comics');
        const data = await response.json();
        dispatch({ type: 'GET', payload: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchComics();
  }, []);

  const getEditionId = editionId =>
    dispatch({ type: 'GET_COMIC_ID', payload: editionId });

  const addComic = newEntry => dispatch({ type: 'ADD', payload: newEntry });

  const removeComic = id => dispatch({ type: 'REMOVE', payload: id });

  return (
    <ComicsContext.Provider
      value={{
        getComics,
        getEditionId,
        addComic,
        removeComic,
        comicsList: state.comicsList,
        editionId: state.editionId,
      }}
    >
      {children}
    </ComicsContext.Provider>
  );
};
