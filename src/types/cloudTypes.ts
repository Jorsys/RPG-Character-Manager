import { Character } from './types';

export interface CloudProvider {
  // Nombre del proveedor (para mostrar al usuario)
  name: string;
  // URL o identificador único del proveedor
  id: string;
  // Indica si el usuario está autenticado
  isAuthenticated: () => boolean;
  // Iniciar el proceso de autenticación
  authenticate: () => Promise<void>;
  // Obtener una lista de carpetas disponibles para guardar
  listFolders: () => Promise<{ id: string; name: string }[]>;
  // Seleccionar una carpeta específica para sincronizar
  selectFolder: (folderId: string) => void;
  // Guardar datos (en este caso, personajes) en la carpeta seleccionada
  saveData: (data: Character[]) => Promise<boolean>;
  // Cargar datos (personajes) desde la carpeta seleccionada
  loadData: () => Promise<Character[] | null>;
  // Desautenticar al usuario
  signOut: () => Promise<void>;
}