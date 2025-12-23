import React, { useState } from 'react';
import { InventoryItem, InventoryItemType, Spell, Note } from '../../types/types';

interface CharacterActionsProps {
  character: any; // Usamos any temporalmente, usarías el tipo Character si lo importas aquí
  onCharacterUpdate: (updatedCharacter: any) => void; // Igualmente, usarías el tipo Character
  onClose: () => void;
}

const CharacterActions: React.FC<CharacterActionsProps> = ({ character, onCharacterUpdate, onClose }) => {
  const [showBuyItemModal, setShowBuyItemModal] = useState(false);
  const [showFindItemModal, setShowFindItemModal] = useState(false);
  const [showAddSpellModal, setShowAddSpellModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Estados para comprar/encontrar ítems
  const [buyItemType, setBuyItemType] = useState<InventoryItemType>('misc');
  const [buyItemName, setBuyItemName] = useState('');
  const [buyItemQuantity, setBuyItemQuantity] = useState(1);

  // Campos específicos para comprar/encontrar ítems
  const [buyItemSubtype, setBuyItemSubtype] = useState('');
  const [buyItemEffect, setBuyItemEffect] = useState(0);
  const [buyItemDuration, setBuyItemDuration] = useState('');
  const [buyItemWeaponType, setBuyItemWeaponType] = useState<'melee' | 'ranged' | 'shield'>('melee');
  const [buyItemRequiredHands, setBuyItemRequiredHands] = useState<0 | 1 | 2>(1);
  const [buyItemDamageDiceQty, setBuyItemDamageDiceQty] = useState(1);
  const [buyItemDamageDiceFaces, setBuyItemDamageDiceFaces] = useState(6);
  const [buyItemEnchanted, setBuyItemEnchanted] = useState(false);
  const [buyItemEnchantmentValue, setBuyItemEnchantmentValue] = useState(0);
  const [buyItemDurabilityMax, setBuyItemDurabilityMax] = useState(0);
  const [buyItemIntegrity, setBuyItemIntegrity] = useState(0);
  const [buyItemResistanceMax, setBuyItemResistanceMax] = useState(0);
  const [buyItemBlockPhysical, setBuyItemBlockPhysical] = useState(0);
  const [buyItemBlockMagic, setBuyItemBlockMagic] = useState(0);
  const [buyItemEnhancementPhysical, setBuyItemEnhancementPhysical] = useState(0);
  const [buyItemEnhancementMagic, setBuyItemEnhancementMagic] = useState(0);
  const [buyItemIntegrityArmor, setBuyItemIntegrityArmor] = useState(0);

  // Estados para añadir hechizo
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellDifficulty, setNewSpellDifficulty] = useState(0);
  const [newSpellCost, setNewSpellCost] = useState(0);
  const [newSpellRange, setNewSpellRange] = useState('');
  const [newSpellEffect, setNewSpellEffect] = useState('');

  // Estados para añadir nota
  const [newNoteContent, setNewNoteContent] = useState(''); // <-- Cambio: solo contenido

  const handleBuyItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      type: buyItemType,
      name: buyItemName,
      quantity: buyItemQuantity,
      // Añadir campos condicionalmente
      ...(buyItemType === 'potion' || buyItemType === 'scroll' || buyItemType === 'ammunition' ? {
          subtype: buyItemSubtype || undefined,
          effect: buyItemEffect || undefined,
          duration: buyItemDuration || undefined,
      } : {}),
      ...(buyItemType === 'weapon' ? {
          weaponType: buyItemWeaponType,
          requiredHands: buyItemRequiredHands,
          damageDice: (buyItemDamageDiceQty > 0 && buyItemDamageDiceFaces > 0) ? [{ quantity: buyItemDamageDiceQty, faces: buyItemDamageDiceFaces }] : undefined,
          enchanted: buyItemEnchanted || undefined,
          enchantmentValue: buyItemEnchanted ? buyItemEnchantmentValue : undefined,
          durabilityMax: buyItemDurabilityMax || undefined,
          integrity: buyItemIntegrity || undefined,
      } : {}),
      ...(buyItemType === 'armor' ? {
          resistanceMax: buyItemResistanceMax || undefined,
          blockPhysical: buyItemBlockPhysical || undefined,
          blockMagic: buyItemBlockMagic || undefined,
          enhancementPhysical: buyItemEnhancementPhysical || undefined,
          enhancementMagic: buyItemEnhancementMagic || undefined,
          integrity: buyItemIntegrityArmor || undefined,
      } : {}),
    };

    const updatedCharacter = {
      ...character,
      inventory: [...character.inventory, newItem],
    };
    onCharacterUpdate(updatedCharacter);
    setShowBuyItemModal(false);
    resetBuyItemForm();
  };

  const resetBuyItemForm = () => {
    setBuyItemType('misc');
    setBuyItemName('');
    setBuyItemQuantity(1);
    setBuyItemSubtype('');
    setBuyItemEffect(0);
    setBuyItemDuration('');
    setBuyItemWeaponType('melee');
    setBuyItemRequiredHands(1);
    setBuyItemDamageDiceQty(1);
    setBuyItemDamageDiceFaces(6);
    setBuyItemEnchanted(false);
    setBuyItemEnchantmentValue(0);
    setBuyItemDurabilityMax(0);
    setBuyItemIntegrity(0);
    setBuyItemResistanceMax(0);
    setBuyItemBlockPhysical(0);
    setBuyItemBlockMagic(0);
    setBuyItemEnhancementPhysical(0);
    setBuyItemEnhancementMagic(0);
    setBuyItemIntegrityArmor(0);
  };

  const handleFindItem = () => {
    // Similar a handleBuyItem, pero con los estados de find
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      type: findItemType,
      name: findItemName,
      quantity: findItemQuantity,
      // Añadir campos condicionalmente (similar a buy)
      ...(findItemType === 'potion' || findItemType === 'scroll' || findItemType === 'ammunition' ? {
          subtype: findItemSubtype || undefined,
          effect: findItemEffect || undefined,
          duration: findItemDuration || undefined,
      } : {}),
      ...(findItemType === 'weapon' ? {
          weaponType: findItemWeaponType,
          requiredHands: findItemRequiredHands,
          damageDice: (findItemDamageDiceQty > 0 && findItemDamageDiceFaces > 0) ? [{ quantity: findItemDamageDiceQty, faces: findItemDamageDiceFaces }] : undefined,
          enchanted: findItemEnchanted || undefined,
          enchantmentValue: findItemEnchanted ? findItemEnchantmentValue : undefined,
          durabilityMax: findItemDurabilityMax || undefined,
          integrity: findItemIntegrity || undefined,
      } : {}),
      ...(findItemType === 'armor' ? {
          resistanceMax: findItemResistanceMax || undefined,
          blockPhysical: findItemBlockPhysical || undefined,
          blockMagic: findItemBlockMagic || undefined,
          enhancementPhysical: findItemEnhancementPhysical || undefined,
          enhancementMagic: findItemEnhancementMagic || undefined,
          integrity: findItemIntegrityArmor || undefined,
      } : {}),
    };

    const updatedCharacter = {
      ...character,
      inventory: [...character.inventory, newItem],
    };
    onCharacterUpdate(updatedCharacter);
    setShowFindItemModal(false);
    resetFindItemForm();
  };

  // Estados para encontrar ítems (muy similares a comprar)
  const [findItemType, setFindItemType] = useState<InventoryItemType>('misc');
  const [findItemName, setFindItemName] = useState('');
  const [findItemQuantity, setFindItemQuantity] = useState(1);
  const [findItemSubtype, setFindItemSubtype] = useState('');
  const [findItemEffect, setFindItemEffect] = useState(0);
  const [findItemDuration, setFindItemDuration] = useState('');
  const [findItemWeaponType, setFindItemWeaponType] = useState<'melee' | 'ranged' | 'shield'>('melee');
  const [findItemRequiredHands, setFindItemRequiredHands] = useState<0 | 1 | 2>(1);
  const [findItemDamageDiceQty, setFindItemDamageDiceQty] = useState(1);
  const [findItemDamageDiceFaces, setFindItemDamageDiceFaces] = useState(6);
  const [findItemEnchanted, setFindItemEnchanted] = useState(false);
  const [findItemEnchantmentValue, setFindItemEnchantmentValue] = useState(0);
  const [findItemDurabilityMax, setFindItemDurabilityMax] = useState(0);
  const [findItemIntegrity, setFindItemIntegrity] = useState(0);
  const [findItemResistanceMax, setFindItemResistanceMax] = useState(0);
  const [findItemBlockPhysical, setFindItemBlockPhysical] = useState(0);
  const [findItemBlockMagic, setFindItemBlockMagic] = useState(0);
  const [findItemEnhancementPhysical, setFindItemEnhancementPhysical] = useState(0);
  const [findItemEnhancementMagic, setFindItemEnhancementMagic] = useState(0);
  const [findItemIntegrityArmor, setFindItemIntegrityArmor] = useState(0);

  const resetFindItemForm = () => {
    setFindItemType('misc');
    setFindItemName('');
    setFindItemQuantity(1);
    setFindItemSubtype('');
    setFindItemEffect(0);
    setFindItemDuration('');
    setFindItemWeaponType('melee');
    setFindItemRequiredHands(1);
    setFindItemDamageDiceQty(1);
    setFindItemDamageDiceFaces(6);
    setFindItemEnchanted(false);
    setFindItemEnchantmentValue(0);
    setFindItemDurabilityMax(0);
    setFindItemIntegrity(0);
    setFindItemResistanceMax(0);
    setFindItemBlockPhysical(0);
    setFindItemBlockMagic(0);
    setFindItemEnhancementPhysical(0);
    setFindItemEnhancementMagic(0);
    setFindItemIntegrityArmor(0);
  };

  const handleAddSpell = () => {
    const newSpell: Spell = {
      id: Date.now().toString(),
      name: newSpellName,
      difficulty: newSpellDifficulty,
      cost: newSpellCost,
      range: newSpellRange,
      effect: newSpellEffect,
    };

    const updatedCharacter = {
      ...character,
      spellbook: [...character.spellbook, newSpell],
    };
    onCharacterUpdate(updatedCharacter);
    setShowAddSpellModal(false);
    setNewSpellName('');
    setNewSpellDifficulty(0);
    setNewSpellCost(0);
    setNewSpellRange('');
    setNewSpellEffect('');
  };

  const handleAddNote = () => {
    // Generar una clave automática basada en la fecha o un ID
    const key = `Nota-${Date.now()}`; // O puedes usar crypto.randomUUID() si está disponible
    const newNote: Note = {
      id: Date.now().toString(),
      key: key, // Aunque no se mostrará al usuario, se guarda
      content: newNoteContent,
    };

    const updatedCharacter = {
      ...character,
      notes: [...character.notes, newNote],
    };
    onCharacterUpdate(updatedCharacter);
    setShowAddNoteModal(false);
    setNewNoteContent(''); // <-- Cambio: solo limpiar contenido
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-card rounded-md shadow-lg border border-border z-10">
      <div className="py-1">
        <button
          onClick={() => setShowBuyItemModal(true)}
          className="block px-4 py-2 text-sm text-text-primary hover:bg-background w-full text-left"
        >
          Comprar Objeto
        </button>
        <button
          onClick={() => setShowFindItemModal(true)}
          className="block px-4 py-2 text-sm text-text-primary hover:bg-background w-full text-left"
        >
          Encontrar Objeto
        </button>
        <button
          onClick={() => setShowAddSpellModal(true)}
          className="block px-4 py-2 text-sm text-text-primary hover:bg-background w-full text-left"
        >
          Añadir Hechizo
        </button>
        <button
          onClick={() => setShowAddNoteModal(true)}
          className="block px-4 py-2 text-sm text-text-primary hover:bg-background w-full text-left"
        >
          Añadir Nota
        </button>
        <button
          onClick={onClose}
          className="block px-4 py-2 text-sm text-text-primary hover:bg-background w-full text-left"
        >
          Cerrar
        </button>
      </div>

      {/* Modal para Comprar Objeto */}
      {showBuyItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Comprar Objeto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Objeto</label>
                <select
                  value={buyItemType}
                  onChange={(e) => setBuyItemType(e.target.value as InventoryItemType)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="coins">Monedas</option>
                  <option value="armor">Armadura</option>
                  <option value="weapon">Arma</option>
                  <option value="potion">Poción</option>
                  <option value="scroll">Pergamino</option>
                  <option value="ammunition">Munición</option>
                  <option value="misc">Misceláneo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={buyItemName}
                  onChange={(e) => setBuyItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  value={buyItemQuantity}
                  onChange={(e) => setBuyItemQuantity(parseInt(e.target.value) || 1)}
                  min="1" // La cantidad mínima es 1
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Campos condicionales para Poción, Pergamino, Munición */}
              {(buyItemType === 'potion' || buyItemType === 'scroll' || buyItemType === 'ammunition') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Subtipo</label>
                    <input
                      type="text"
                      value={buyItemSubtype}
                      onChange={(e) => setBuyItemSubtype(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Efecto</label>
                    <input
                      type="number"
                      value={buyItemEffect}
                      onChange={(e) => setBuyItemEffect(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Duración</label>
                    <input
                      type="text"
                      value={buyItemDuration}
                      onChange={(e) => setBuyItemDuration(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para Arma */}
              {buyItemType === 'weapon' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Tipo de Arma</label>
                    <select
                      value={buyItemWeaponType}
                      onChange={(e) => setBuyItemWeaponType(e.target.value as any)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="melee">Melee</option>
                      <option value="ranged">Ranged</option>
                      <option value="shield">Shield</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Manos Requeridas</label>
                    <select
                      value={buyItemRequiredHands}
                      onChange={(e) => setBuyItemRequiredHands(parseInt(e.target.value) as 0 | 1 | 2)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dado de Daño (Qty)</label>
                    <input
                      type="number"
                      value={buyItemDamageDiceQty}
                      onChange={(e) => setBuyItemDamageDiceQty(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dado de Daño (Faces)</label>
                    <input
                      type="number"
                      value={buyItemDamageDiceFaces}
                      onChange={(e) => setBuyItemDamageDiceFaces(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center col-span-2">
                    <input
                      type="checkbox"
                      id="buyItemEnchanted"
                      checked={buyItemEnchanted}
                      onChange={(e) => setBuyItemEnchanted(e.target.checked)}
                      className="mr-2 h-4 w-4 text-accent focus:ring-accent"
                    />
                    <label htmlFor="buyItemEnchanted" className="text-xs">Encantado</label>
                  </div>
                  {buyItemEnchanted && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Valor Encantamiento</label>
                      <input
                        type="number"
                        value={buyItemEnchantmentValue}
                        onChange={(e) => setBuyItemEnchantmentValue(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1">Durabilidad Max</label>
                    <input
                      type="number"
                      value={buyItemDurabilityMax}
                      onChange={(e) => setBuyItemDurabilityMax(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Integridad</label>
                    <input
                      type="number"
                      value={buyItemIntegrity}
                      onChange={(e) => setBuyItemIntegrity(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para Armadura */}
              {buyItemType === 'armor' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Resistencia Max</label>
                    <input
                      type="number"
                      value={buyItemResistanceMax}
                      onChange={(e) => setBuyItemResistanceMax(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Bloqueo Físico</label>
                    <input
                      type="number"
                      value={buyItemBlockPhysical}
                      onChange={(e) => setBuyItemBlockPhysical(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Bloqueo Mágico</label>
                    <input
                      type="number"
                      value={buyItemBlockMagic}
                      onChange={(e) => setBuyItemBlockMagic(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Mejora Física</label>
                    <input
                      type="number"
                      value={buyItemEnhancementPhysical}
                      onChange={(e) => setBuyItemEnhancementPhysical(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Mejora Mágica</label>
                    <input
                      type="number"
                      value={buyItemEnhancementMagic}
                      onChange={(e) => setBuyItemEnhancementMagic(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Integridad</label>
                    <input
                      type="number"
                      value={buyItemIntegrityArmor}
                      onChange={(e) => setBuyItemIntegrityArmor(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => { setShowBuyItemModal(false); resetBuyItemForm(); }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleBuyItem}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Encontrar Objeto - Similar a Comprar */}
      {showFindItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Encontrar Objeto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Objeto</label>
                <select
                  value={findItemType}
                  onChange={(e) => setFindItemType(e.target.value as InventoryItemType)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="coins">Monedas</option>
                  <option value="armor">Armadura</option>
                  <option value="weapon">Arma</option>
                  <option value="potion">Poción</option>
                  <option value="scroll">Pergamino</option>
                  <option value="ammunition">Munición</option>
                  <option value="misc">Misceláneo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={findItemName}
                  onChange={(e) => setFindItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  value={findItemQuantity}
                  onChange={(e) => setFindItemQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Campos condicionales para Poción, Pergamino, Munición */}
              {(findItemType === 'potion' || findItemType === 'scroll' || findItemType === 'ammunition') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Subtipo</label>
                    <input
                      type="text"
                      value={findItemSubtype}
                      onChange={(e) => setFindItemSubtype(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Efecto</label>
                    <input
                      type="number"
                      value={findItemEffect}
                      onChange={(e) => setFindItemEffect(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Duración</label>
                    <input
                      type="text"
                      value={findItemDuration}
                      onChange={(e) => setFindItemDuration(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para Arma */}
              {findItemType === 'weapon' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Tipo de Arma</label>
                    <select
                      value={findItemWeaponType}
                      onChange={(e) => setFindItemWeaponType(e.target.value as any)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="melee">Melee</option>
                      <option value="ranged">Ranged</option>
                      <option value="shield">Shield</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Manos Requeridas</label>
                    <select
                      value={findItemRequiredHands}
                      onChange={(e) => setFindItemRequiredHands(parseInt(e.target.value) as 0 | 1 | 2)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dado de Daño (Qty)</label>
                    <input
                      type="number"
                      value={findItemDamageDiceQty}
                      onChange={(e) => setFindItemDamageDiceQty(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dado de Daño (Faces)</label>
                    <input
                      type="number"
                      value={findItemDamageDiceFaces}
                      onChange={(e) => setFindItemDamageDiceFaces(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center col-span-2">
                    <input
                      type="checkbox"
                      id="findItemEnchanted"
                      checked={findItemEnchanted}
                      onChange={(e) => setFindItemEnchanted(e.target.checked)}
                      className="mr-2 h-4 w-4 text-accent focus:ring-accent"
                    />
                    <label htmlFor="findItemEnchanted" className="text-xs">Encantado</label>
                  </div>
                  {findItemEnchanted && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Valor Encantamiento</label>
                      <input
                        type="number"
                        value={findItemEnchantmentValue}
                        onChange={(e) => setFindItemEnchantmentValue(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-1">Durabilidad Max</label>
                    <input
                      type="number"
                      value={findItemDurabilityMax}
                      onChange={(e) => setFindItemDurabilityMax(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Integridad</label>
                    <input
                      type="number"
                      value={findItemIntegrity}
                      onChange={(e) => setFindItemIntegrity(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para Armadura */}
              {findItemType === 'armor' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Resistencia Max</label>
                    <input
                      type="number"
                      value={findItemResistanceMax}
                      onChange={(e) => setFindItemResistanceMax(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Bloqueo Físico</label>
                    <input
                      type="number"
                      value={findItemBlockPhysical}
                      onChange={(e) => setFindItemBlockPhysical(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Bloqueo Mágico</label>
                    <input
                      type="number"
                      value={findItemBlockMagic}
                      onChange={(e) => setFindItemBlockMagic(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Mejora Física</label>
                    <input
                      type="number"
                      value={findItemEnhancementPhysical}
                      onChange={(e) => setFindItemEnhancementPhysical(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Mejora Mágica</label>
                    <input
                      type="number"
                      value={findItemEnhancementMagic}
                      onChange={(e) => setFindItemEnhancementMagic(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Integridad</label>
                    <input
                      type="number"
                      value={findItemIntegrityArmor}
                      onChange={(e) => setFindItemIntegrityArmor(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => { setShowFindItemModal(false); resetFindItemForm(); }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleFindItem}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Encontrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Añadir Hechizo */}
      {showAddSpellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Añadir Hechizo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Hechizo</label>
                <input
                  type="text"
                  value={newSpellName}
                  onChange={(e) => setNewSpellName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dificultad</label>
                <input
                  type="number"
                  value={newSpellDifficulty}
                  onChange={(e) => setNewSpellDifficulty(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coste de Maná</label>
                <input
                  type="number"
                  value={newSpellCost}
                  onChange={(e) => setNewSpellCost(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alcance</label>
                <input
                  type="text"
                  value={newSpellRange}
                  onChange={(e) => setNewSpellRange(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Efecto</label>
                <textarea
                  value={newSpellEffect}
                  onChange={(e) => setNewSpellEffect(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => { setShowAddSpellModal(false); setNewSpellName(''); setNewSpellDifficulty(0); setNewSpellCost(0); setNewSpellRange(''); setNewSpellEffect(''); }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSpell}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Añadir Nota */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Añadir Nota</h3>
            <div className="space-y-4">
              {/* Etiqueta fuera del textarea */}
              <label className="block text-sm font-medium mb-1">Contenido de la Nota</label>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Escribe aquí tu nota..."
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => { setShowAddNoteModal(false); setNewNoteContent(''); }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterActions;