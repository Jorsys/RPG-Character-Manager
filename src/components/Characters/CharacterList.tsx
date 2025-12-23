import React, { useState } from 'react';
import { Character } from '../../types/types';
import ImportExportModal from './ImportExportModal'; // Importar el nuevo componente

interface CharacterListProps {
  characters: Character[];
  onSelectCharacter: (id: string) => void;
  onAddCharacter: () => void;
  onImportCharacters: (importedCharacters: Character[]) => void; // Función para manejar la importación
  onExportCharacters: () => void; // No necesariamente se usa aquí, pero puede ser útil para el padre
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onSelectCharacter,
  onAddCharacter,
  onImportCharacters,
}) => {
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mis Personajes</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportExportModal(true)}
            className="px-3 py-1 bg-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Importar/Exportar
          </button>
          <button
            onClick={onAddCharacter}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            + Añadir Nuevo
          </button>
        </div>
      </div>

      {characters.length === 0 ? (
        <p className="text-center text-text-secondary">No hay personajes creados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelectCharacter(character.id)}
              className="p-4 bg-card rounded-lg shadow-md border border-border cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="flex items-center mb-2">
                {character.image ? (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-12 h-12 rounded-full object-cover mr-3 border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                    <span className="text-text-secondary text-lg">?</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-text-primary">{character.name}</h3>
                  <p className="text-sm text-text-secondary">{character.race} - {character.class} (Nv. {character.level})</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary truncate">Alias: {character.alias}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Importar/Exportar */}
      {showImportExportModal && (
        <ImportExportModal
          characters={characters}
          onImport={onImportCharacters}
          onClose={() => setShowImportExportModal(false)}
        />
      )}
    </div>
  );
};

export default CharacterList;