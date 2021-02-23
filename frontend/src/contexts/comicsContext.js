import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
const ComicsContext = createContext();
export const useComicsContext = () => useContext(ComicsContext);

const initalState = {
  comicsList: [],
  editionId: '',
  editionList: [],
  errorMessage: '',
  message: '',
};

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
      const newComicsList = [...state.comicsList];
      newComicsList.splice(indexInComic, 1);
      return {
        ...state,
        comicsList: newComicsList,
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
      return { comicsList: [] };
    default:
      return state;
  }
};

// Cart context for the provider
export const ComicsProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(reducer, initalState);
  const history = useHistory();

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  const getComics = useCallback(async () => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch('http://localhost:5000/api/editions');
      const data = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
      dispatch({ type: 'GET', payload: data });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
  }, []);

  const getComicsByEditionId = useCallback(async () => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(
        `http://localhost:5000/api/editions/comic/${state.editionId}`
      );
      const responseData = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      dispatch({ type: 'GET_COMICS_BY_EDITION_ID', payload: responseData });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
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
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(
            `http://localhost:5000/api/editions/newcomic`,
            {
              method: 'POST',
              body: formData,
              signal: httpAbortCtrl.signal,
            }
          );
          const responseData = await response.json();

          activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
          );

          if (!response.ok) {
            throw new Error(responseData.message);
          }

          console.log(`successfully uploaded the comic`);
          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });
          dispatch({ type: 'ADD', payload: newEntry });

          history.push(`/editions`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
          console.log(err);
        }
      };
      console.log(state.error);
      sendComic();
    }
  };

  const removeComic = id => {
    const deleteComic = async () => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(
          `http://localhost:5000/api/editions/${id}`,
          {
            method: 'DELETE',
            body: null,
            signal: httpAbortCtrl.signal,
          }
        );
        const resMessage = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(resMessage.message);
        }

        dispatch({ type: 'MESSAGE', payload: resMessage.message });
        history.push(`/editions`);
      } catch (err) {
        dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
        history.push(`/editions`);
      }
      dispatch({ type: 'REMOVE', payload: id });
    };
    deleteComic();
  };

  const emptyMessages = useCallback(
    () => dispatch({ type: 'EMPTY_MESSAGES' }),
    []
  );

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
        errorMessage: state.errorMessage,
        message: state.message,
        emptyMessages,
      }}
    >
      {children}
    </ComicsContext.Provider>
  );
};
