import { Fragment } from 'react';

const Image = ({ src, alt, className, setIsLoading, onClick, style }) => {
  return (
    <Fragment>
      <img
        onLoad={() => setIsLoading(false)}
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        style={style}
      />
    </Fragment>
  );
};

export default Image;
