import { Fragment } from 'react';
import './Image.css';

const Image = ({ src, alt, className, setIsLoading }) => {
  return (
    <Fragment>
      <img
        onLoad={() => setIsLoading(false)}
        src={src}
        alt={alt}
        className={className}
      />
    </Fragment>
  );
};

export default Image;
