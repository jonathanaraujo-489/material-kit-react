import React from 'react';

const IMAGEM_PADRAO_URL = `${import.meta.env.BASE_URL}assets/sem-imagem.png`;

type ImagemComFallbackProps = {
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
};

const ImagemComFallback: React.FC<ImagemComFallbackProps> = ({
  src,
  alt = 'Imagem do produto',
  style = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  },
}) => {
  const handleImageError = (evento: React.SyntheticEvent<HTMLImageElement>) => {
    evento.currentTarget.onerror = null;
    evento.currentTarget.src = IMAGEM_PADRAO_URL;
  };

  return (
    <img
      src={src || IMAGEM_PADRAO_URL}
      alt={alt}
      onError={handleImageError}
      style={style}
    />
  );
};

export default ImagemComFallback;
