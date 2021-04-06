import { Fragment } from 'react';

const Image = ({ src, alt, className, setIsLoading, onClick }) => {
  return (
    <Fragment>
      <img
        onLoad={() => setIsLoading(false)}
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
      />
    </Fragment>
  );
};

export default Image;
