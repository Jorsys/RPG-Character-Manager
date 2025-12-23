import { Character } from '../types/types';

// NOTA: Este archivo contiene funciones de ejemplo para interactuar con Google Drive.
// La autenticación OAuth y la selección de carpeta se deben manejar en otro componente,
// y los tokens de acceso deben pasarse a estas funciones.
// No se incluye aquí la lógica completa de autenticación de Google para no extenderse de más.

const FILE_NAME = 'rpg_characters.json';

// --- Funciones de ejemplo para la nube (requieren token de acceso) ---
// Función para guardar personajes en Google Drive
export const saveCharactersToCloud = async (characters: Character[], accessToken: string, folderId: string): Promise<boolean> => {
  try {
    // 1. Buscar si el archivo ya existe en la carpeta
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and parents in '${folderId}' and trashed=false`;
    const searchResponse = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const searchResult = await searchResponse.json();
    let fileId: string | null = null;

    if (searchResult.files && searchResult.files.length > 0) {
      fileId = searchResult.files[0].id; // Si existe, obtenemos su ID
    }

    // 2. Preparar el contenido del archivo
    const content = JSON.stringify(characters, null, 2);
    const blob = new Blob([content], { type: 'application/json' });

    let uploadUrl: string;
    let method: string;

    if (fileId) {
      // Actualizar archivo existente
      uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      method = 'PATCH';
    } else {
      // Crear archivo nuevo
      const metadata = {
        name: FILE_NAME,
        mimeType: 'application/json',
        parents: [folderId],
      };
      const metadataResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      const metadataResult = await metadataResponse.json();
      fileId = metadataResult.id;
      if (!fileId) {
        console.error('No se pudo obtener el ID del archivo nuevo.');
        return false;
      }
      uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      method = 'PUT';
    }

    // 3. Subir el contenido
    const uploadResponse = await fetch(uploadUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: blob,
    });

    if (uploadResponse.ok) {
      console.log('Personajes guardados en Google Drive exitosamente.');
      return true;
    } else {
      console.error('Error al subir a Google Drive:', await uploadResponse.text());
      return false;
    }
  } catch (error) {
    console.error('Error en saveCharactersToCloud:', error);
    return false;
  }
};

// Función para cargar personajes desde Google Drive
export const loadCharactersFromCloud = async (accessToken: string, folderId: string): Promise<Character[]> => {
  try {
    // 1. Buscar el archivo
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and parents in '${folderId}' and trashed=false`;
    const searchResponse = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const searchResult = await searchResponse.json();

    if (!searchResult.files || searchResult.files.length === 0) {
      console.log('No se encontró el archivo en Google Drive. Se inicia con lista vacía.');
      return [];
    }

    const fileId = searchResult.files[0].id;

    // 2. Descargar el contenido del archivo
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const downloadResponse = await fetch(downloadUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (downloadResponse.ok) {
      const content = await downloadResponse.text();
      try {
        const characters: Character[] = JSON.parse(content);
        console.log('Personajes cargados desde Google Drive.');
        return characters;
      } catch (e) {
        console.error('Error al parsear el JSON descargado:', e);
        return [];
      }
    } else {
      console.error('Error al descargar de Google Drive:', await downloadResponse.text());
      return [];
    }
  } catch (error) {
    console.error('Error en loadCharactersFromCloud:', error);
    return [];
  }
};

// --- Funciones para manejar la carpeta de destino en Google Drive ---
// Esta función puede usarse para obtener la lista de carpetas y permitir al usuario elegirla
export const listFoldersInDrive = async (accessToken: string): Promise<{ id: string; name: string }[]> => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      return data.files.map((folder: any) => ({ id: folder.id, name: folder.name }));
    } else {
      console.error('Error al listar carpetas:', await response.text());
      return [];
    }
  } catch (error) {
    console.error('Error en listFoldersInDrive:', error);
    return [];
  }
};