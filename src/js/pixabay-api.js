import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '39158900-f9ebc7a1e27be347df28dfb3a';

async function getImages(searchData, page = 1) {
  const params = new URLSearchParams({
    key: '39158900-f9ebc7a1e27be347df28dfb3a',
    q: searchData,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
    page: `${page}`,
  });
  const { data } = await axios.get(`${BASE_URL}?${params}`);
  return data;
}

export { getImages };
