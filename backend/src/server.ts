import cors from 'cors';
import express from 'express';
import { findObjectTypeAndAssociatedCharacters } from './api';

const app = express();
const port = process.env.PORT || 6001;

app.use(cors());

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});

app.get('/associated_characters', async (req, res) => {
  const searchTerm = req.query.term;

  if (!searchTerm || typeof searchTerm !== 'string') {
    return res.status(400).json({ error: 'Invalid search term' });
  }

  try {
    const associatedCharacters = await findObjectTypeAndAssociatedCharacters(searchTerm);
    res.json(associatedCharacters);
  } catch (error) {
    console.error('Error fetching associated characters:', error);
    res.status(500).json({ error: 'Failed to fetch associated characters' });
  }
});
