import { createContext, useContext, useReducer, useCallback } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { comicsReducer, comicsInitialState } from './comicsReducer';
import { useHistory } from 'react-router-dom';
const ComicsContext = createContext();
export const useComicsContext = () => useContext(ComicsContext);

// Comics context for the provider
export const ComicsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(comicsReducer, comicsInitialState);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const getComics = useCallback(async () => {
    try {
      const responseData = await sendRequest(`/api/comics`);

      dispatch({ type: 'GET', payload: responseData });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
    }
  }, [sendRequest, error]);

  const getComicsByEditionId = useCallback(
    paramEdId => {
      let edId = state.editionId || paramEdId;
      const fetchEditions = async () => {
        try {
          const responseData = await sendRequest(
            `/api/comics/editions/${edId}`
          );
          dispatch({
            type: 'GET_COMICS_BY_EDITION_ID',
            payload: responseData,
          });
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: error });
        }
      };
      fetchEditions();
    },
    [state.editionId, sendRequest, error]
  );

  const getComicByComicId = useCallback(
    async paramCId => {
      try {
        const responseData = await sendRequest(`/api/comics/${paramCId}`);

        dispatch({
          type: 'GET_COMIC_BY_COMIC_ID',
          payload: responseData,
        });
      } catch (err) {
        console.log(error);
        dispatch({ type: 'ERROR_MESSAGE', payload: error });
        window.history.back();
      }
    },
    [
      sendRequest,
      error,
      // isLoading
    ]
  );

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
          comicPreview: newEntry.comicPreview,
        })
      );

      // const images = formData.get('imgs');
      // const editionId = formData.get('editionId');
      // const nr = formData.get('nr');
      // const logo = formData.get('logo');
      // const title = formData.get('title');
      // const info = formData.get('info');

      const sendComic = async () => {
        try {
          const responseData = await sendRequest(
            `/api/comics/newcomic`,
            'POST',
            formData,
            {
              Authorization: 'Bearer ' + token,
            }
          );

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
          dispatch({ type: 'ERROR_MESSAGE', payload: error });
          console.log(error);
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
          comicPreview: modifiedEntry.comicPreview,
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
        try {
          const responseData = await sendRequest(
            `/api/comics/${modifiedEntry.cid}`,
            'PATCH',
            formData,
            {
              Authorization: 'Bearer ' + token,
            }
          );

          console.log(`strip je uspešno apdejtovan`);

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });
          dispatch({
            type: 'UPDATE',
            payload: modifiedEntry,
          });
          history.push(`/comics/${modifiedEntry.cid}`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: error });
          console.log(err);
        }
      };
      updateComic();
    }
  };

  const removeComic = async (id, token) => {
    try {
      const responseData = await sendRequest(
        `/api/comics/${id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + token,
        }
      );

      dispatch({
        type: 'MESSAGE',
        payload: responseData,
      });
      // proveriti sta se desi ako nema editionId-a

      state.editionList.length === 1
        ? history.push(`/editions`)
        : history.push(`/editions/${state.editionId}`);
    } catch (err) {
      console.log(error);
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
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
        isLoading,
      }}
    >
      {children}
    </ComicsContext.Provider>
  );
};
