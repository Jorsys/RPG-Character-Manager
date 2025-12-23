import React, { useState } from 'react';
import { Character, AlternatePersonality, InventoryItem, Spell, Note } from '../../types/types';

interface CharacterCreationProps {
  existingCharacter?: Character; // Si se pasa, es para editar
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ existingCharacter, onSave, onCancel }) => {
  const isEditing = !!existingCharacter;

  // Inicializar el estado con valores por defecto o con los del personaje existente
  const [formData, setFormData] = useState({
    image: existingCharacter?.image || '',
    name: existingCharacter?.name || '',
    alias: existingCharacter?.alias || '',
    race: existingCharacter?.race || '',
    class: existingCharacter?.class || '',
    level: existingCharacter?.level || 1,
    combatValues: {
      melee: existingCharacter?.combatValues.melee || 0,
      ranged: existingCharacter?.combatValues.ranged || 0,
      magic: existingCharacter?.combatValues.magic || 0,
    },
    status: {
      health: existingCharacter?.status.health || 10,
      stamina: existingCharacter?.status.stamina || 10,
      mana: existingCharacter?.status.mana || 10,
    },
    attributes: {
      perception: {
        search: existingCharacter?.attributes.perception.search || 0,
        stealth: existingCharacter?.attributes.perception.stealth || 0,
        observe: existingCharacter?.attributes.perception.observe || 0,
      },
      dexterity: {
        locks: existingCharacter?.attributes.dexterity.locks || 0,
        traps: existingCharacter?.attributes.dexterity.traps || 0,
        objects: existingCharacter?.attributes.dexterity.objects || 0,
      },
      agility: {
        acrobatics: existingCharacter?.attributes.agility.acrobatics || 0,
        disarm: existingCharacter?.attributes.agility.disarm || 0,
        riding: existingCharacter?.attributes.agility.riding || 0,
      },
      intelligence: {
        eloquence: existingCharacter?.attributes.intelligence.eloquence || 0,
        resolve: existingCharacter?.attributes.intelligence.resolve || 0,
      },
    },
    hasMultiplePersonalities: existingCharacter?.hasMultiplePersonalities || false,
    alternatePersonalities: existingCharacter?.alternatePersonalities || [],
    inventory: existingCharacter?.inventory || [],
    spellbook: existingCharacter?.spellbook || [],
    notes: existingCharacter?.notes || [],
    // No incluimos currentStatus aquí, se calcula al guardar
  });

  const [currentInventoryItem, setCurrentInventoryItem] = useState<Omit<InventoryItem, 'id'>>({ type: 'misc', name: '', quantity: 1 });
  const [currentSpell, setCurrentSpell] = useState<Omit<Spell, 'id'>>({ name: '', difficulty: 1, cost: 1, range: 'Corto', effect: '' });
  const [currentNote, setCurrentNote] = useState<Omit<Note, 'id'>>({ key: '', content: '' });
  const [isEditingPersonality, setIsEditingPersonality] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState<AlternatePersonality | Omit<AlternatePersonality, 'id'>>({
    name: '',
    alias: '',
    race: '',
    class: '',
    level: 1,
    combatValues: { melee: 0, ranged: 0, magic: 0 },
    status: { health: 10, stamina: 10, mana: 10 },
    attributes: {
      perception: { search: 0, stealth: 0, observe: 0 },
      dexterity: { locks: 0, traps: 0, objects: 0 },
      agility: { acrobatics: 0, disarm: 0, riding: 0 },
      intelligence: { eloquence: 0, resolve: 0 },
    },
    canAccessInventory: true,
    spellbook: [],
    notes: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => {
        const sectionValue = prev[section as keyof typeof formData];
        // Asegurarse de que sectionValue sea un objeto antes de hacer spread
        if (typeof sectionValue === 'object' && sectionValue !== null && !Array.isArray(sectionValue)) {
            return {
                ...prev,
                [section]: {
                    ...sectionValue, // <-- Spread seguro aquí
                    [field]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
                }
            };
        } else {
            // Si no es un objeto, no se puede hacer spread, devolver prev tal cual o manejar como corresponda
            console.warn(`No se puede actualizar la sección "${section}" porque no es un objeto.`);
            return prev;
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
      }));
    }
  };

  const handleCombatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      combatValues: {
        ...prev.combatValues,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [section]: {
          ...prev.attributes[section as keyof typeof prev.attributes],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  // --- Lógica para Personalidades Alternativas ---
  const handlePersonalityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setCurrentPersonality(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
        }
      }) as any);
    } else {
      setCurrentPersonality(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
      }));
    }
  };

  const handlePersonalityCombatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPersonality(prev => ({
      ...prev,
      combatValues: {
        ...(prev as AlternatePersonality).combatValues,
        [name]: parseInt(value) || 0
      }
    }) as AlternatePersonality);
  };

  const handlePersonalityStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPersonality(prev => ({
      ...prev,
      status: {
        ...(prev as AlternatePersonality).status,
        [name]: parseInt(value) || 0
      }
    }) as AlternatePersonality);
  };

  const handlePersonalityAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setCurrentPersonality(prev => ({
      ...prev,
      attributes: {
        ...(prev as AlternatePersonality).attributes,
        [section]: {
          ...(prev as AlternatePersonality).attributes[section as keyof (AlternatePersonality)["attributes"]],
          [field]: parseInt(value) || 0
        }
      }
    }) as AlternatePersonality);
  };

  const addPersonalityToList = () => {
    if (!currentPersonality.name.trim()) return;
    const newPersonality: AlternatePersonality = {
      ...currentPersonality,
      id: isEditingPersonality ? (currentPersonality as AlternatePersonality).id : Date.now().toString(), // Si está editando, mantener ID
      spellbook: (currentPersonality as AlternatePersonality).spellbook || [],
      notes: (currentPersonality as AlternatePersonality).notes || [],
    };
    setFormData(prev => ({
      ...prev,
      alternatePersonalities: isEditingPersonality
        ? prev.alternatePersonalities.map(p => p.id === newPersonality.id ? newPersonality : p)
        : [...prev.alternatePersonalities, newPersonality]
    }));
    resetPersonalityForm();
  };

  const resetPersonalityForm = () => {
    setCurrentPersonality({
      name: '',
      alias: '',
      race: '',
      class: '',
      level: 1,
      combatValues: { melee: 0, ranged: 0, magic: 0 },
      status: { health: 10, stamina: 10, mana: 10 },
      attributes: {
        perception: { search: 0, stealth: 0, observe: 0 },
        dexterity: { locks: 0, traps: 0, objects: 0 },
        agility: { acrobatics: 0, disarm: 0, riding: 0 },
        intelligence: { eloquence: 0, resolve: 0 },
      },
      canAccessInventory: true,
      spellbook: [],
      notes: [],
    });
    setIsEditingPersonality(false);
  };

  const editPersonality = (personality: AlternatePersonality) => {
    setCurrentPersonality(personality);
    setIsEditingPersonality(true);
  };

  const removePersonality = (id: string) => {
    setFormData(prev => ({
      ...prev,
      alternatePersonalities: prev.alternatePersonalities.filter(p => p.id !== id)
    }));
  };

  // --- Lógica para Inventario, Hechizos, Notas (misma que antes) ---
  const addInventoryItem = () => {
    if (!currentInventoryItem.name.trim()) return;
    const newItem: InventoryItem = {
      ...currentInventoryItem,
      id: Date.now().toString(), // ID temporal simple
    };
    setFormData(prev => ({
      ...prev,
      inventory: [...prev.inventory, newItem]
    }));
    setCurrentInventoryItem({ type: 'misc', name: '', quantity: 1 }); // Reset
  };

  const addSpell = () => {
    if (!currentSpell.name.trim()) return;
    const newSpell: Spell = {
      ...currentSpell,
      id: Date.now().toString(),
    };
    setFormData(prev => ({
      ...prev,
      spellbook: [...prev.spellbook, newSpell]
    }));
    setCurrentSpell({ name: '', difficulty: 1, cost: 1, range: 'Corto', effect: '' }); // Reset
  };

  const addNote = () => {
    if (!currentNote.key.trim() || !currentNote.content.trim()) return;
    const newNote: Note = {
      ...currentNote,
      id: Date.now().toString(),
    };
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    setCurrentNote({ key: '', content: '' }); // Reset
  };

  const removeInventoryItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item.id !== id)
    }));
  };

  const removeSpell = (id: string) => {
    setFormData(prev => ({
      ...prev,
      spellbook: prev.spellbook.filter(spell => spell.id !== id)
    }));
  };

  const removeNote = (id: string) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const characterToSave: Character = {
      ...formData,
      id: existingCharacter?.id || Date.now().toString(), // Si es edición, mantener ID
      currentStatus: { // Al crear/guardar, el estado actual es el máximo
        currentHealth: formData.status.health,
        currentStamina: formData.status.stamina,
        currentMana: formData.status.mana,
      }
    };
    // Si no tiene personalidades, asegurarse de que el campo no sea undefined o []
    if (!formData.hasMultiplePersonalities) {
      delete (characterToSave as any).alternatePersonalities; // Eliminar la propiedad si no aplica
    }
    onSave(characterToSave);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg border border-border p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{isEditing ? 'Editar Personaje' : 'Crear Nuevo Personaje'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alias</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input
              type="text"
              name="race"
              value={formData.race}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Clase</label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nivel</label>
            <input
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cuerpo a Cuerpo</label>
            <input
              type="number"
              name="melee"
              value={formData.combatValues.melee}
              onChange={handleCombatValueChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">A Distancia</label>
            <input
              type="number"
              name="ranged"
              value={formData.combatValues.ranged}
              onChange={handleCombatValueChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poder Mágico</label>
            <input
              type="number"
              name="magic"
              value={formData.combatValues.magic}
              onChange={handleCombatValueChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Puntos de Vida</label>
            <input
              type="number"
              name="health"
              value={formData.status.health}
              onChange={handleStatusChange}
              min="1"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Aguante</label>
            <input
              type="number"
              name="stamina"
              value={formData.status.stamina}
              onChange={handleStatusChange}
              min="1"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maná</label>
            <input
              type="number"
              name="mana"
              value={formData.status.mana}
              onChange={handleStatusChange}
              min="1"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Atributos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Percepción</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-text-secondary">Buscar</label>
                  <input
                    type="number"
                    name="perception.search"
                    value={formData.attributes.perception.search}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Sigilo</label>
                  <input
                    type="number"
                    name="perception.stealth"
                    value={formData.attributes.perception.stealth}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Observar</label>
                  <input
                    type="number"
                    name="perception.observe"
                    value={formData.attributes.perception.observe}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Destreza</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-text-secondary">Cerraduras</label>
                  <input
                    type="number"
                    name="dexterity.locks"
                    value={formData.attributes.dexterity.locks}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Trampas</label>
                  <input
                    type="number"
                    name="dexterity.traps"
                    value={formData.attributes.dexterity.traps}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Objetos</label>
                  <input
                    type="number"
                    name="dexterity.objects"
                    value={formData.attributes.dexterity.objects}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Agilidad</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-text-secondary">Acrobacia</label>
                  <input
                    type="number"
                    name="agility.acrobatics"
                    value={formData.attributes.agility.acrobatics}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Desarmar</label>
                  <input
                    type="number"
                    name="agility.disarm"
                    value={formData.attributes.agility.disarm}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Equitación</label>
                  <input
                    type="number"
                    name="agility.riding"
                    value={formData.attributes.agility.riding}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Inteligencia</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-text-secondary">Elocuencia</label>
                  <input
                    type="number"
                    name="intelligence.eloquence"
                    value={formData.attributes.intelligence.eloquence}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary">Resolver</label>
                  <input
                    type="number"
                    name="intelligence.resolve"
                    value={formData.attributes.intelligence.resolve}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasMultiplePersonalities"
            name="hasMultiplePersonalities"
            checked={formData.hasMultiplePersonalities}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-accent focus:ring-accent"
          />
          <label htmlFor="hasMultiplePersonalities" className="block text-sm font-medium">
            Tiene Múltiples Personalidades
          </label>
        </div>

        {/* Sección de Personalidades Alternativas - Solo visible si está marcado el checkbox */}
        {formData.hasMultiplePersonalities && (
          <div className="bg-background p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-text-primary mb-2">Personalidades Alternativas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={currentPersonality.name}
                  onChange={handlePersonalityChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alias</label>
                <input
                  type="text"
                  name="alias"
                  value={currentPersonality.alias}
                  onChange={handlePersonalityChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raza</label>
                <input
                  type="text"
                  name="race"
                  value={currentPersonality.race}
                  onChange={handlePersonalityChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clase</label>
                <input
                  type="text"
                  name="class"
                  value={currentPersonality.class}
                  onChange={handlePersonalityChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nivel</label>
                <input
                  type="number"
                  name="level"
                  value={currentPersonality.level}
                  onChange={handlePersonalityChange}
                  min="1"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canAccessInventory"
                  name="canAccessInventory"
                  checked={currentPersonality.canAccessInventory}
                  onChange={handlePersonalityChange}
                  className="mr-2 h-4 w-4 text-accent focus:ring-accent"
                />
                <label htmlFor="canAccessInventory" className="block text-sm font-medium">
                  Puede acceder al inventario
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cuerpo a Cuerpo</label>
                <input
                  type="number"
                  name="melee"
                  value={currentPersonality.combatValues.melee}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">A Distancia</label>
                <input
                  type="number"
                  name="ranged"
                  value={currentPersonality.combatValues.ranged}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poder Mágico</label>
                <input
                  type="number"
                  name="magic"
                  value={currentPersonality.combatValues.magic}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Puntos de Vida</label>
                <input
                  type="number"
                  name="health"
                  value={currentPersonality.status.health}
                  onChange={handlePersonalityStatusChange}
                  min="1"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Aguante</label>
                <input
                  type="number"
                  name="stamina"
                  value={currentPersonality.status.stamina}
                  onChange={handlePersonalityStatusChange}
                  min="1"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maná</label>
                <input
                  type="number"
                  name="mana"
                  value={currentPersonality.status.mana}
                  onChange={handlePersonalityStatusChange}
                  min="1"
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="bg-card p-3 rounded border border-border mb-4">
              <h4 className="font-semibold text-text-primary text-sm mb-2">Atributos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <h5 className="text-xs font-medium mb-1">Percepción</h5>
                  <div className="space-y-1">
                    <div>
                      <label className="block text-xs text-text-secondary">Buscar</label>
                      <input
                        type="number"
                        name="perception.search"
                        value={currentPersonality.attributes.perception.search}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Sigilo</label>
                      <input
                        type="number"
                        name="perception.stealth"
                        value={currentPersonality.attributes.perception.stealth}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Observar</label>
                      <input
                        type="number"
                        name="perception.observe"
                        value={currentPersonality.attributes.perception.observe}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Destreza</h5>
                  <div className="space-y-1">
                    <div>
                      <label className="block text-xs text-text-secondary">Cerraduras</label>
                      <input
                        type="number"
                        name="dexterity.locks"
                        value={currentPersonality.attributes.dexterity.locks}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Trampas</label>
                      <input
                        type="number"
                        name="dexterity.traps"
                        value={currentPersonality.attributes.dexterity.traps}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Objetos</label>
                      <input
                        type="number"
                        name="dexterity.objects"
                        value={currentPersonality.attributes.dexterity.objects}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Agilidad</h5>
                  <div className="space-y-1">
                    <div>
                      <label className="block text-xs text-text-secondary">Acrobacia</label>
                      <input
                        type="number"
                        name="agility.acrobatics"
                        value={currentPersonality.attributes.agility.acrobatics}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Desarmar</label>
                      <input
                        type="number"
                        name="agility.disarm"
                        value={currentPersonality.attributes.agility.disarm}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Equitación</label>
                      <input
                        type="number"
                        name="agility.riding"
                        value={currentPersonality.attributes.agility.riding}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1">Inteligencia</h5>
                  <div className="space-y-1">
                    <div>
                      <label className="block text-xs text-text-secondary">Elocuencia</label>
                      <input
                        type="number"
                        name="intelligence.eloquence"
                        value={currentPersonality.attributes.intelligence.eloquence}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary">Resolver</label>
                      <input
                        type="number"
                        name="intelligence.resolve"
                        value={currentPersonality.attributes.intelligence.resolve}
                        onChange={handlePersonalityAttributeChange}
                        min="0"
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={addPersonalityToList}
              className="mb-3 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
            >
              {isEditingPersonality ? 'Actualizar Personalidad' : 'Añadir Personalidad'}
            </button>
            {isEditingPersonality && (
              <button
                type="button"
                onClick={resetPersonalityForm}
                className="mb-3 ml-2 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Cancelar Edición
              </button>
            )}

            <div className="max-h-40 overflow-y-auto">
              {formData.alternatePersonalities.map(personality => (
                <div key={personality.id} className="flex justify-between items-center p-1 border-b border-border">
                  <span className="text-sm">{personality.name} ({personality.race} - {personality.class})</span>
                  <div>
                    <button type="button" onClick={() => editPersonality(personality)} className="text-accent text-xs mr-2">Editar</button>
                    <button type="button" onClick={() => removePersonality(personality.id)} className="text-error text-xs">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secciones de Inventario, Grimorio, Bloc de Notas (mismo código que antes) */}
        <div className="bg-background p-4 rounded-lg border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Inventario</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <select
              value={currentInventoryItem.type}
              onChange={(e) => setCurrentInventoryItem({...currentInventoryItem, type: e.target.value as any})}
              className="col-span-1 px-2 py-1 bg-card border border-border rounded text-sm"
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
              placeholder="Nombre"
              value={currentInventoryItem.name}
              onChange={(e) => setCurrentInventoryItem({...currentInventoryItem, name: e.target.value})}
              className="col-span-2 px-2 py-1 bg-card border border-border rounded text-sm"
            />
            <input
              type="number"
              placeholder="Cant."
              value={currentInventoryItem.quantity}
              onChange={(e) => setCurrentInventoryItem({...currentInventoryItem, quantity: parseInt(e.target.value) || 1})}
              min="1"
              className="px-2 py-1 bg-card border border-border rounded text-sm"
            />
          </div>
          <button
            type="button"
            onClick={addInventoryItem}
            className="mb-3 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
          >
            + Añadir al Inventario
          </button>
          <div className="max-h-40 overflow-y-auto">
            {formData.inventory.map(item => (
              <div key={item.id} className="flex justify-between items-center p-1 border-b border-border">
                <span className="text-sm">{item.name} (x{item.quantity}) - {item.type}</span>
                <button type="button" onClick={() => removeInventoryItem(item.id)} className="text-error text-sm">Eliminar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Grimorio</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nombre"
              value={currentSpell.name}
              onChange={(e) => setCurrentSpell({...currentSpell, name: e.target.value})}
              className="col-span-2 px-2 py-1 bg-card border border-border rounded text-sm"
            />
            <input
              type="number"
              placeholder="Dif."
              value={currentSpell.difficulty}
              onChange={(e) => setCurrentSpell({...currentSpell, difficulty: parseInt(e.target.value) || 1})}
              min="1"
              className="px-2 py-1 bg-card border border-border rounded text-sm"
            />
            <input
              type="number"
              placeholder="Coste"
              value={currentSpell.cost}
              onChange={(e) => setCurrentSpell({...currentSpell, cost: parseInt(e.target.value) || 1})}
              min="1"
              className="px-2 py-1 bg-card border border-border rounded text-sm"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Alcance"
              value={currentSpell.range}
              onChange={(e) => setCurrentSpell({...currentSpell, range: e.target.value})}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm mb-1"
            />
            <textarea
              placeholder="Efecto"
              value={currentSpell.effect}
              onChange={(e) => setCurrentSpell({...currentSpell, effect: e.target.value})}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
              rows={2}
            />
          </div>
          <button
            type="button"
            onClick={addSpell}
            className="mb-3 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
          >
            + Añadir Hechizo
          </button>
          <div className="max-h-40 overflow-y-auto">
            {formData.spellbook.map(spell => (
              <div key={spell.id} className="p-1 border-b border-border">
                <p className="text-sm font-medium">{spell.name}</p>
                <p className="text-xs text-text-secondary">Dif: {spell.difficulty}, Coste: {spell.cost}</p>
                <button type="button" onClick={() => removeSpell(spell.id)} className="text-error text-xs">Eliminar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border border-border">
          <h3 className="font-semibold text-text-primary mb-2">Bloc de Notas</h3>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Clave (opcional)"
              value={currentNote.key}
              onChange={(e) => setCurrentNote({...currentNote, key: e.target.value})}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm mb-1"
            />
            <textarea
              placeholder="Contenido de la nota"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              className="w-full px-2 py-1 bg-card border border-border rounded text-sm"
              rows={2}
            />
          </div>
          <button
            type="button"
            onClick={addNote}
            className="mb-3 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark"
          >
            + Añadir Nota
          </button>
          <div className="max-h-40 overflow-y-auto">
            {formData.notes.map(note => (
              <div key={note.id} className="p-1 border-b border-border">
                <p className="text-sm font-medium">{note.key || 'Nota sin título'}</p>
                <p className="text-sm">{note.content}</p>
                <button type="button" onClick={() => removeNote(note.id)} className="text-error text-xs">Eliminar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Personaje'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterCreation;