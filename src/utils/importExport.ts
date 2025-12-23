import { Character } from '../types/types';

// --- Funciones para Exportar ---

// Exportar un solo personaje a JSON
export const exportCharacterToJson = (character: Character): string => {
  return JSON.stringify(character, null, 2);
};

// Exportar una lista de personajes a JSON
export const exportCharactersToJson = (characters: Character[]): string => {
  return JSON.stringify(characters, null, 2);
};

// --- Funciones para Importar ---

// Importar un solo personaje desde JSON
export const importCharacterFromJson = (jsonString: string): Character | null => {
  try {
    const parsed = JSON.parse(jsonString);
    // Validar que el objeto tenga la estructura mínima de un Character
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
      // Podríamos hacer validaciones más estrictas aquí con una librería como Zod o Joi
      // Por ahora, asumimos que el JSON tiene el formato correcto
      return parsed as Character;
    } else {
      console.error('El JSON no tiene la estructura de un personaje válida.');
      return null;
    }
  } catch (error) {
    console.error('Error al parsear el JSON del personaje:', error);
    return null;
  }
};

// Importar una lista de personajes desde JSON
export const importCharactersFromJson = (jsonString: string): Character[] | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      // Validar que cada elemento sea un Character
      const characters: Character[] = [];
      for (const item of parsed) {
        if (item && typeof item === 'object' && item.id && item.name) {
          characters.push(item as Character);
        } else {
          console.error('Un elemento en el array no tiene la estructura de un personaje válido:', item);
          return null; // Si un ítem es inválido, rechazamos todo el array
        }
      }
      return characters;
    } else {
      console.error('El JSON no tiene la estructura de un array de personajes válida.');
      return null;
    }
  } catch (error) {
    console.error('Error al parsear el JSON de los personajes:', error);
    return null;
  }
};

// --- Funciones para manejar archivos (File API) ---

// Crear un Blob con el contenido JSON
export const createJsonBlob = (content: string): Blob => {
  return new Blob([content], { type: 'application/json' });
};

// Crear un enlace y simular click para descargar un archivo Blob
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Leer un archivo como texto
export const readJsonFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('No se pudo leer el archivo como texto.'));
      }
    };
    reader.onerror = (_e) => {
      reject(new Error(`Error al leer el archivo: ${reader.error?.message || 'Desconocido'}`));
    };
    reader.readAsText(file);
  });
};