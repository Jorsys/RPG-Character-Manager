import { Character, InventoryItem } from '../types/types';

// Función para equipar un ítem
export const equipItem = (character: Character, itemId: string): Character => {
  const itemToEquip = character.inventory.find(item => item.id === itemId);
  if (!itemToEquip) return character; // Si no se encuentra el ítem, no hacer nada

  // En un sistema real, podrías tener campos como `equipped: boolean` en el objeto InventoryItem.
  // Por simplicidad, vamos a usar un campo temporal en el estado del personaje o una lógica simple.
  // Aquí, para este ejemplo, simplemente actualizamos una propiedad en el personaje
  // que indique qué ítems están equipados. Usaremos el nombre como identificador por ahora.
  // Sería mejor usar IDs, pero para mantenerlo simple con la estructura actual, usamos el nombre.

  // Supongamos que el personaje tiene campos para rastrear el equipamiento
  // Añadimos estos campos temporalmente al tipo si no existen, o los gestionamos de otra manera.
  // Por ahora, lo haremos de forma inmutable sobre el objeto existente.
  // Este es un punto de mejora: tener un estado de equipamiento separado o un campo `equipped` en `InventoryItem`.

  // Por simplicidad, vamos a suponer que el personaje tiene un campo `equipment` que es un objeto.
  // { weaponId?: string, armorId?: string, ... }
  // Pero para no modificar los tipos ahora, actualizaremos el objeto existente de forma específica.

  // Por ejemplo, si es un arma, podríamos tener un campo `equippedWeaponName`.
  // Si es una armadura, `equippedArmorName`.
  // Pero esto no es ideal. La mejor práctica es tener un campo `equipped: boolean` en `InventoryItem`.

  // Vamos a simular que el personaje tiene un campo `equipment: { [slot: string]: string }`
  // donde la clave es el slot (e.g., "mainHand", "armor") y el valor es el ID del ítem.

  // Para no tocar los tipos ahora, simularemos que se marca el nombre del ítem equipado.
  // ESTE ENFOQUE ES UNA SIMULACIÓN. La implementación ideal es añadir `equipped: boolean` a `InventoryItem`.

  const updatedInventory = character.inventory.map(item => {
    // Simulamos equipar desequipando todos los del mismo tipo primero
    if (item.type === itemToEquip.type && item.id === itemId) {
      return { ...item, equipped: true }; // Asumimos que ahora InventoryItem puede tener `equipped`
    } else if (item.type === itemToEquip.type && item.id !== itemId) {
      return { ...item, equipped: false };
    }
    // Si el ítem no es del mismo tipo, no lo toca
    return item;
  });

  return {
    ...character,
    inventory: updatedInventory,
  };
};

// Función para desequipar un ítem
export const unequipItem = (character: Character, itemId: string): Character => {
  const itemToUnequip = character.inventory.find(item => item.id === itemId);
  if (!itemToUnequip) return character;

  const updatedInventory = character.inventory.map(item => {
    if (item.id === itemId) {
      return { ...item, equipped: false };
    }
    return item;
  });

  return {
    ...character,
    inventory: updatedInventory,
  };
};

// Función para obtener el ítem equipado en un slot específico (por tipo)
export const getEquippedItemByType = (character: Character, type: 'weapon' | 'armor'): InventoryItem | undefined => {
  return character.inventory.find(item => item.type === type && item.equipped);
};

// Función para obtener todos los ítems equipados
export const getAllEquippedItems = (character: Character): InventoryItem[] => {
  return character.inventory.filter(item => item.equipped);
};