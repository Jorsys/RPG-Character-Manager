import { Character } from '../types/types';

const STORAGE_KEY = 'rpg_characters';

// Cargar personajes desde el almacenamiento local
export const loadCharactersFromLocal = (): Character[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error al parsear los datos de personajes desde localStorage:', e);
      return [];
    }
  }
  return [];
};

// Guardar personajes en el almacenamiento local
export const saveCharactersToLocal = (characters: Character[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (e) {
    console.error('Error al guardar los personajes en localStorage:', e);
  }
};

// Función para añadir un nuevo personaje
export const addCharacterToLocal = (newCharacter: Character): void => {
  const characters = loadCharactersFromLocal();
  // Validar que no exista un personaje con el mismo nombre
  if (characters.some(c => c.name === newCharacter.name)) {
    throw new Error('Ya existe un personaje con este nombre.');
  }
  const updatedCharacters = [...characters, newCharacter];
  saveCharactersToLocal(updatedCharacters);
};

// Función para actualizar un personaje existente
export const updateCharacterInLocal = (updatedCharacter: Character): void => {
  const characters = loadCharactersFromLocal();
  const index = characters.findIndex(c => c.id === updatedCharacter.id);
  if (index !== -1) {
    characters[index] = updatedCharacter;
    saveCharactersToLocal(characters);
  }
};

// Función para eliminar un personaje
export const deleteCharacterFromLocal = (id: string): void => {
  const characters = loadCharactersFromLocal();
  const updatedCharacters = characters.filter(c => c.id !== id);
  saveCharactersToLocal(updatedCharacters);
};