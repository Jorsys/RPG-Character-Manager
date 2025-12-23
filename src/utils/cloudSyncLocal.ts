import { Character } from '../types/types';

const FILE_NAME = 'rpg_characters.json';

// Verificar si la API está disponible
const isFileSystemAccessSupported = (): boolean => {
  return 'showDirectoryPicker' in window;
};

// --- Funciones de Sincronización Local ---

// Guardar personajes en un directorio seleccionado por el usuario
export const saveCharactersToDirectory = async (characters: Character[]): Promise<boolean> => {
  if (!isFileSystemAccessSupported()) {
    alert('La API de Acceso al Sistema de Archivos no es compatible con tu navegador.');
    return false;
  }

  try {
    // Pedir al usuario que seleccione un directorio
    // @ts-ignore - showDirectoryPicker aún puede no estar en los tipos de TS oficialmente
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
    });

    // Crear/Escribir el archivo
    const fileHandle = await dirHandle.getFileHandle(FILE_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    const content = JSON.stringify(characters, null, 2);
    await writable.write(content);
    await writable.close();

    console.log('Personajes guardados en el directorio seleccionado.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Operación de guardado cancelada por el usuario.');
    } else {
      console.error('Error al guardar en el directorio:', error);
    }
    return false;
  }
};

// Cargar personajes desde un directorio seleccionado por el usuario
export const loadCharactersFromDirectory = async (): Promise<Character[] | null> => {
  if (!isFileSystemAccessSupported()) {
    alert('La API de Acceso al Sistema de Archivos no es compatible con tu navegador.');
    return null;
  }

  try {
    // Pedir al usuario que seleccione un directorio
    // @ts-ignore
    const dirHandle = await window.showDirectoryPicker({
      mode: 'readwrite', // Necesitamos permiso de lectura
    });

    // Intentar obtener el archivo
    // @ts-ignore
    const fileHandle = await dirHandle.getFileHandle(FILE_NAME, { create: false });

    // Leer el contenido
    const file = await fileHandle.getFile();
    const content = await file.text();

    try {
      const characters: Character[] = JSON.parse(content);
      console.log('Personajes cargados desde el directorio seleccionado.');
      return characters;
    } catch (e) {
      console.error('Error al parsear el JSON:', e);
      return null;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Operación de carga cancelada por el usuario.');
    } else {
      console.error('Error al cargar desde el directorio:', error);
    }
    return null;
  }
};

// --- Proveedor de Sincronización Local ---
// Creamos un "proveedor" para mantener la abstracción
import { CloudProvider } from '../types/cloudTypes';

const localSyncProvider: CloudProvider = {
  name: 'Directorio Local',
  id: 'local-directory',

  isAuthenticated: (): boolean => {
    // No hay autenticación, pero se puede verificar si la API es compatible
    return isFileSystemAccessSupported();
  },

  authenticate: async (): Promise<void> => {
    // No se requiere autenticación OAuth, solo pedir permiso para acceder al directorio
    // La autenticación real ocurre cuando se llama a save/load y se pide el directorio
    if (!isFileSystemAccessSupported()) {
      throw new Error('La API no es compatible.');
    }
    // Podríamos pedir un directorio aquí para "autenticar", pero es más común hacerlo al guardar/cargar
    // Por ahora, simplemente verificamos la compatibilidad.
  },

  listFolders: async (): Promise<{ id: string; name: string }[]> => {
    // No se listan carpetas aquí, se pide una carpeta específica al guardar/cargar
    return [];
  },

  selectFolder: (_folderId: string): void => {
    // No se selecciona una carpeta previamente, se pide en el momento de save/load
    // Esta función no se usa con este proveedor
    console.warn('selectFolder no se usa con el proveedor local.');
  },

  saveData: async (characters: Character[]): Promise<boolean> => {
    return saveCharactersToDirectory(characters);
  },

  loadData: async (): Promise<Character[] | null> => {
    return loadCharactersFromDirectory();
  },

  signOut: async (): Promise<void> => {
    // No hay sesión que cerrar en este caso
    console.warn('signOut no se usa con el proveedor local.');
  },
};

export default localSyncProvider;