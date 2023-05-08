import React from 'react';

interface Character {
  name: string;
  [key: string]: any;
}

interface CharacterDetailsProps {
  character: Character;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character }) => {
  return (
    <div>
      <h2>{character.name}</h2>
    </div>
  );
};

export default CharacterDetails;
