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
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
        }
      };
      fetchEditions();
    },
    [state.editionId]
  );

  const getComicByComicId = useCallback(paramCId => {
    const fetchComic = async () => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        const response = await fetch(`/api/comics/${paramCId}`);
        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        dispatch({
          type: 'GET_COMIC_BY_COMIC_ID',
          payload: responseData.comic,
        });
      } catch (err) {
        dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
      }
    };
    fetchComic();
  }, []);

  const getEditionId = editionId =>
    dispatch({ type: 'GET_EDITION_ID', payload: editionId });

  const addComic = (newEntry, token) => {
    if (newEntry) {
      const formData = new FormData();
      if (newEntry.editionId) {
        formData.append('editionId', newEntry.editionId);
      }
      formData.append('title', newEntry.title);
      if (newEntry.imgs) {
        formData.append('imgs', newEntry.imgs[0].file);
        formData.append('imgs', newEntry.imgs[1].file);
        formData.append('imgs', newEntry.imgs[2].file);
      }
      formData.append('nr', newEntry.nr);
      if (newEntry.logo && newEntry.logo.file) {
        formData.append('logo', newEntry.logo.file);
      } else if (!newEntry.logo.file) {
        formData.append('logo', newEntry.logo);
        formData.append('cloudinaryLogoId', newEntry.cloudinaryLogoId);
      }

      formData.append(
        'info',
        JSON.stringify({
          comicYear: newEntry.comicYear,
          comicSeries: newEntry.comicSeries,
          comicWriter: newEntry.comicWriter,
          comicArtist: newEntry.comicArtist,
          comicTitleArtist: newEntry.comicTitleArtist,
          comicOriginalTitle: newEntry.comicOriginalTitle,
          comicOriginalNr: newEntry.comicOriginalNr,
          comicOriginCountry: newEntry.comicOriginCountry,
          comicDimensions: newEntry.comicDimensions,
          comicFinish: newEntry.comicFinish,
          comicPageNr: newEntry.comicPageNr,
          comicColor: newEntry.comicColor,
        })
      );

      // const images = formData.get('imgs');
      // const editionId = formData.get('editionId');
      // const nr = formData.get('nr');
      // const logo = formData.get('logo');
      // const title = formData.get('title');
      // const info = formData.get('info');

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

  const updateComic = (modifiedEntry, token) => {
    if (modifiedEntry) {
      const formData = new FormData();
      if (modifiedEntry.editionId) {
        formData.append('editionId', modifiedEntry.editionId);
      }
      formData.append('title', modifiedEntry.title);
      if (modifiedEntry.imgs && modifiedEntry.imgs[0].file) {
        formData.append('imgs', modifiedEntry.imgs[0].file);
        formData.append('imgs', modifiedEntry.imgs[1].file);
        formData.append('imgs', modifiedEntry.imgs[2].file);
      } else if (modifiedEntry.imgs && !modifiedEntry.imgs[0].file) {
        formData.append('imgs', modifiedEntry.imgs[0]);
        formData.append('imgs', modifiedEntry.imgs[1]);
        formData.append('imgs', modifiedEntry.imgs[2]);
      }
      formData.append('cloudinaryImgIds', modifiedEntry.cloudinaryImgIds[0]);
      formData.append('cloudinaryImgIds', modifiedEntry.cloudinaryImgIds[1]);
      formData.append('cloudinaryImgIds', modifiedEntry.cloudinaryImgIds[2]);
      formData.append('nr', modifiedEntry.nr);
      if (modifiedEntry.logo && modifiedEntry.logo.file) {
        formData.append('logo', modifiedEntry.logo.file);
      } else if (!modifiedEntry.logo.file) {
        formData.append('logo', modifiedEntry.logo);
        formData.append('cloudinaryLogoId', modifiedEntry.cloudinaryLogoId);
      }

      formData.append(
        'info',
        JSON.stringify({
          comicYear: modifiedEntry.comicYear,
          comicSeries: modifiedEntry.comicSeries,
          comicWriter: modifiedEntry.comicWriter,
          comicArtist: modifiedEntry.comicArtist,
          comicTitleArtist: modifiedEntry.comicTitleArtist,
          comicOriginalTitle: modifiedEntry.comicOriginalTitle,
          comicOriginalNr: modifiedEntry.comicOriginalNr,
          comicOriginCountry: modifiedEntry.comicOriginCountry,
          comicDimensions: modifiedEntry.comicDimensions,
          comicFinish: modifiedEntry.comicFinish,
          comicPageNr: modifiedEntry.comicPageNr,
          comicColor: modifiedEntry.comicColor,
        })
      );

      // const images = formData.get('imgs');
      // const editionId = formData.get('editionId');
      // const nr = formData.get('nr');
      // const logo = formData.get('logo');
      // const title = formData.get('title');
      // const info = formData.get('info');

      // console.log('imgs: ', images, 'editionId: ', editionId, 'info: ', info);

      const updateComic = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/comics/${modifiedEntry.cid}`, {
            method: 'PATCH',
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

          console.log(`strip je uspešno apdejtovan`);

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });
          dispatch({ type: 'UPDATE', payload: modifiedEntry });
          history.push(`/comics/${modifiedEntry.cid}`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
          console.log(err);
        }
      };
      updateComic();
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
        getComicByComicId,
        getEditionId,
        addComic,
        updateComic,
        removeComic,
        getComicsByEditionId,
        comic: state.comic,
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
