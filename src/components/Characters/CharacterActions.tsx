import React, { useState } from 'react';
import { Character, InventoryItemType } from '../../types/types';
// import { equipItem as equipItemUtil, unequipItem as unequipItemUtil } from '../../utils/equipment';

interface CharacterActionsProps {
  character: Character;
  onCharacterUpdate: (updatedCharacter: Character) => void;
  onClose: () => void;
}

const CharacterActions: React.FC<CharacterActionsProps> = ({ character, onCharacterUpdate, onClose }) => {
  const [action, setAction] = useState<string | null>(null);
  const [damageValue, setDamageValue] = useState<number>(0);
  const [spellToUse, setSpellToUse] = useState<string>('');
  const [potionToUse, setPotionToUse] = useState<string>('');
  const [scrollToUse, setScrollToUse] = useState<string>('');
  const [receivedEffectType, setReceivedEffectType] = useState<string>('health');
  const [receivedEffectValue, setReceivedEffectValue] = useState<number>(0);
  const [receivedEffectDuration, setReceivedEffectDuration] = useState<string>('1 turno');
  const [findItemType, setFindItemType] = useState<'coins' | 'armor' | 'weapon' | 'potion' | 'scroll' | 'ammunition' | 'misc'>('misc');
  const [findItemName, setFindItemName] = useState<string>('');
  const [findItemQuantity, setFindItemQuantity] = useState<number>(1);
  const [buyItemName, setBuyItemName] = useState<string>('');
  const [buyItemQuantity, setBuyItemQuantity] = useState<number>(1);
  const [buyCost, setBuyCost] = useState<number>(0);
  const [sellItem, setSellItem] = useState<string>('');
  const [sellQuantity, setSellQuantity] = useState<number>(1);
  const [sellValue, setSellValue] = useState<number>(0);

  // --- Acciones ---
  const handleReceiveDamage = (type: 'physical' | 'magic') => {
    if (damageValue <= 0) return;

    let updatedCharacter = { ...character };
    let damageLeft = damageValue;

    if (type === 'physical') {
      const equippedArmor = updatedCharacter.inventory.find(item => item.type === 'armor' && item.equipped);
      if (equippedArmor && equippedArmor.integrity !== undefined) {
        const blockAmount = equippedArmor.blockPhysical || 0;
        const damageToArmor = Math.min(damageLeft, blockAmount);
        const damageToHealth = damageLeft - damageToArmor;

        equippedArmor.integrity = Math.max(0, (equippedArmor.integrity - damageToArmor));
        updatedCharacter.status.health = Math.max(0, updatedCharacter.status.health - damageToHealth);
      } else {
        updatedCharacter.status.health = Math.max(0, updatedCharacter.status.health - damageLeft);
      }
    } else { // magic
      const equippedArmor = updatedCharacter.inventory.find(item => item.type === 'armor' && item.equipped);
      if (equippedArmor && equippedArmor.integrity !== undefined) {
        const blockAmount = equippedArmor.blockMagic || 0;
        const damageToArmor = Math.min(damageLeft, blockAmount);
        const damageToHealth = damageLeft - damageToArmor;

        equippedArmor.integrity = Math.max(0, (equippedArmor.integrity - damageToArmor));
        updatedCharacter.status.health = Math.max(0, updatedCharacter.status.health - damageToHealth);
      } else {
        updatedCharacter.status.health = Math.max(0, updatedCharacter.status.health - damageLeft);
      }
    }

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setDamageValue(0);
  };

  const handleUseSpell = () => {
    if (!spellToUse) return;
    const spell = character.spellbook.find(s => s.id === spellToUse);
    if (!spell) return;

    // Usar maná
    if (character.status.mana <= 0) {
        alert("No hay maná suficiente para lanzar el hechizo.");
        return;
    }
    let updatedCharacter = { ...character };
    updatedCharacter.status.mana = Math.max(0, updatedCharacter.status.mana - 1);

    // Aquí iría la lógica específica del hechizo.
    // Por ejemplo, si cura, daña, etc.
    // Por ahora, un ejemplo simple de curación a sí mismo.
    if (spell.effect.toLowerCase().includes('curar') || spell.effect.toLowerCase().includes('salud')) {
         updatedCharacter.status.health = Math.min(
             updatedCharacter.status.health, // Máximo es el original, no cambia el máximo
             (updatedCharacter.currentStatus?.currentHealth ?? updatedCharacter.status.health) + 5 // Ejemplo de cura
         );
         // Actualizar el estado actual si es necesario
         if (updatedCharacter.currentStatus) {
             updatedCharacter.currentStatus.currentHealth = updatedCharacter.status.health;
         } else {
             updatedCharacter.currentStatus = {
                 currentHealth: updatedCharacter.status.health,
                 currentStamina: updatedCharacter.status.stamina,
                 currentMana: updatedCharacter.status.mana,
             };
         }
    }

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setSpellToUse('');
  };

  const handleUsePotion = () => {
    if (!potionToUse) return;
    const potion = character.inventory.find(i => i.id === potionToUse && i.type === 'potion');
    if (!potion || potion.quantity <= 0) return;

    let updatedCharacter = { ...character };

    // Aplicar efecto de la poción (ejemplo simple)
    if (potion.subtype === 'health') {
        updatedCharacter.status.health = Math.min(
             updatedCharacter.status.health, // Máximo es el original
             (updatedCharacter.currentStatus?.currentHealth ?? updatedCharacter.status.health) + (potion.effect || 0)
        );
        if (updatedCharacter.currentStatus) {
             updatedCharacter.currentStatus.currentHealth = updatedCharacter.status.health;
        } else {
             updatedCharacter.currentStatus = {
                 currentHealth: updatedCharacter.status.health,
                 currentStamina: updatedCharacter.status.stamina,
                 currentMana: updatedCharacter.status.mana,
             };
        }
    }
    // Similar para stamina, mana, etc.

    // Quitar una unidad del inventario
    updatedCharacter.inventory = updatedCharacter.inventory.map(item => {
        if (item.id === potionToUse) {
            return { ...item, quantity: item.quantity - 1 };
        }
        return item;
    }).filter(item => item.quantity > 0); // Eliminar ítems con cantidad 0

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setPotionToUse('');
  };

  const handleUseScroll = () => {
    if (!scrollToUse) return;
    const scroll = character.inventory.find(i => i.id === scrollToUse && i.type === 'scroll');
    if (!scroll || scroll.quantity <= 0) return;

    // Lógica similar a la poción, pero con efectos de pergamino
    let updatedCharacter = { ...character };
    // ... aplicar efecto ...
    // Quitar una unidad
    updatedCharacter.inventory = updatedCharacter.inventory.map(item => {
        if (item.id === scrollToUse) {
            return { ...item, quantity: item.quantity - 1 };
        }
        return item;
    }).filter(item => item.quantity > 0);

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setScrollToUse('');
  };

  const handleReceiveEffect = () => {
    if (receivedEffectValue === 0) return;
    let updatedCharacter = { ...character };

    // Aplicar efecto recibido (ejemplo simple)
    if (receivedEffectType === 'health') {
        updatedCharacter.status.health = Math.min(
             updatedCharacter.status.health,
             (updatedCharacter.currentStatus?.currentHealth ?? updatedCharacter.status.health) + receivedEffectValue
        );
        if (updatedCharacter.currentStatus) {
             updatedCharacter.currentStatus.currentHealth = updatedCharacter.status.health;
        } else {
             updatedCharacter.currentStatus = {
                 currentHealth: updatedCharacter.status.health,
                 currentStamina: updatedCharacter.status.stamina,
                 currentMana: updatedCharacter.status.mana,
             };
        }
    }
    // ... otros tipos de efectos ...

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setReceivedEffectValue(0);
    setReceivedEffectType('health');
    setReceivedEffectDuration('1 turno');
  };

  const handleFindItem = () => {
    if (!findItemName.trim()) return;
    let updatedCharacter = { ...character };
    const existingItem = updatedCharacter.inventory.find(i => i.name === findItemName && i.type === findItemType);

    if (existingItem) {
        existingItem.quantity += findItemQuantity;
    } else {
        const newItem = {
            id: Date.now().toString(),
            type: findItemType,
            name: findItemName,
            quantity: findItemQuantity,
        };
        updatedCharacter.inventory.push(newItem);
    }

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setFindItemName('');
    setFindItemQuantity(1);
  };

  const handleBuyItem = () => {
    if (!buyItemName.trim() || buyCost <= 0) return;
    // Suponemos monedas en inventario para simplificar
    const coinsItem = character.inventory.find(i => i.type === 'coins');
    if (!coinsItem || coinsItem.quantity < buyCost) {
        alert("No tienes suficiente dinero.");
        return;
    }

    let updatedCharacter = { ...character };

    // Restar dinero
    coinsItem.quantity -= buyCost;

    // Añadir ítem al inventario
    const existingItem = updatedCharacter.inventory.find(i => i.name === buyItemName);
    if (existingItem) {
        existingItem.quantity += buyItemQuantity;
    } else {
        const newItem = {
            id: Date.now().toString(),
            type: 'misc' as InventoryItemType,
            name: buyItemName,
            quantity: buyItemQuantity,
        };
        updatedCharacter.inventory.push(newItem);
    }

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setBuyItemName('');
    setBuyItemQuantity(1);
    setBuyCost(0);
  };

  const handleSellItem = () => {
    if (!sellItem || sellQuantity <= 0 || sellValue <= 0) return;
    const itemToSell = character.inventory.find(i => i.id === sellItem);
    if (!itemToSell || itemToSell.quantity < sellQuantity) {
        alert("Cantidad insuficiente para vender.");
        return;
    }

    let updatedCharacter = { ...character };

    // Quitar ítems del inventario
    if (itemToSell.quantity === sellQuantity) {
        updatedCharacter.inventory = updatedCharacter.inventory.filter(i => i.id !== sellItem);
    } else {
        itemToSell.quantity -= sellQuantity;
    }

    // Añadir dinero
    const coinsItem = updatedCharacter.inventory.find(i => i.type === 'coins');
    if (coinsItem) {
        coinsItem.quantity += (sellValue * sellQuantity);
    } else {
        updatedCharacter.inventory.push({
            id: Date.now().toString(),
            type: 'coins',
            name: 'Monedas',
            quantity: sellValue * sellQuantity,
        });
    }

    onCharacterUpdate(updatedCharacter);
    setAction(null);
    setSellItem('');
    setSellQuantity(1);
    setSellValue(0);
  };

  const renderActionForm = () => {
    switch (action) {
      case 'receivePhysicalDamage':
      case 'receiveMagicDamage':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Recibir Daño</h3>
            <input
              type="number"
              placeholder="Valor del daño"
              value={damageValue}
              onChange={(e) => setDamageValue(parseInt(e.target.value) || 0)}
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={() => handleReceiveDamage(action === 'receivePhysicalDamage' ? 'physical' : 'magic')} className="px-4 py-2 bg-error text-white rounded">Aplicar</button>
            </div>
          </div>
        );
      case 'useSpell':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Usar Hechizo</h3>
            <select
              value={spellToUse}
              onChange={(e) => setSpellToUse(e.target.value)}
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            >
              <option value="">Selecciona un hechizo</option>
              {character.spellbook.map(spell => (
                <option key={spell.id} value={spell.id}>{spell.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleUseSpell} className="px-4 py-2 bg-primary text-white rounded">Lanzar</button>
            </div>
          </div>
        );
      case 'usePotion':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Usar Poción</h3>
            <select
              value={potionToUse}
              onChange={(e) => setPotionToUse(e.target.value)}
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            >
              <option value="">Selecciona una poción</option>
              {character.inventory.filter(i => i.type === 'potion').map(item => (
                <option key={item.id} value={item.id}>{item.name} (Cant: {item.quantity})</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleUsePotion} className="px-4 py-2 bg-primary text-white rounded">Usar</button>
            </div>
          </div>
        );
      case 'useScroll':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Usar Pergamino</h3>
            <select
              value={scrollToUse}
              onChange={(e) => setScrollToUse(e.target.value)}
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            >
              <option value="">Selecciona un pergamino</option>
              {character.inventory.filter(i => i.type === 'scroll').map(item => (
                <option key={item.id} value={item.id}>{item.name} (Cant: {item.quantity})</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleUseScroll} className="px-4 py-2 bg-primary text-white rounded">Usar</button>
            </div>
          </div>
        );
      case 'receiveEffect':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Recibir Efecto</h3>
            <select
              value={receivedEffectType}
              onChange={(e) => setReceivedEffectType(e.target.value)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            >
              <option value="health">Salud</option>
              <option value="stamina">Aguante</option>
              <option value="mana">Maná</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="number"
              placeholder="Valor del efecto"
              value={receivedEffectValue}
              onChange={(e) => setReceivedEffectValue(parseInt(e.target.value) || 0)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            />
            <input
              type="text"
              placeholder="Duración (opcional)"
              value={receivedEffectDuration}
              onChange={(e) => setReceivedEffectDuration(e.target.value)}
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleReceiveEffect} className="px-4 py-2 bg-primary text-white rounded">Aplicar</button>
            </div>
          </div>
        );
      case 'findItem':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Encontrar Objeto</h3>
            <select
              value={findItemType}
              onChange={(e) => setFindItemType(e.target.value as any)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            >
              <option value="coins">Monedas</option>
              <option value="armor">Armadura</option>
              <option value="weapon">Arma</option>
              <option value="potion">Poción</option>
              <option value="scroll">Pergamino</option>
              <option value="ammunition">Munición</option>
              <option value="misc">Varios</option>
            </select>
            <input
              type="text"
              placeholder="Nombre del objeto"
              value={findItemName}
              onChange={(e) => setFindItemName(e.target.value)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={findItemQuantity}
              onChange={(e) => setFindItemQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleFindItem} className="px-4 py-2 bg-primary text-white rounded">Añadir</button>
            </div>
          </div>
        );
      case 'buyItem':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Comprar Objeto</h3>
            <input
              type="text"
              placeholder="Nombre del objeto"
              value={buyItemName}
              onChange={(e) => setBuyItemName(e.target.value)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={buyItemQuantity}
              onChange={(e) => setBuyItemQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            />
            <input
              type="number"
              placeholder="Coste en monedas"
              value={buyCost}
              onChange={(e) => setBuyCost(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleBuyItem} className="px-4 py-2 bg-primary text-white rounded">Comprar</button>
            </div>
          </div>
        );
      case 'sellItem':
        return (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Vender Objeto</h3>
            <select
              value={sellItem}
              onChange={(e) => setSellItem(e.target.value)}
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            >
              <option value="">Selecciona un ítem</option>
              {character.inventory.filter(i => i.type !== 'coins').map(item => (
                <option key={item.id} value={item.id}>{item.name} (Cant: {item.quantity})</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Cantidad a vender"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full p-2 mb-2 border border-border rounded bg-background"
            />
            <input
              type="number"
              placeholder="Valor por unidad"
              value={sellValue}
              onChange={(e) => setSellValue(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full p-2 mb-3 border border-border rounded bg-background"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setAction(null)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</button>
              <button onClick={handleSellItem} className="px-4 py-2 bg-primary text-white rounded">Vender</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (action) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md">
          {renderActionForm()}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border z-40">
      <div className="p-2">
        <h3 className="font-semibold text-text-primary mb-2">Menú de Opciones</h3>
        <div className="space-y-1">
          <h4 className="text-xs uppercase text-text-secondary pl-2">Acciones</h4>
          <button
            onClick={() => setAction('receivePhysicalDamage')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Recibir daño físico
          </button>
          <button
            onClick={() => setAction('receiveMagicDamage')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Recibir daño mágico
          </button>
          <button
            onClick={() => setAction('useSpell')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Usar hechizo
          </button>
          <button
            onClick={() => setAction('usePotion')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Usar poción
          </button>
          <button
            onClick={() => setAction('useScroll')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Usar pergamino
          </button>
          <button
            onClick={() => setAction('receiveEffect')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Recibir efecto
          </button>
        </div>
        <div className="space-y-1 mt-2">
          <h4 className="text-xs uppercase text-text-secondary pl-2">Objetos</h4>
          <button
            onClick={() => setAction('findItem')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Encontrar
          </button>
          <button
            onClick={() => setAction('buyItem')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Comprar
          </button>
          <button
            onClick={() => setAction('sellItem')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-background rounded"
          >
            Vender
          </button>
        </div>
        <div className="pt-2 mt-2 border-t border-border">
          <button
            onClick={onClose}
            className="w-full text-center px-3 py-2 text-sm text-error hover:bg-background rounded"
          >
            Cerrar Menú
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterActions;