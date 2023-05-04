//external imports
import { useEffect, useState, useRef } from "react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

//internal imports
import { getImages } from "api/api";

import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Modal } from "./Modal/Modal";
import { Loader } from "./Loader/Loader";



export const App = () => {
 // States
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [loadMore, setLoadMore] = useState(false);
  const [toTop, setToTop] = useState(false);

  /*helper functions*/
  
//scroll to bottom with load more
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [images]);
  
  const handleSubmit = (query) => {
    setLoading(true);
    setImages([]);
    setQuery(query)
    setPage(1);
  };
  
  const handleOpenModal = (url) => {
    setOpenModal(true);
    setLargeImageURL(url);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    setLoading(true);
    setLoadMore(true);
    setToTop(true);
  };

  const backToTop = () => {
    window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth",
          })
  }

  const handleModalClose = () => {
    setOpenModal(false);
    setLargeImageURL('');
  };

  useEffect(() => {
   
    if (!query) return;
    
    const getGallery = async query => {

        try {
          const response = await getImages(query, page);
          let imageData = response.data;
          let imageCount = imageData.hits.length;
          let imageTotal = imageData.totalHits;
          
            if( page === 42 ) {
              setImages(prev => [...prev, ...imageData.hits.slice(4)]);
            }
            else  if (Number.isInteger(imageTotal / imageCount) === true && page === (imageTotal / imageCount)){
              setImages(prev => [...prev, ...imageData.hits]);
              setLoadMore(false);
              return;
            }
            
            else {
              setImages(prev => [...prev, ...imageData.hits]);
            }
         
          if (imageCount === 0) {
            setImages([]);
            setLoadMore(false);
            setToTop(false);
            Notify.failure('Sorry, there are no matching images found, please try another search.')
            return;
          }

          if (imageCount < 12 && page === 1) {
            setLoading(false);
            setLoadMore(false);
            setToTop(false);
            Notify.success(`Woot! Maximum search value found, there are ${imageCount} images.`);
            return;
          }

          if (imageCount < 12) {
            setLoading(false);
            setLoadMore(false);
            setToTop(true);
            Notify.success(`Woot! Maximum search values found! We have ${imageCount} images.`);
            return;
          }
          
          if (page >= 2 && page <= 41) {
            setLoadMore(true);
            setToTop(true);
            return;
          }

          if (page === 42) {
            setToTop(true);
            setLoadMore(false);
            return;
          }

          if (imageTotal > 12) {
            setLoading(true);
            setLoadMore(true);
            setToTop(true);
            Notify.success(`Hooray! We found ${imageTotal} images.`);
            return;
          }

        }
        finally {
          setLoading(false);
        }
      };

    getGallery(query, page);
  }, [query, page]);
  

  return (
    <div>
      <Searchbar onSubmit={handleSubmit} />
      
      <ImageGallery
        images={images}
        openModal={handleOpenModal}
        loadMore={handleLoadMore}
      />
      <div ref={bottomRef}></div>
      {''}
      {loading && <Loader />}
      <div className="Center-buttons">
        {loadMore &&
          <Button clickHandler={handleLoadMore} text="Load More" />}
        {toTop &&
          <Button clickHandler={backToTop} text="To Top" />}
      </div>
      {openModal && (
        <Modal
          largeImageURL={largeImageURL}
          modalClose={handleModalClose}
        />
        )
      }
      
    </div>
  );
};
