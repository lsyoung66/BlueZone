import React, { useState } from 'react';
import './default.css';
import restaurantMap from './images/map1_1.png';
import restaurantMap2 from './images/map1_2.png';
import cafeMap from './images/map2_1.png';
import cafeMap2 from './images/map2_2.png';
import karaokeMap from './images/map3_1.png';
import karaokeMap2 from './images/map3_2.png';
import logo2 from './images/logo2.png';
import { FaBars } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import StatusBar from './StatusBar';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const locationCategoryMapping = {
  'cafe-location': 'cafe',
  'restaurant-location': 'restaurant',
  'karaoke-location': 'karaoke',
};
function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedLocation('');
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setSelectedCategory(locationCategoryMapping[location]);
  };

  const clickAgain = () => {
    setTimeout(() => {
      navigate('/Info')
    }, 200)
  }

  let mapImage;
  if (selectedCategory === 'cafe') {
    mapImage = selectedLocation === 'cafe-location' ? cafeMap2 : cafeMap;
    // if (mapImage == cafeMap2) {
    //   clickAgain()
    // }
  } else if (selectedCategory === 'restaurant') {
    mapImage = selectedLocation === 'restaurant-location' ? restaurantMap2 : restaurantMap;
  } else if (selectedCategory === 'karaoke') {
    mapImage = selectedLocation === 'karaoke-location' ? karaokeMap2 : karaokeMap;
  }

  let mapArea;
  if (selectedCategory === 'cafe') {
    mapArea = (
      <area target="_self" alt="cafe" title="cafe" coords="12,586,212,679" shape="rect"
        onClick={() => handleLocationClick('cafe-location')}
      />
    )
    if (selectedLocation === 'cafe-location') {
      mapArea = (
        <area target="_self" alt="cafe" title="cafe" coords="12,586,212,679" shape="rect"
          onClick={() => clickAgain()}
        />
      );
    }
  } else if (selectedCategory === 'restaurant') {
    mapArea = (
      <area target="_self" alt="restaurant" title="restaurant" coords="125,376,394,272" shape="rect"
        onClick={() => handleLocationClick('restaurant-location')}
      />
    );
  } else if (selectedCategory === 'karaoke') {
    mapArea = (
      <area target="_self" alt="karaoke" title="karaoke" coords="224,359,418,437" shape="rect"
        onClick={() => handleLocationClick('karaoke-location')}
      />
    );
  }

  const handleNavOpen = () => {
    setIsOpen(true);
  };

  const handleNavClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className='container'>
        <img src={mapImage} alt='map' useMap="#image-map" />
        <map name="image-map">
          {mapArea}
          <area target="" alt="myLocation" title="myLocation" href="#" coords="470,911,100" shape="circle" />
        </map>

        <StatusBar />

        <div className="header">
          <button className="nav-button" onClick={handleNavOpen}>
            <FaBars />
          </button>
          <img src={logo2} alt="logo2" className="logo2" />
        </div>

        <div className='categoryButton'>
          <button className={selectedCategory === 'restaurant' ? 'selected' : 'restaurant'} category="음식점" onClick={() => handleCategoryClick('restaurant')}>
            음식점
          </button>
          <button className={selectedCategory === 'cafe' ? 'selected' : 'cafe'} category="카페" onClick={() => handleCategoryClick('cafe')}>
            카페
          </button>
          <button className={selectedCategory === 'karaoke' ? 'selected' : 'karaoke'} category="노래방" onClick={() => handleCategoryClick('karaoke')}>
            노래방
          </button>
          <button className='others'>+</button>
          <input className='search'
            type='text'
            placeholder="  검색할 업체를 입력하세요."
            value=''
          />
          <button className='searchButton'>
            <BiSearch />
          </button>
        </div>
      </div>
      <Navigation isOpen={isOpen} onClose={handleNavClose} />


      {/* <div>
              <h1>{`환영합니다, ${username}님`}</h1>
              <button onClick={handleLogout}>로그아웃</button>
            </div> */}

    </>
  );
}

export default Main;