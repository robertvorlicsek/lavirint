import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import BackButton from '../../components/BackButton/BackButton';
import Image from '../../components/Image/Image';

import './UpdateComic.css';

const UpdateComic = () => {
  let { cid } = useParams();
  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const {
    comic,
    getComicByComicId,
    getComics,
    updateComic,
    comicsList,
    message,
    errorMessage,
    emptyMessages,
  } = useComicsContext();
  const { token } = useAuthContext();
  const [label, setLabel] = useState(undefined);
  // const [nr, setNr] = useState(undefined);
  const [uniqueEditionIds, setUniqueEditionIds] = useState([]);
  const [radioInput, setRadioInput] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [logo, setLogo] = useState([]);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submit, setSubmit] = useState(false);

  const handleInputOption = e => {
    setLabel(e.target.value);
  };

  const onSubmit = data => {
    if (submit) {
      setIsMessage(true);
      data.cid = comic.id;
      const newTitle = uniqueEditionIds.find(
        id => id.editionId === data.editionId
      );
      if (logo.length === 0 && data.editionId) {
        data.title = newTitle.title;
        data.logo = newTitle.logo;
        data.cloudinaryLogoId = newTitle.cloudinaryLogoId;
      }
      if (logo.length === 1) {
        data.logo = logo[0];
      }
      if (pictures.length === 3 && comic.imgs) {
        data.imgs = pictures;
        data.cloudinaryImgIds = comic.cloudinaryImgIds;
      }
      if (pictures.length < 3 && comic.imgs) {
        data.imgs = comic.imgs;
      }
      data.cloudinaryImgIds = comic.cloudinaryImgIds;

      if (data.logo) {
        updateComic(data, token);
      }
    }
  };

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    getComics();
    getComicByComicId(cid);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    comic,
    emptyMessages,
    errorMessage,
    message,
    getComicByComicId,
    getComics,
    cid,
  ]);

  useEffect(() => {
    if (comicsList.length > 0) {
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
      <div
        className='update-comic-form-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <BackButton />
        <h1 className='update-comic-form-title'>Edit stripa</h1>
        {comic.info && comic.id === cid && (
          <form className='update-comic-form' onSubmit={handleSubmit(onSubmit)}>
            <label className='update-comic-label radio'>
              U pitanju je nova edicija:
              <input
                type='radio'
                checked={radioInput}
                className='update-comic-input'
                onChange={() => {}}
                onClick={() => setRadioInput(i => !i)}
              />
            </label>
            {!radioInput ? (
              <label className='update-comic-label'>
                Ako edicija već postoji, odaberi iz padajućeg menija:
                <select
                  value={label}
                  name='editionId'
                  onChange={handleInputOption}
                  className='update-comic-input comic-form-hover update-comic-input-padding'
                  ref={register({
                    required: true,
                  })}
                >
                  {uniqueEditionIds.map((c, i) => {
                    return (
                      <option
                        key={i}
                        id={i}
                        selected={
                          comic.editionId === c.editionId && comic.editionId
                        }
                        value={c.editionId}
                        name={c.title}
                      >
                        {c.title}
                      </option>
                    );
                  })}
                </select>
              </label>
            ) : (
              <Fragment>
                <label className='update-comic-label'>
                  Ime stripa ili edicije:
                  <input
                    type='text'
                    name='title'
                    className='update-comic-input comic-form-hover'
                    ref={register({
                      required: true,
                    })}
                  />
                </label>
                <div className='old-logo-element'>
                  <p>Stari logo:</p>

                  <div className='comic-old-logo-element'>
                    <Image
                      src={comic.logo}
                      alt='old logo'
                      className='comic-old-logo'
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                </div>
                <label className='update-comic-label'>
                  Logo (SVG u 600ppi sa transparentnom pozadinom):
                  <ImageUploader
                    register={register}
                    setLogo={setLogo}
                    name='logo'
                    radioInput={radioInput}
                  />
                </label>
              </Fragment>
            )}

            <label className='update-comic-label'>
              Broj:
              <input
                type='number'
                name='nr'
                defaultValue={comic.nr}
                // onChange={e => setNr(e.target.value)}
                className='update-comic-input comic-form-hover'
                ref={register({
                  required: true,
                })}
              />
            </label>
            <label className='update-comic-label'>
              Godina Izdanja:
              <input
                defaultValue={comic.info.comicYear}
                type='text'
                name='comicYear'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Serijal:
              <input
                defaultValue={comic.info.comicSeries}
                type='text'
                name='comicSeries'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Scenario:
              <input
                defaultValue={comic.info.comicWriter}
                type='text'
                name='comicWriter'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Crtež:
              <input
                defaultValue={comic.info.comicArtist}
                type='text'
                name='comicArtist'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Naslovna strana:
              <input
                defaultValue={comic.info.comicTitleArtist}
                type='text'
                name='comicTitleArtist'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Originalni naslov:
              <input
                defaultValue={comic.info.comicOriginalTitle}
                type='text'
                name='comicOriginalTitle'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Broj originalne edicije:
              <input
                defaultValue={comic.info.comicOriginalNr}
                type='text'
                name='comicOriginalNr'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Zemlja:
              <input
                defaultValue={comic.info.comicOriginCountry}
                type='text'
                name='comicOriginCountry'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Format:
              <input
                defaultValue={comic.info.comicDimensions}
                type='text'
                name='comicDimensions'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Povez:
              <input
                defaultValue={comic.info.comicFinish}
                type='text'
                name='comicFinish'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Broj strana:
              <input
                defaultValue={comic.info.comicPageNr}
                type='text'
                name='comicPageNr'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='update-comic-label'>
              Boja:
              <input
                defaultValue={comic.info.comicColor}
                type='text'
                name='comicColor'
                className='update-comic-input comic-form-hover'
                ref={register}
              />
            </label>
            <label className='new-comic-label'>
              Preview stripa (tekst + link u formatu:{' '}
              {'Zavir: <a href="url ovde" style="color: yellow;">Ovde!</a>'}
              ):
              <textarea
                defaultValue={comic.info.comicPreview}
                className='update-comic-textarea comic-form-hover'
                ref={register}
                name='comicPreview'
                rows='5'
                cols='30'
              ></textarea>
            </label>
            <div className='old-preview-pics-element'>
              <p>Stare preview strane:</p>
              <div className='comic-old-preview-pics--container'>
                {comic.imgs &&
                  comic.imgs.map((url, i) => (
                    <div key={i} className='comic-old-preview-pic-element'>
                      <Image
                        src={url}
                        alt='old preview picture'
                        className='comic-old-preview'
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <label className='update-comic-label pic'>
              <p>
                {' '}
                Upload novih preview strana: &nbsp;
                <span style={{ color: 'yellow' }}>
                  (nije moguće zamenuti pojedinačne strane)
                </span>
              </p>
              <ImageUploader
                register={register}
                setPictures={setPictures}
                edit={true}
                name='imgs'
                text='Navuci sve 3 slike odjednom ili ih selektuj klikom'
              />
            </label>
            <button
              disabled={
                formState.isSubmitting ||
                pictures.length === 1 ||
                pictures.length === 2
              }
              type='submit'
              value='Submit'
              className='update-comic-submit'
              onClick={() => setSubmit(true)}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </Fragment>
  );
};

export default UpdateComic;
