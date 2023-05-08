import axios from 'axios';
import { findObjectTypeAndAssociatedCharacters } from '../src/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('findObjectTypeAndAssociatedCharacters', () => {
    it('returns an empty list when no results are found', async () => {
        mockedAxios.get.mockResolvedValue({ data: { count: 0 } });

        const characters = await findObjectTypeAndAssociatedCharacters('nonexistent');

        expect(characters).toEqual([]);
    });

    it('returns a list of characters when results are found', async () => {
        mockedAxios.get.mockResolvedValueOnce({
        data: {
            count: 1,
            results: [
            {
                name: 'Alderaan',
                residents: [
                    'https://swapi.dev/api/people/5/',
                    'https://swapi.dev/api/people/68/',
                    'https://swapi.dev/api/people/81/',
                ],
            },
            ],
        },
        });
    
        mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Leia Organa' } });
        mockedAxios.get.mockResolvedValueOnce({ status: 200 });
        mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Bail Prestor Organa' } });
        mockedAxios.get.mockResolvedValueOnce({ status: 200 });
        mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Raymus Antilles' } });
        mockedAxios.get.mockResolvedValueOnce({ status: 200 });
    
        const searchTerm = 'alderaan';
        const characters = await findObjectTypeAndAssociatedCharacters(searchTerm);

        expect(characters).toEqual([
            {
                mainCategory: 'planets',
                subCategory: 'Alderaan',
                url: 'https://swapi.dev/api/people/68/',
                name: 'Bail Prestor Organa',
                image: 'https://starwars-visualguide.com/assets/img/characters/68.jpg',
            },
            {
                mainCategory: 'planets',
                subCategory: 'Alderaan',
                url: 'https://swapi.dev/api/people/5/',
                name: 'Leia Organa',
                image: 'https://starwars-visualguide.com/assets/img/characters/5.jpg',
            },
            {
                mainCategory: 'planets',
                subCategory: 'Alderaan',
                url: 'https://swapi.dev/api/people/81/',
                name: 'Raymus Antilles',
                image: 'https://starwars-visualguide.com/assets/img/characters/81.jpg',
            },
        ]);
    });
});
