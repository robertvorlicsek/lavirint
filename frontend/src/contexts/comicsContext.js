import { createContext, useContext, useReducer, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
const ComicsContext = createContext();
export const useComicsContext = () => useContext(ComicsContext);

const initalState = { comicsList: [], editionId: '', editionList: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GET':
      return {
        ...state,
        comicsList: payload.editions,
      };
    case 'GET_COMIC_ID':
      return {
        ...state,
        editionId: payload,
      };
    case 'GET_COMICS_BY_EDITION_ID':
      return {
        ...state,
        editionList: payload.editions,
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
  const history = useHistory();

  const getComics = useCallback(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/editions');
        const data = await response.json();
        dispatch({ type: 'GET', payload: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchComics();
  }, []);

  const getComicsByEditionId = useCallback(() => {
    const fetchEdition = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/editions/comic/${state.editionId}`
        );
        const data = await response.json();
        dispatch({ type: 'GET_COMICS_BY_EDITION_ID', payload: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchEdition();
  }, [state.editionId]);

  const getEditionId = editionId =>
    dispatch({ type: 'GET_COMIC_ID', payload: editionId });

  const addComic = newEntry => {
    if (newEntry) {
      const formData = new FormData();
      if (newEntry.editionId) {
        formData.append('editionId', newEntry.editionId);
      }
      formData.append('title', newEntry.title);
      if (newEntry.img) {
        formData.append('img', newEntry.img.file);
      }
      formData.append('nr', newEntry.nr);
      if (newEntry.logo && newEntry.logo.file) {
        formData.append('logo', newEntry.logo.file);
      } else if (!newEntry.logo.file) {
        formData.append('logo', newEntry.logo);
        formData.append('cloudinaryLogoId', newEntry.cloudinaryLogoId);
      }
      const image = formData.get('img');
      console.log(image);
      const sendComic = async () => {
        const httpAbortCtrl = new AbortController();
        try {
          const response = await fetch(
            `http://localhost:5000/api/editions/newcomic`,
            {
              method: 'POST',
              body: formData,
              signal: httpAbortCtrl.signal,
            }
          );
          await response.json();

          console.log(`successfully uploaded the comic`);
          dispatch({ type: 'ADD', payload: newEntry });
          history.push(`/editions`);
        } catch (err) {
          console.log(err);
        }
      };
      sendComic();
    }
  };

  const removeComic = id => {
    console.log(
      '🚀 ~ file: comicsContext.js ~ line 95 ~ ComicsProvider ~ id',
      id
    );
    const deleteComic = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/editions/${id}`,
          {
            method: 'DELETE',
            body: null,
          }
        );
        await response.json();
      } catch (err) {
        console.log(err);
      }
    };
    deleteComic();
    dispatch({ type: 'REMOVE', payload: id });
    history.push(`/editions`);
  };

  return (
    <ComicsContext.Provider
      value={{
        getComics,
        getEditionId,
        addComic,
        removeComic,
        getComicsByEditionId,
        comicsList: state.comicsList,
        editionId: state.editionId,
        editionList: state.editionList,
      }}
    >
      {children}
    </ComicsContext.Provider>
  );
};
