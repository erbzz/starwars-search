import React, { useState } from 'react';
import './App.css';
import { BounceLoader } from 'react-spinners';

const API_URL = 'http://localhost:6001';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [characters, setCharacters] = useState<Array<{ mainCategory: string; subCategory: string; name: string; url: string; image: string }>>([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/associated_characters?term=${searchTerm}`);
    const characters = await response.json();

    setCharacters(characters);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  const groupCharactersByCategory = (characters: Array<{ mainCategory: string; subCategory: string; name: string; url: string; image: string }>) => {
    const groupedCharacters: { [key: string]: { [key: string]: Array<{ name: string; url: string; image: string }> } } = {};

    characters.forEach((character) => {
      if (!groupedCharacters[character.mainCategory]) {
        groupedCharacters[character.mainCategory] = {};
      }
      if (!groupedCharacters[character.mainCategory][character.subCategory]) {
        groupedCharacters[character.mainCategory][character.subCategory] = [];
      }
      groupedCharacters[character.mainCategory][character.subCategory].push({ name: character.name, url: character.url, image: character.image });
    });

    return groupedCharacters;
  };

  const groupedCharacters = groupCharactersByCategory(characters);

  return (
    <div className="App">
      <h1>Star Wars Character Finder</h1>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter a term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={onSearch} disabled={loading}>
          {loading ? (
            <div style={{ display: 'inline-block', width: '100%', height: '100%' }}>
              <BounceLoader color={'#fff'} size={15} />
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
      {Object.entries(groupedCharacters).map(([mainCategory, subCategories]) => (
        <div key={mainCategory}>
          <h2>{mainCategory}</h2>
          {Object.entries(subCategories).map(([subCategory, characters]) => (
            <div key={subCategory}>
              <h3>{subCategory}</h3>
              <ul className="search-results">
                {characters.map((character) => (
                  <li key={character.url}>
                    <img src={character.image} alt={character.name} className="character-image" />
                    {character.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
