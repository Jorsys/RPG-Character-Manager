import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../../types/types';
// import { equipItem as equipItemUtil, unequipItem as unequipItemUtil, getEquippedItemByType } from '../../utils/equipment';
// No usamos las funciones de utils/equipment directamente ahora, la lógica cambia
import CharacterActions from './CharacterActions'; // Importar el nuevo componente

interface CharacterSheetProps {
  character: Character;
  onBack: () => void;
  onCharacterUpdate?: (updatedCharacter: Character) => void; // Opcional, para notificar cambios
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onBack, onCharacterUpdate }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'equipment' | 'inventory' | 'spellbook' | 'notes'>('attributes');
  const [showWeaponsArmorInInventory, setShowWeaponsArmorInInventory] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false); // Estado para el menú de opciones
  const [activePersonalityId, setActivePersonalityId] = useState<string | null>(character.activePersonalityId || null);
  const menuRef = useRef<HTMLDivElement>(null); // Ref para manejar clics fuera del menú

  // Manejar clics fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determinar qué datos mostrar: los de la personalidad activa o los del personaje principal
  const currentPersonality = activePersonalityId
    ? character.alternatePersonalities?.find(p => p.id === activePersonalityId)
    : null;

  const displayCharacter = currentPersonality || character;
  const canAccessInventory = currentPersonality ? currentPersonality.canAccessInventory : true;

  // Valores actuales, usando el estado actual si está definido, si no, el máximo
  const currentHealth = displayCharacter.currentStatus?.currentHealth ?? displayCharacter.status.health;
  const currentStamina = displayCharacter.currentStatus?.currentStamina ?? displayCharacter.status.stamina;
  const currentMana = displayCharacter.currentStatus?.currentMana ?? displayCharacter.status.mana;

  // Obtener armas y armaduras equipadas del inventario general, solo si puede acceder
  const equippedArmor = canAccessInventory ? character.inventory.find(item => item.type === 'armor' && item.equipped) : undefined;
  const equippedWeapons = canAccessInventory ? character.inventory.filter(item => item.type === 'weapon' && item.equipped) : [];

  // Inventario a mostrar: si la personalidad activa no puede acceder, mostrar vacío
  const displayInventory = canAccessInventory ? character.inventory : [];

  const filteredInventory = showWeaponsArmorInInventory 
    ? displayInventory 
    : displayInventory.filter(item => item.type !== 'weapon' && item.type !== 'armor');

  // Función para equipar/desequipar un ítem - solo si puede acceder
  const toggleEquipItem = (itemId: string) => {
    if (!canAccessInventory) return; // No puede equipar si no puede acceder al inventario

    const item = character.inventory.find(i => i.id === itemId);
    if (!item) return;

    let updatedCharacter: Character = { ...character };
    updatedCharacter.inventory = updatedCharacter.inventory.map(invItem => {
      if (invItem.id === itemId) {
        // Solo equipar si es arma o armadura
        if (invItem.type === 'weapon' || invItem.type === 'armor') {
          return { ...invItem, equipped: !invItem.equipped };
        }
        return invItem;
      }
      // Si es una arma o armadura del mismo tipo, desequiparla si se está equipando otra
      if (invItem.type === item.type && invItem.equipped && invItem.id !== itemId) {
         return { ...invItem, equipped: false };
      }
      return invItem;
    });

    // Si se proporciona la función de actualización, usarla
    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter);
    }
  };

  // Función para cambiar de personalidad
  const switchPersonality = (id: string | null) => {
    setActivePersonalityId(id);
    // Actualizar la propiedad activePersonalityId en el personaje
    if (onCharacterUpdate) {
      onCharacterUpdate({ ...character, activePersonalityId: id || undefined });
    }
  };

  // Función para manejar la actualización del personaje desde el menú de acciones
  const handleActionCharacterUpdate = (updatedCharacter: Character) => {
    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Volver a la Lista
      </button>

      {/* Cabecera del Personaje */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6 border border-border relative"> {/* Añadir relative aquí */}
        <div className="flex items-start">
          {displayCharacter.image ? (
            <img
              src={displayCharacter.image}
              alt={displayCharacter.name}
              className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-4">
              <span className="text-text-secondary text-xl">?</span>
            </div>
          )}
          <div className="flex-grow">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{displayCharacter.name}</h1>
              <p className="text-text-secondary">{displayCharacter.alias}</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-text-primary"><strong>Raza:</strong> {displayCharacter.race}</p>
              <p className="text-text-primary"><strong>Clase:</strong> {displayCharacter.class}</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-text-primary"><strong>Nv.:</strong> {displayCharacter.level}</p>
            </div>
            {/* Selector de personalidad */}
            {character.hasMultiplePersonalities && character.alternatePersonalities && character.alternatePersonalities.length > 0 && (
              <div className="mt-2">
                <label className="text-xs text-text-secondary">Personalidad Activa:</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  <button
                    onClick={() => switchPersonality(null)}
                    className={`text-xs px-2 py-1 rounded ${
                      activePersonalityId === null ? 'bg-primary text-white' : 'bg-background text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {character.name}
                  </button>
                  {character.alternatePersonalities.map(p => (
                    <button
                      key={p.id}
                      onClick={() => switchPersonality(p.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        activePersonalityId === p.id ? 'bg-primary text-white' : 'bg-background text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center ml-4">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <span className="mr-2">⚔️</span> <span className="font-bold">{displayCharacter.combatValues.melee}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🏹</span> <span className="font-bold">{displayCharacter.combatValues.ranged}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🧙‍♂️</span> <span className="font-bold">{displayCharacter.combatValues.magic}</span>
              </div>
            </div>
            {/* Botón de opciones */}
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="mt-4 text-text-primary hover:text-accent focus:outline-none"
              aria-label="Menú de opciones"
            >
              ⋮ {/* Icono de menú de puntos verticales */}
            </button>
            {showOptionsMenu && (
              <div ref={menuRef}>
                <CharacterActions
                  character={character} // Pasar el personaje principal al menú de acciones
                  onCharacterUpdate={handleActionCharacterUpdate}
                  onClose={() => setShowOptionsMenu(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Valores de Estado */}
      <div className="bg-card rounded-lg shadow-md p-4 mb-6 border border-border">
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-text-primary">Vida: <strong>{currentHealth}</strong>/{displayCharacter.status.health}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-red-500 h-4 rounded-full"
              style={{ width: `${(currentHealth / displayCharacter.status.health) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-text-primary">Aguante: <strong>{currentStamina}</strong>/{displayCharacter.status.stamina}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-yellow-500 h-4 rounded-full"
              style={{ width: `${(currentStamina / displayCharacter.status.stamina) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-text-primary">Maná: <strong>{currentMana}</strong>/{displayCharacter.status.mana}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${(currentMana / displayCharacter.status.mana) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Armadura Equipada - Solo mostrar si puede acceder */}
      {canAccessInventory && (
        <div className="bg-card rounded-lg shadow-md p-4 mb-6 border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Armadura Equipada</h3>
          {equippedArmor ? (
            <div>
              <p className="text-text-secondary">{equippedArmor.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <p className="text-sm">Res. Máx: <span className="font-mono">{equippedArmor.resistanceMax || 0}</span></p>
                <p className="text-sm">Bloq. Fís: <span className="font-mono">{equippedArmor.blockPhysical || 0}</span></p>
                <p className="text-sm">Bloq. Mág: <span className="font-mono">{equippedArmor.blockMagic || 0}</span></p>
                <p className="text-sm">Integridad: <span className="font-mono">{equippedArmor.integrity || 0}</span></p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${((equippedArmor.integrity || 0) / (equippedArmor.resistanceMax || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No hay armadura equipada.</p>
          )}
        </div>
      )}

      {/* Si no puede acceder, mostrar mensaje en lugar de armadura */}
      {!canAccessInventory && (
        <div className="bg-card rounded-lg shadow-md p-4 mb-6 border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Armadura Equipada</h3>
          <p className="text-text-secondary text-sm">La personalidad actual no puede equipar armadura.</p>
        </div>
      )}

      {/* Pestañas */}
      <div className="border-b border-border mb-4">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('attributes')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
              activeTab === 'attributes'
                ? 'bg-card text-text-primary border-t border-l border-r border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Atributos
          </button>
          {/* Mostrar pestaña de armamento solo si puede acceder */}
          {canAccessInventory && (
            <button
              onClick={() => setActiveTab('equipment')}
              className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === 'equipment'
                  ? 'bg-card text-text-primary border-t border-l border-r border-border'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Armamento
            </button>
          )}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
              activeTab === 'inventory'
                ? 'bg-card text-text-primary border-t border-l border-r border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('spellbook')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
              activeTab === 'spellbook'
                ? 'bg-card text-text-primary border-t border-l border-r border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Grimorio
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
              activeTab === 'notes'
                ? 'bg-card text-text-primary border-t border-l border-r border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Bloc de Notas
          </button>
        </nav>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4 border border-border min-h-[300px]">
        {/* Contenido de las pestañas - Ahora mostrando datos de la personalidad activa */}
        {activeTab === 'attributes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Percepción</h4>
              <ul className="text-sm space-y-1">
                <li>Buscar: <span className="font-mono">{displayCharacter.attributes.perception.search}</span></li>
                <li>Sigilo: <span className="font-mono">{displayCharacter.attributes.perception.stealth}</span></li>
                <li>Observar: <span className="font-mono">{displayCharacter.attributes.perception.observe}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Destreza</h4>
              <ul className="text-sm space-y-1">
                <li>Cerraduras: <span className="font-mono">{displayCharacter.attributes.dexterity.locks}</span></li>
                <li>Trampas: <span className="font-mono">{displayCharacter.attributes.dexterity.traps}</span></li>
                <li>Manipular: <span className="font-mono">{displayCharacter.attributes.dexterity.objects}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Agilidad</h4>
              <ul className="text-sm space-y-1">
                <li>Acrobacia: <span className="font-mono">{displayCharacter.attributes.agility.acrobatics}</span></li>
                <li>Desarmar: <span className="font-mono">{displayCharacter.attributes.agility.disarm}</span></li>
                <li>Equitación: <span className="font-mono">{displayCharacter.attributes.agility.riding}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Inteligencia</h4>
              <ul className="text-sm space-y-1">
                <li>Elocuencia: <span className="font-mono">{displayCharacter.attributes.intelligence.eloquence}</span></li>
                <li>Resolver: <span className="font-mono">{displayCharacter.attributes.intelligence.resolve}</span></li>
              </ul>
            </div>
          </div>
        )}
        {/* Pestaña de Armamento - Solo si puede acceder */}
        {activeTab === 'equipment' && canAccessInventory && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Armas Equipadas</h3>
            {equippedWeapons.length > 0 ? (
              <div className="space-y-2 mb-4">
                {equippedWeapons.map((weapon) => (
                  <div key={weapon.id} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                    <div>
                      <p className="font-medium">{weapon.name}</p>
                      <p className="text-xs text-text-secondary">Tipo: {weapon.weaponType || 'N/A'}, Manos: {weapon.requiredHands || 0}</p>
                    </div>
                    <button
                      onClick={() => toggleEquipItem(weapon.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Desequipar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm mb-4">No hay armas equipadas.</p>
            )}

            <h3 className="font-semibold text-text-primary mb-2">Armaduras Equipadas</h3>
            {equippedArmor ? (
              <div className="space-y-2 mb-4">
                 <div key={equippedArmor.id} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                    <div>
                      <p className="font-medium">{equippedArmor.name}</p>
                      <p className="text-xs text-text-secondary">Res: {equippedArmor.resistanceMax || 0}, Bloq. Fís: {equippedArmor.blockPhysical || 0}</p>
                    </div>
                    <button
                      onClick={() => toggleEquipItem(equippedArmor.id)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Desequipar
                    </button>
                 </div>
              </div>
            ) : (
              <p className="text-text-secondary text-sm mb-4">No hay armadura equipada.</p>
            )}

            <h3 className="font-semibold text-text-primary mb-2">Otras Armas y Armaduras</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {character.inventory
                .filter(item => (item.type === 'weapon' || item.type === 'armor') && !item.equipped)
                .map((item) => (
                  <div key={item.id} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name} (Cant: {item.quantity})</p>
                      <p className="text-xs text-text-secondary">{item.type}</p>
                    </div>
                    <button
                      onClick={() => toggleEquipItem(item.id)}
                      className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                      Equipar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-text-primary">Inventario</h3>
              <label className="flex items-center text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={showWeaponsArmorInInventory}
                  onChange={(e) => setShowWeaponsArmorInInventory(e.target.checked)}
                  className="mr-2"
                  disabled={!canAccessInventory} // Deshabilitar si no puede acceder
                />
                Mostrar Armas y Armaduras
              </label>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <div key={item.id} className="p-2 bg-background rounded border border-border flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name} (Cant: {item.quantity})</p>
                      <p className="text-xs text-text-secondary">{item.type}</p>
                    </div>
                    { canAccessInventory && (item.type === 'weapon' || item.type === 'armor') && (
                      <button
                        onClick={() => toggleEquipItem(item.id)}
                        className={`text-xs px-2 py-1 rounded ${
                          item.equipped ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        {item.equipped ? 'Desequipar' : 'Equipar'}
                      </button>
                    )}
                    { !canAccessInventory && (item.type === 'weapon' || item.type === 'armor') && (
                      <span className="text-xs text-text-secondary italic">No equipable</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-center">
                  {currentPersonality && !currentPersonality.canAccessInventory
                    ? 'La personalidad actual no puede acceder al inventario.'
                    : 'Inventario vacío.'
                  }
                </p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'spellbook' && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Grimorio</h3>
            {(displayCharacter.spellbook || []).length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {(displayCharacter.spellbook || []).map((spell) => (
                  <div key={spell.id} className="p-2 bg-background rounded border border-border">
                    <p className="font-medium">{spell.name}</p>
                    <p className="text-xs text-text-secondary">Dif: {spell.difficulty}, Coste: {spell.cost}, Alc: {spell.range}</p>
                    <p className="text-xs">{spell.effect}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center">No hay hechizos en el grimorio.</p>
            )}
          </div>
        )}
        {activeTab === 'notes' && (
          <div>
            <h3 className="font-semibold text-text-primary mb-2">Bloc de Notas</h3>
            {(displayCharacter.notes || []).length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {(displayCharacter.notes || []).map((note) => (
                  <div key={note.id} className="p-2 bg-background rounded border border-border">
                    <p className="font-medium text-text-secondary text-sm">{note.key}</p>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center">No hay notas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;