import axios from 'axios';

const SWAPI_BASE_URL = 'https://swapi.dev/api';
const SW_IMAGE_BASE_URL = 'https://starwars-visualguide.com/assets/img';

const characterNameCache: { [url: string]: string } = {};
const characterImageCache: { [url: string]: string | null } = {};

const fetchCharacterName = async (url: string) => {
    if (!url.startsWith('http')) {
        throw new Error(`Invalid character URL: ${url}`);
    }

    if (characterNameCache[url]) {
        return characterNameCache[url];
    }

    const response = await axios.get(url);
    const name = response.data.name;
    characterNameCache[url] = name;
    return name;
};

const fetchCharacterImage = async (characterUrl: string) => {
    const id = characterUrl.split('/').filter(Boolean).pop();
    const imageUrl = `${SW_IMAGE_BASE_URL}/characters/${id}.jpg`;

    if (characterImageCache[imageUrl] !== undefined) {
        return characterImageCache[imageUrl];
    }

    try {
        await axios.get(imageUrl);
        characterImageCache[imageUrl] = imageUrl;
        return imageUrl;
    } catch (error) {
        characterImageCache[imageUrl] = null;
        return null;
    }
};

export const findObjectTypeAndAssociatedCharacters = async (searchTerm: string) => {
    const endpoints = {
        planets: 'residents',
        films: 'characters',
        species: 'people',
        vehicles: 'pilots',
        starships: 'pilots',
    };

    const characters: { mainCategory: string; subCategory: string; url: string; name: string; image: string | null }[] = [];
    for (const [endpoint, characterValue] of Object.entries(endpoints)) {
        const response = await axios.get(`${SWAPI_BASE_URL}/${endpoint}/?search=${searchTerm}`);

        if (response.data.count > 0) {
        const objects = response.data.results;

        for (const object of objects) {
            const associatedCharacterUrls = object[characterValue];

            for (const url of associatedCharacterUrls) {
            const name = await fetchCharacterName(url);
            const image = await fetchCharacterImage(url);

            let subCategory = '';
            if (endpoint === 'films') {
                subCategory = object.title;
            } else if (endpoint === 'vehicles' || endpoint === 'starships') {
                subCategory = `${object.name} - ${object.model}`;
            } else {
                subCategory = object.name;
            }
            characters.push({ mainCategory: endpoint, subCategory: subCategory, url, name, image });
            }
        }
        }
    }

    characters.sort((a, b) => a.name.localeCompare(b.name));
    return characters;
};
