import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (useCloud: boolean, providerId?: string) => void; // Añadir providerId
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedOption, setSelectedOption] = useState<'local' | 'cloud'>('local');
  const [selectedCloudProvider, setSelectedCloudProvider] = useState<string>('local-directory'); // Por defecto, el nuevo proveedor

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === 'local') {
      onLogin(false); // No usar nube
    } else { // cloud
      onLogin(true, selectedCloudProvider); // Usar nube, con el ID del proveedor
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border">
      <h2 className="text-xl font-bold mb-6 text-center">Bienvenido a RPG Character Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="local"
              name="storage"
              value="local"
              checked={selectedOption === 'local'}
              onChange={() => setSelectedOption('local')}
              className="mr-2 h-4 w-4 text-accent focus:ring-accent"
            />
            <label htmlFor="local" className="block text-sm font-medium">
              Datos Locales
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="cloud"
              name="storage"
              value="cloud"
              checked={selectedOption === 'cloud'}
              onChange={() => setSelectedOption('cloud')}
              className="mr-2 h-4 w-4 text-accent focus:ring-accent"
            />
            <label htmlFor="cloud" className="block text-sm font-medium">
              Datos en Directorio Local Sincronizado
            </label>
          </div>
        </div>

        {selectedOption === 'cloud' && (
          <div className="ml-6">
            <label className="block text-sm font-medium mb-2">Seleccionar Proveedor:</label>
            <select
              value={selectedCloudProvider}
              onChange={(e) => setSelectedCloudProvider(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {/* Por ahora, solo el directorio local */}
              <option value="local-directory">Directorio Local (Sincronizado con Google Drive, Dropbox, etc.)</option>
              {/* En el futuro, aquí se podrían añadir más opciones si se implementan otros proveedores */}
            </select>
            <p className="text-xs text-text-secondary mt-2">
              Selecciona una carpeta en tu dispositivo. Asegúrate de que esté sincronizada con tu servicio de nube favorito.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;