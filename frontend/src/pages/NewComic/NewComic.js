import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useComicsContext } from '../../contexts/comicsContext';
import ImageUploader from '../../components/ImageUploader';
import './NewComic.css';

const NewComic = () => {
  const {
    register,
    handleSubmit,
    // watch, errors
  } = useForm();
  const { comicsList, addComic } = useComicsContext();
  const [label, setLabel] = useState('...');
  const [uniqueEditionIds, setUniqueEditionIds] = useState([]);
  const [radioInput, setRadioInput] = useState(false);
  const [picture, setPicture] = useState([]);
  const [logo, setLogo] = useState([]);

  const handleInputOption = e => {
    setLabel(e.target.value);
  };

  const onSubmit = data => {
    let newData;
    if (logo.length === 0 && data.editionId) {
      const existingTitle = comicsList.filter(
        c => c.editionId === data.editionId
      );
      newData = { ...data, img: picture[0], title: existingTitle[0].title };
    } else {
      newData = { ...data, img: picture[0], logo: logo[0] };
    }
    addComic(newData);
    console.log(newData);
  };

  useEffect(() => {
    const filtered = comicsList.filter(
      (v, i, a) => a.findIndex(t => t.editionId === v.editionId) === i
    );
    setUniqueEditionIds(filtered);
  }, [comicsList]);

  return (
    <div className='new-comic-form-container'>
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
            Ako strip ili edicija već postoje, odaberi iz padajućeg menija:
            <select
              value={label}
              name='editionId'
              onChange={handleInputOption}
              className='new-comic-input'
              ref={register}
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
                className='new-comic-input'
                ref={register}
              />
            </label>
            <label className='new-comic-label'>
              Logo (SVG u 600ppi sa transparentnom pozadinom):
              {/* <ImageUploader
                withIcon={true}
                onChange={onLogoDrop}
                imgExtension={['.png']}
                maxFileSize={5242880}
                name='newComicCover'
                singleImage={true}
              /> */}
              <ImageUploader setLogo={setLogo} logo={logo} pic={false} />
            </label>
          </Fragment>
        )}

        <label className='new-comic-label'>
          Broj:
          <input
            type='number'
            name='nr'
            className='new-comic-input'
            ref={register}
          />
        </label>

        <label className='new-comic-label'>
          Upload naslovnice:
          {/* <ImageUploader
            withIcon={true}
            onChange={onPicDrop}
            imgExtension={['.jpg', '.png']}
            maxFileSize={5242880}
            name='newComicCover'
            singleImage={true}
            withPreview={true}
          /> */}
          <ImageUploader setPicture={setPicture} picture={picture} pic={true} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};

export default NewComic;
