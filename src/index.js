import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './js/pixabay-api';
import { createMarkup } from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const galleryWrapper = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

form.addEventListener('submit', onSubmit);
const gallery = new SimpleLightbox('.gallery a');

let searchData;
let page = 1;

async function onSubmit(evt) {
  try {
    evt.preventDefault();
    galleryWrapper.innerHTML = '';
    page = 1;

    searchData = form.elements.searchQuery.value.trim();
    if (searchData === '') {
      Notify.failure('Invalid data. Please put valid data into input!');
      return;
    } else {
      const { hits, totalHits } = await getImages(searchData);
      if (totalHits === 0) {
        Notify.failure(
          "We're sorry, but we haven't found anything upon your request."
        );
        return;
      }
      Notify.success(`Hooray! We found ${totalHits} images`);
      galleryWrapper.innerHTML = createMarkup(hits);
      gallery.refresh();
      evt.target.reset();
      observer.observe(guard);
    }
  } catch (err) {
    Notify.failure('Invalid data. Please put valid data into input!');
    console.log(err);
  }
}

async function getMoreImages() {
  try {
    page += 1;
    const { hits, totalHits } = await getImages(searchData, page);
    galleryWrapper.insertAdjacentHTML('beforeend', createMarkup(hits));
    gallery.refresh();
    if (hits.length < 40) {
      observer.unobserve(guard);
    }
    if (page > 40) {
      setTimeout(() => {
        Notify.failure("You've reached the end of search results.");
      }, 1000);
    }
  } catch (err) {
    console.log(err);
    Notify.failure("You've reached the end of search results.");
  }
}

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 0,
};

let observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries, observer) {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      await getMoreImages();
    }
  }
}
