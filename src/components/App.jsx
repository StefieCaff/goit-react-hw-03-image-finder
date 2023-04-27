//external imports
import { useEffect, useState } from "react";
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


// helper functions  
  const handlerSubmit = (query) => {
    setLoading(true);
    setImages([]);
    setQuery(query)
    setPage(1);
    console.log("submitted");
  };
  
  const handlerOpenModal = (url) => {
    setOpenModal(true);
    setLargeImageURL(url);
    console.log("modal open");
  };

  const handlerLoadMore = () => {
    setPage(prev => prev + 1);
    setLoading(true);
    setLoadMore(true);
    console.log("load more")
  };

  const handlerModalClose = () => {
    setOpenModal(false);
    setLargeImageURL('');
    console.log("modal close")
  };

  useEffect(() => {
    if (!query) return;

      const getGallery = async query => {
        try {
          const response = await getImages(query, page);
          setImages(prev => [...prev, ...response]);
          if (response.length < 1) {
            setImages([]);
            setLoadMore(false);
            Notify.failure('Sorry, there are no matching results found, please try another search.')
          }
          if (response.length > 0 && response.length < 12) {
            setLoading(false);
            setLoadMore(false);
            Notify.info(`Nice! there are ${response.length} images!`)
          }
          if (response.length === 12) {
            setLoading(true);
            setLoadMore(true);
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
      <Searchbar onSubmit={handlerSubmit} />
      <ImageGallery
        images={images}
        openModal={handlerOpenModal}
        loadMore={handlerLoadMore}
      />
      {''}
      {loading && <Loader />}
      {loadMore &&
        <Button loadMore={handlerLoadMore} />}
      {openModal && (
        <Modal
          largeImageURL={largeImageURL}
          modalClose={handlerModalClose}
        />
        )
      }
    </div>
  );
};
