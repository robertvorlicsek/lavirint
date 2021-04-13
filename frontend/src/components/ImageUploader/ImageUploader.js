import { useState, useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import './ImageUploader.css';

const ImageUploader = ({
  setPictures,
  setLogo,
  setPromoPicture,
  setBackgroundPicture,
  setMenuBackgroundPicture,
  register,
  name,
  radioInput,
}) => {
  const [images, setImage] = useState([]);
  const maxNumber = name === 'imgs' ? 3 : 1;
  const onChange = (imageList, addUpdateIndex) => {
    setImage(imageList);
  };

  useEffect(() => {
    if (name === 'imgs') {
      setPictures(images);
    } else if (name === 'logo') {
      setLogo(images);
    } else if (name === 'promoImg') {
      setPromoPicture(images);
    } else if (name === 'backgroundImg') {
      setBackgroundPicture(images);
    } else if (name === 'menuBackgroundImg') {
      setMenuBackgroundPicture(images);
    }
  }, [
    images,
    name,
    setPictures,
    setLogo,
    setPromoPicture,
    setBackgroundPicture,
    setMenuBackgroundPicture,
  ]);

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey='data_url'
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => {
          if (errors) {
            return (
              <div>
                {errors.maxNumber && (
                  <span>Number of selected images exceed maxNumber</span>
                )}
              </div>
            );
          }
          return (
            // write your building UI
            <div className='upload__image-wrapper'>
              {imageList.length === 0 && (
                <button
                  ref={
                    name === 'imgs' || radioInput
                      ? register({ required: true })
                      : register
                  }
                  name={name}
                  style={
                    isDragging
                      ? {
                          fontWeight: '700',
                          backgroundColor: 'rgb(120,180,120)',
                          color: 'white',
                        }
                      : undefined
                  }
                  className='upload__image-button upload__image-button_field'
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Navuci sliku ili klikni ovde!
                </button>
              )}
              &nbsp;
              {imageList.map((images, index) => (
                <div key={index} className='image-item'>
                  <img
                    src={images['data_url']}
                    alt=''
                    style={
                      name === 'backgroundImg'
                        ? { width: '100%', border: '1px solid white' }
                        : null
                    }
                  />
                  <div className='image-item__btn-wrapper'>
                    <button
                      className='upload__image-button update'
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
