import React, { useState, useEffect } from 'react';
import LoginPage from '../components/Login/LoginPage';
import CharacterList from '../components/Characters/CharacterList';
import CharacterSheet from '../components/Characters/CharacterSheet';
import CharacterCreation from '../components/Characters/CharacterCreation';
import ThemeToggle from '../components/Common/ThemeToggle';
import { Character } from '../types/types';
import { loadCharactersFromLocal, saveCharactersToLocal } from '../utils/storage';
import localSyncProvider from '../utils/cloudSyncLocal'; // Importar el nuevo proveedor

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [cloudProviderId, setCloudProviderId] = useState<string | null>(null); // ID del proveedor seleccionado
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
  const [isCreatingOrEditing, setIsCreatingOrEditing] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Cargar preferencia de tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'medieval')) {
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'medieval'; // Tema por defecto
    }
  }, []);

  // Cargar personajes según el tipo de almacenamiento al iniciar sesión
  useEffect(() => {
    if (isLoggedIn) {
      loadCharacters();
    }
  }, [isLoggedIn, useCloud, cloudProviderId]);

  // Guardar personajes cuando cambian, según el tipo de almacenamiento
  useEffect(() => {
    if (isLoggedIn && !useCloud) { // Solo guardar localmente si no se usa la nube
      saveCharactersToLocal(characters);
    }
  }, [characters, isLoggedIn, useCloud]);

  const loadCharacters = async () => {
    if (useCloud && cloudProviderId === 'local-directory') {
      // Usar el proveedor local
      const loadedChars = await localSyncProvider.loadData();
      if (loadedChars) {
        setCharacters(loadedChars);
      } else {
        // Si falla la carga de la nube, inicializar con lista vacía o la del local
        setCharacters(loadCharactersFromLocal());
      }
    } else {
      // Usar almacenamiento local
      const savedChars = loadCharactersFromLocal();
      setCharacters(savedChars);
    }
  };

  const saveCharacters = async (chars: Character[]) => {
    if (useCloud && cloudProviderId === 'local-directory') {
      // Usar el proveedor local
      const success = await localSyncProvider.saveData(chars);
      if (!success) {
        console.error('Fallo al guardar en directorio local.');
        // Opcional: Mostrar un mensaje al usuario
      }
    } else {
      // Usar almacenamiento local
      saveCharactersToLocal(chars);
    }
  };

  const handleLogin = (cloud: boolean, providerId?: string) => {
    setUseCloud(cloud);
    if (providerId) {
      setCloudProviderId(providerId);
    }
    setIsLoggedIn(true);
  };

  const handleAddCharacter = () => {
    setEditingCharacter(null);
    setIsCreatingOrEditing(true);
  };

  const handleEditCharacter = (id: string) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      setEditingCharacter(character);
      setIsCreatingOrEditing(true);
    }
  };

  const handleSaveCharacter = (character: Character) => {
    let updatedCharacters: Character[];
    if (editingCharacter && editingCharacter.id === character.id) {
      // Actualizar personaje existente
      updatedCharacters = characters.map(c => c.id === character.id ? character : c);
    } else {
      // Añadir nuevo personaje
      updatedCharacters = [...characters, character];
    }
    setCharacters(updatedCharacters);
    saveCharacters(updatedCharacters); // Guardar la lista actualizada
    setIsCreatingOrEditing(false);
    setEditingCharacter(null);
  };

  const handleCancelCreateOrEdit = () => {
    setIsCreatingOrEditing(false);
    setEditingCharacter(null);
  };

  const handleExportCharacters = () => {
    // Lógica para exportar personajes
    alert('Funcionalidad de exportación aún no implementada en este contexto de nube.');
  };

  const handleImportCharacters = (importedCharacters: Character[]) => {
    // Combinar personajes importados con los existentes
    const newCharacters = [...characters, ...importedCharacters];
    setCharacters(newCharacters);
    saveCharacters(newCharacters); // Guardar la lista actualizada
  };

  const handleSelectCharacter = (id: string) => {
    setCurrentCharacterId(id);
  };

  const handleBackToList = () => {
    setCurrentCharacterId(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-text-primary flex flex-col">
        <header className="p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <LoginPage onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  // Si está creando o editando, mostrar el formulario
  if (isCreatingOrEditing) {
    return (
      <div className="min-h-screen bg-background text-text-primary p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{editingCharacter ? 'Editar Personaje' : 'Crear Nuevo Personaje'}</h1>
          <ThemeToggle />
        </header>
        <main>
          <CharacterCreation
            existingCharacter={editingCharacter || undefined}
            onSave={handleSaveCharacter}
            onCancel={handleCancelCreateOrEdit}
          />
        </main>
      </div>
    );
  }

  // Si hay un personaje seleccionado, mostrar su hoja
  if (currentCharacterId) {
    const character = characters.find(c => c.id === currentCharacterId);
    if (character) {
      return (
        <div className="min-h-screen bg-background text-text-primary p-4">
          <header className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Volver a la Lista
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCharacter(currentCharacterId!)}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Editar
              </button>
              <ThemeToggle />
            </div>
          </header>
          <main>
            <CharacterSheet
              character={character}
              onBack={handleBackToList}
              onCharacterUpdate={(updatedChar) => {
                const updatedList = characters.map(c => c.id === updatedChar.id ? updatedChar : c);
                setCharacters(updatedList);
                saveCharacters(updatedList); // Guardar al actualizar estado del personaje
              }}
            />
          </main>
        </div>
      );
    } else {
      // Manejar el caso donde el ID no se encuentra
      return (
        <div className="min-h-screen bg-background text-text-primary p-4">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Personaje no encontrado</h1>
            <ThemeToggle />
          </header>
          <main>
            <p>El personaje solicitado no existe.</p>
            <button
              onClick={handleBackToList}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Volver a la Lista
            </button>
          </main>
        </div>
      );
    }
  }

  // Si está logado pero no hay personaje seleccionado ni se está creando/editando, mostrar la lista
  return (
    <div className="min-h-screen bg-background text-text-primary p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Personajes</h1>
        <ThemeToggle />
      </header>
      <main>
        <CharacterList
          characters={characters}
          onSelectCharacter={handleSelectCharacter}
          onAddCharacter={handleAddCharacter}
          onImportCharacters={handleImportCharacters}
          onExportCharacters={handleExportCharacters}
        />
      </main>
    </div>
  );
};

export default App;