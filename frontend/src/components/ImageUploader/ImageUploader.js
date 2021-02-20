import { useState, useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import './ImageUploader.css';

const ImageUploader = ({ setPicture, setLogo, register, name, radioInput }) => {
  const [image, setImage] = useState([]);
  const maxNumber = 1;
  const onImageChange = (imageList, addUpdateIndex) => {
    setImage(imageList);
  };

  useEffect(() => {
    if (name === 'img') {
      setPicture(image);
    } else if (name === 'logo') {
      setLogo(image);
    }
  }, [image, name, setPicture, setLogo]);

  return (
    <div className='App'>
      <ImageUploading
        multiple
        value={image}
        onChange={onImageChange}
        maxNumber={maxNumber}
        dataURLKey='data_url'
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
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
                    name === 'img' || radioInput
                      ? register({ required: true })
                      : register
                  }
                  // onSubmit={e => e.preventDefault()}
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
              {imageList.map((image, index) => (
                <div key={index} className='image-item'>
                  <img src={image['data_url']} alt='' width='100' />
                  <div className='image-item__btn-wrapper'>
                    <button
                      className='upload__image-button update'
                      onClick={() => onImageUpdate(index)}
                    >
                      Update
                    </button>
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
