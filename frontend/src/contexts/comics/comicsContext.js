import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { comicsReducer, comicsInitialState } from './comicsReducer';
import { useHistory } from 'react-router-dom';
const ComicsContext = createContext();
export const useComicsContext = () => useContext(ComicsContext);

// Comics context for the provider
export const ComicsProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(comicsReducer, comicsInitialState);
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
      const response = await fetch(`/api/comics`);
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

  const getComicsByEditionId = useCallback(
    paramEdId => {
      let edId = state.editionId || paramEdId;
      const fetchEditions = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/comics/editions/${edId}`);
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
      };
      fetchEditions();
    },
    [state.editionId]
  );

  const getEditionId = editionId =>
    dispatch({ type: 'GET_EDITION_ID', payload: editionId });

  const addComic = (newEntry, token) => {
    console.log(
      '🚀 ~ file: comicsContext.js ~ line 75 ~ ComicsProvider ~ newEntry',
      newEntry
    );
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
      const editionId = formData.get('editionId');
      const nr = formData.get('nr');
      const logo = formData.get('logo');
      const title = formData.get('title');
      console.log(image, editionId, logo, title, nr);

      const sendComic = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/comics/newcomic`, {
            method: 'POST',
            body: formData,
            headers: { Authorization: 'Bearer ' + token },
            signal: httpAbortCtrl.signal,
          });
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
          newEntry.editionId
            ? history.push(`/editions/${newEntry.editionId}`)
            : history.push(`/editions`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
          console.log(err);
        }
      };
      sendComic();
    }
  };

  const removeComic = async (id, token) => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(`/api/comics/${id}`, {
        method: 'DELETE',
        body: null,
        headers: { Authorization: 'Bearer ' + token },
        signal: httpAbortCtrl.signal,
      });
      const resMessage = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(resMessage.message);
      }

      dispatch({ type: 'MESSAGE', payload: resMessage.message });
      // proveriti sta se desi ako nema editionId-a

      state.editionList.length === 1
        ? history.push(`/editions`)
        : history.push(`/editions/${state.editionId}`);
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
      history.push(`/editions`);
    }
    dispatch({ type: 'REMOVE', payload: id });
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
