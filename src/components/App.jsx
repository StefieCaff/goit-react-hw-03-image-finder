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


  /*helper functions*/
  
// scroll to bottom with load more
  // const bottomRef = useRef(null);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [images]);
  
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
  };

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

          setImages(prev => [...prev, ...imageData.hits]);
          console.log(imageData.totalHits);

          if (imageData.hits.length === 0) {
            setImages([]);
            setLoadMore(false);
            Notify.failure('Sorry, there are no matching images found, please try another search.')
            return;
          }
          if (imageData.hits.length < 12) {
            setLoading(false);
            setLoadMore(false);
            Notify.success(`Woot! Maximum search values found! We have ${imageData.hits.length} images.`);
            return;
          }
          
          if (page >= 2 && page <= 40) {
            setLoadMore(true);
            return;
          }

          if (page === 41) {
            // setImages([imageData.hits.slice(20)]);
            setLoadMore(false);
            return;
          }

          if (imageData.totalHits > 12) {
            setLoading(true);
            setLoadMore(true);
            Notify.success(`Hooray! We found ${imageData.totalHits} images.`);
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
      {''}
      {loading && <Loader />}
      {loadMore &&
        <Button loadMore={handleLoadMore} />}
      {openModal && (
        <Modal
          largeImageURL={largeImageURL}
          modalClose={handleModalClose}
        />
        )
      }
      {/* <div ref={bottomRef}></div> */}
    </div>
  );
};
