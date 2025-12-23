import React, { useState, ChangeEvent } from 'react';
import { Character } from '../../types/types';
import { exportCharactersToJson, importCharactersFromJson, createJsonBlob, downloadBlob, readJsonFile } from '../../utils/importExport';

interface ImportExportModalProps {
  characters: Character[];
  onImport: (importedCharacters: Character[]) => void;
  onClose: () => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ characters, onImport, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importOption, setImportOption] = useState<'replace' | 'merge'>('merge'); // 'replace' o 'merge'
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null); // Limpiar error al seleccionar archivo
    }
  };

  const handleExport = () => {
    if (characters.length === 0) {
      setError('No hay personajes para exportar.');
      return;
    }
    const jsonContent = exportCharactersToJson(characters);
    const blob = createJsonBlob(jsonContent);
    downloadBlob(blob, 'rpg_characters.json');
    onClose(); // Cerrar el modal tras la exportación
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo para importar.');
      return;
    }

    try {
      const fileContent = await readJsonFile(selectedFile);
      const importedChars = importCharactersFromJson(fileContent);

      if (!importedChars) {
        setError('No se pudieron leer los personajes del archivo. Formato incorrecto.');
        return;
      }

      if (importOption === 'replace') {
        // Reemplazar la lista completa
        onImport(importedChars);
      } else { // 'merge'
        // Combinar, evitando duplicados por ID
        const existingIds = new Set(characters.map(c => c.id));
        const newCharacters = importedChars.filter(c => !existingIds.has(c.id));
        onImport([...characters, ...newCharacters]);
      }
      onClose(); // Cerrar el modal tras la importación exitosa
    } catch (err) {
      console.error('Error al importar archivo:', err);
      setError('Ocurrió un error al leer el archivo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4">Importar / Exportar Personajes</h3>

        {error && <p className="text-error mb-4">{error}</p>}

        <div className="mb-6">
          <h4 className="font-semibold text-text-primary mb-2">Exportar</h4>
          <p className="text-sm text-text-secondary mb-3">Descarga una copia de tus personajes actuales.</p>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Exportar Personajes (.json)
          </button>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-2">Importar</h4>
          <p className="text-sm text-text-secondary mb-3">Selecciona un archivo .json para importar personajes.</p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full mb-3"
          />
          {selectedFile && (
            <p className="text-sm text-text-secondary mb-2">Archivo seleccionado: {selectedFile.name}</p>
          )}
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="merge"
              name="importOption"
              value="merge"
              checked={importOption === 'merge'}
              onChange={() => setImportOption('merge')}
              className="mr-2"
            />
            <label htmlFor="merge" className="text-sm">Combinar con personajes existentes</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="replace"
              name="importOption"
              value="replace"
              checked={importOption === 'replace'}
              onChange={() => setImportOption('replace')}
              className="mr-2"
            />
            <label htmlFor="replace" className="text-sm">Reemplazar todos los personajes</label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;