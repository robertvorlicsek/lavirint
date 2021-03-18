import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './NewComic.css';

const NewComic = () => {
  const {
    register,
    handleSubmit,
    formState,
    // watch, errors
  } = useForm({
    mode: 'onChange',
  });
  const {
    getComics,
    comicsList,
    addComic,
    message,
    errorMessage,
  } = useComicsContext();
  const { token } = useAuthContext();
  const [label, setLabel] = useState(undefined);
  const [nr, setNr] = useState(undefined);
  const [uniqueEditionIds, setUniqueEditionIds] = useState([]);
  const [radioInput, setRadioInput] = useState(false);
  const [picture, setPicture] = useState([]);
  const [logo, setLogo] = useState([]);
  const [isMessage, setIsMessage] = useState(false);

  const handleInputOption = e => {
    setLabel(e.target.value);
  };

  const onSubmit = data => {
    setIsMessage(true);
    if (logo.length === 0 && data.editionId && picture.length === 1) {
      const existingTitle = comicsList.filter(
        c => c.editionId === data.editionId
      );
      data.img = picture[0];
      data.title = existingTitle[0].title;
      data.logo = existingTitle[0].logo;
      data.cloudinaryLogoId = existingTitle[0].cloudinaryLogoId;
    } else if (picture.length === 1 && logo.length === 1) {
      data.img = picture[0];
      data.logo = logo[0];
    }
    if (data.logo) {
      addComic(data, token);
    }
  };

  useEffect(() => {
    getComics();
  }, [getComics]);

  useEffect(() => {
    if (comicsList) {
      const filtered = comicsList.filter(
        (v, i, a) => a.findIndex(t => t.editionId === v.editionId) === i
      );
      setUniqueEditionIds(filtered);
    }
  }, [comicsList]);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='new-comic-form-container'>
        <h1 className='new-comic-form-title'>Upload novog stripa</h1>
        <form className='new-comic-form' onSubmit={handleSubmit(onSubmit)}>
          <label className='new-comic-label radio'>
            U pitanju je nova edicija:
            <input
              type='radio'
              checked={radioInput}
              className='new-comic-input'
              onChange={() => {}}
              onClick={() => setRadioInput(i => !i)}
            />
          </label>
          {!radioInput ? (
            <label className='new-comic-label'>
              Ako edicija već postoji, odaberi iz padajućeg menija:
              <select
                value={label}
                name='editionId'
                onChange={handleInputOption}
                className='new-comic-input comic-form-hover new-comic-input-padding'
                ref={register({
                  required: true,
                })}
              >
                {uniqueEditionIds.map((c, i) => {
                  return (
                    <option key={i} id={i} value={c.editionId} name={c.title}>
                      {c.title}
                    </option>
                  );
                })}
              </select>
            </label>
          ) : (
            <Fragment>
              <label className='new-comic-label'>
                Ime stripa ili edicije:
                <input
                  type='text'
                  name='title'
                  className='new-comic-input comic-form-hover'
                  ref={register({
                    required: true,
                  })}
                />
              </label>
              <label className='new-comic-label'>
                Logo (SVG u 600ppi sa transparentnom pozadinom):
                <ImageUploader
                  register={register}
                  setLogo={setLogo}
                  logo={logo}
                  name='logo'
                  radioInput={radioInput}
                />
              </label>
            </Fragment>
          )}

          <label className='new-comic-label'>
            Broj:
            <input
              type='number'
              name='nr'
              onChange={e => setNr(e.target.value)}
              className='new-comic-input comic-form-hover'
              ref={register({
                required: true,
              })}
            />
          </label>

          <label className='new-comic-label pic'>
            Upload naslovnice:
            <ImageUploader
              register={register}
              setPicture={setPicture}
              picture={picture}
              name='img'
            />
          </label>
          <button
            disabled={
              formState.isSubmitting ||
              (radioInput && logo.length === 0) ||
              picture.length === 0 ||
              !nr
            }
            type='submit'
            value='Submit'
            className='new-comic-submit'
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default NewComic;
