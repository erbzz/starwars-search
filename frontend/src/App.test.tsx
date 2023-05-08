import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

import '@testing-library/jest-dom';

test('renders Star Wars Character Finder title', () => {
  render(<App />);
  const title = screen.getByText(/Star Wars Character Finder/i);
  expect(title).toBeInTheDocument();
});

test('search input field exists and can be typed into', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a term/i);
  fireEvent.change(input, { target: { value: 'Yoda' } });
  expect(input).toHaveValue('Yoda');
});

test('search button exists and is clickable', async () => {
  render(<App />);
  const searchButton = screen.getByText(/Search/i);
  fireEvent.click(searchButton);
  await waitFor(() => {
    expect(searchButton).toBeDisabled();
  });
});
