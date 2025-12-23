// Añadimos el campo 'equipped' al tipo InventoryItem
export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  name: string;
  quantity: number;
  equipped?: boolean; // <-- Nuevo campo, indica si está equipado en el inventario general
  // Campos específicos para cada tipo
  subtype?: string; // Para pociones, pergaminos, municiones
  effect?: number; // Para pociones, pergaminos, municiones
  duration?: string; // Para pociones, pergaminos
  // Para armas
  weaponType?: 'melee' | 'ranged' | 'shield';
  requiredHands?: 0 | 1 | 2;
  damageDice?: { quantity: number; faces: number }[]; // Ej: [{quantity: 1, faces: 6}, {quantity: 1, faces: 4}]
  enchanted?: boolean;
  enchantmentValue?: number; // Puede ser un número fijo o un dado
  durabilityMax?: number;
  integrity?: number; // Actual
  // Para armaduras
  resistanceMax?: number;
  blockPhysical?: number;
  blockMagic?: number;
  enhancementPhysical?: number;
  enhancementMagic?: number;
}

export type InventoryItemType =
  | 'coins'
  | 'armor'
  | 'weapon'
  | 'potion'
  | 'scroll'
  | 'ammunition'
  | 'misc';

// Nuevo tipo para representar una personalidad alternativa
export interface AlternatePersonality {
  id: string;
  // Datos Básicos
  image?: string;
  name: string; // Nombre de la forma/personalidad
  alias: string;
  race: string;
  class: string;
  level: number;
  // Valores de Combate
  combatValues: {
    melee: number;
    ranged: number;
    magic: number;
  };
  // Estado
  status: {
    health: number;
    stamina: number;
    mana: number;
  };
  // ATRIBUTOS
  attributes: {
    perception: {
      search: number;
      stealth: number;
      observe: number;
    };
    dexterity: {
      locks: number;
      traps: number;
      objects: number;
    };
    agility: {
      acrobatics: number;
      disarm: number;
      riding: number;
    };
    intelligence: {
      eloquence: number;
      resolve: number;
    };
  };
  // Booleano para saber si puede acceder al inventario del personaje principal
  canAccessInventory: boolean;
  // NOTA: El equipamiento no se almacena aquí, sino en el inventario general del Character como 'equipped: boolean'
  spellbook: Spell[];
  notes: Note[];
  // Estado actual de la vida, maná, etc. (puede diferir del máximo)
  currentStatus?: {
    currentHealth: number;
    currentStamina: number;
    currentMana: number;
  };
}

export interface Character {
  id: string;
  image?: string;
  name: string;
  alias: string;
  race: string;
  class: string;
  level: number;
  combatValues: {
    melee: number;
    ranged: number;
    magic: number;
  };
  status: {
    health: number;
    stamina: number;
    mana: number;
  };
  attributes: {
    perception: {
      search: number;
      stealth: number;
      observe: number;
    };
    dexterity: {
      locks: number;
      traps: number;
      objects: number;
    };
    agility: {
      acrobatics: number;
      disarm: number;
      riding: number;
    };
    intelligence: {
      eloquence: number;
      resolve: number;
    };
  };
  hasMultiplePersonalities: boolean;
  // Nueva propiedad: lista de personalidades alternativas
  alternatePersonalities?: AlternatePersonality[];
  inventory: InventoryItem[]; // <-- Aquí se encuentra el campo 'equipped'
  spellbook: Spell[];
  notes: Note[];
  // Estado actual de la vida, maná, etc. (puede diferir del máximo)
  currentStatus?: {
    currentHealth: number;
    currentStamina: number;
    currentMana: number;
  };
  // ID de la personalidad activa actualmente (si aplica)
  activePersonalityId?: string;
  // NOTA: El equipamiento general no se almacena aquí como una lista separada,
  // sino como el estado 'equipped' de los ítems en 'inventory'.
}

export interface Spell {
  id: string;
  name: string;
  difficulty: number;
  cost: number;
  range: string;
  effect: string;
}

export interface Note {
  id: string;
  key: string; // Clave automática o generada
  content: string;
}