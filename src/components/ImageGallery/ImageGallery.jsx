import { array, func } from 'prop-types';
// import { useState, useEffect, useRef } from 'react';

import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

const ImageGallery = (props) => {

    const {
        images,
        openModal,
    } = props;
    
//  const imgRef = useRef(null);
//   useEffect(() => {
//     imgRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [images]);
    
    return (
        
        
        <ul className="ImageGallery">
            
            {images.map(({ id, webformatURL, largeImageURL, tags }) => (
               
                <ImageGalleryItem
                    key={id}
                    webformatURL={webformatURL}
                    largeImageURL={largeImageURL}
                    openModal={openModal}
                    tags={tags}
                    /> 
            ))}
        </ul>
   
    );
};


ImageGallery.propTypes = {
    images: array.isRequired,
    openModal: func.isRequired,
};

export { ImageGallery };
