
import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'objects',
    icon: '📦',
    translations: {
      en: { name: 'Objects', words: ['Toaster', 'Sunglasses', 'Hammer', 'Bicycle', 'Piano', 'Backpack', 'Umbrella', 'Telescope', 'Lamp', 'Compass'] },
      pt: { name: 'Objetos', words: ['Torradeira', 'Óculos de Sol', 'Martelo', 'Bicicleta', 'Piano', 'Mochila', 'Guarda-chuva', 'Telescópio', 'Lâmpada', 'Bússola'] },
      es: { name: 'Objetos', words: ['Tostadora', 'Gafas de Sol', 'Martillo', 'Bicicleta', 'Piano', 'Mochila', 'Paraguas', 'Telescopio', 'Lámpara', 'Brújula'] }
    }
  },
  {
    id: 'places',
    icon: '📍',
    translations: {
      en: { name: 'Places', words: ['Airport', 'Library', 'Amusement Park', 'Gym', 'Museum', 'Hospital', 'Zoo', 'Beach', 'Casino', 'Space Station'] },
      pt: { name: 'Lugares', words: ['Aeroporto', 'Biblioteca', 'Parque de Diversões', 'Academia', 'Museu', 'Hospital', 'Zoológico', 'Praia', 'Cassino', 'Estação Espacial'] },
      es: { name: 'Lugares', words: ['Aeropuerto', 'Biblioteca', 'Parque de Atracciones', 'Gimnasio', 'Museo', 'Hospital', 'Zoológico', 'Playa', 'Casino', 'Estación Espacial'] }
    }
  },
  {
    id: 'animals',
    icon: '🦁',
    translations: {
      en: { name: 'Animals', words: ['Elephant', 'Penguin', 'Giraffe', 'Kangaroo', 'Octopus', 'Honeybee', 'Shark', 'Chameleon', 'Platypus', 'Sloth'] },
      pt: { name: 'Animais', words: ['Elefante', 'Pinguim', 'Girafa', 'Canguru', 'Polvo', 'Abelha', 'Tubarão', 'Camaleão', 'Ornitorrinco', 'Preguiça'] },
      es: { name: 'Animales', words: ['Elefante', 'Pingüino', 'Girafa', 'Canguro', 'Pulpo', 'Abeja', 'Tiburón', 'Camaleón', 'Ornitorrinco', 'Perezoso'] }
    }
  },
  {
    id: 'food',
    icon: '🍕',
    translations: {
      en: { name: 'Food', words: ['Spaghetti', 'Sushi', 'Hamburger', 'Croissant', 'Taco', 'Pineapple', 'Chocolate', 'Donut', 'Pancake', 'Popcorn'] },
      pt: { name: 'Comida', words: ['Espaguete', 'Sushi', 'Hambúrguer', 'Croissant', 'Taco', 'Abacaxi', 'Chocolate', 'Donut', 'Panqueca', 'Pipoca'] },
      es: { name: 'Comida', words: ['Espagueti', 'Sushi', 'Hamburguesa', 'Cruasán', 'Taco', 'Piña', 'Chocolate', 'Donut', 'Panqueque', 'Palomitas'] }
    }
  },
  {
    id: 'jobs',
    icon: '💼',
    translations: {
      en: { name: 'Jobs', words: ['Firefighter', 'Astronaut', 'Chef', 'Surgeon', 'Detective', 'Librarian', 'Pilot', 'Artist', 'Judge', 'Gardener'] },
      pt: { name: 'Profissões', words: ['Bombeiro', 'Astronauta', 'Chef', 'Cirurgião', 'Detetive', 'Bibliotecário', 'Piloto', 'Artista', 'Juiz', 'Jardineiro'] },
      es: { name: 'Trabajos', words: ['Bombero', 'Astronauta', 'Chef', 'Cirujano', 'Detective', 'Bibliotecario', 'Piloto', 'Artista', 'Juez', 'Gardener'] }
    }
  }
];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 15;
