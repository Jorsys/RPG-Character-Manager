import React, { useState, useEffect } from 'react';
import { Character, AlternatePersonality, Spell, Note } from '../../types/types';

interface CharacterCreationProps {
  existingCharacter?: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ existingCharacter, onSave, onCancel }) => {
  // Estado para el personaje principal
  const [formData, setFormData] = useState<Omit<Character, 'id' | 'currentStatus' | 'activePersonalityId'>>({
    image: '',
    name: '',
    alias: '',
    race: '',
    class: '',
    level: 0, // Cambiado de 1 a 0
    combatValues: {
      melee: 0,
      ranged: 0,
      magic: 0,
    },
    status: {
      health: 1, // Mínimo 1 para vida
      stamina: 0, // Cambiado de 1 a 0
      mana: 0,    // Cambiado de 1 a 0
    },
    attributes: {
      perception: {
        search: 0,
        stealth: 0,
        observe: 0,
      },
      dexterity: {
        locks: 0,
        traps: 0,
        objects: 0,
      },
      agility: {
        acrobatics: 0,
        disarm: 0,
        riding: 0,
      },
      intelligence: {
        eloquence: 0,
        resolve: 0,
      },
    },
    hasMultiplePersonalities: false, // Añadido
    alternatePersonalities: [],
    inventory: [],
    spellbook: [],
    notes: [],
  });

  // Estados para añadir hechizo
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellDifficulty, setNewSpellDifficulty] = useState(0);
  const [newSpellCost, setNewSpellCost] = useState(0);
  const [newSpellRange, setNewSpellRange] = useState('');
  const [newSpellEffect, setNewSpellEffect] = useState('');

  // Estados para añadir nota
  const [newNoteContent, setNewNoteContent] = useState(''); // Solo contenido

  // Estado para la personalidad alternativa actual (tipo AlternatePersonality)
  const [currentPersonality, setCurrentPersonality] = useState<Omit<AlternatePersonality, 'id'>>({
    image: '',
    name: '',
    alias: '',
    race: '',
    class: '',
    level: 0, // Cambiado de 1 a 0
    combatValues: {
      melee: 0,
      ranged: 0,
      magic: 0,
    },
    status: {
      health: 1, // Mínimo 1 para vida
      stamina: 0, // Cambiado de 1 a 0
      mana: 0,    // Cambiado de 1 a 0
    },
    attributes: {
      perception: {
        search: 0,
        stealth: 0,
        observe: 0,
      },
      dexterity: {
        locks: 0,
        traps: 0,
        objects: 0,
      },
      agility: {
        acrobatics: 0,
        disarm: 0,
        riding: 0,
      },
      intelligence: {
        eloquence: 0,
        resolve: 0,
      },
    },
    canAccessInventory: true,
    spellbook: [],
    notes: [],
    currentStatus: undefined, // Opcional
  });

  // Estados para añadir hechizo a personalidad
  const [newPersonalitySpellName, setNewPersonalitySpellName] = useState('');
  const [newPersonalitySpellDifficulty, setNewPersonalitySpellDifficulty] = useState(0);
  const [newPersonalitySpellCost, setNewPersonalitySpellCost] = useState(0);
  const [newPersonalitySpellRange, setNewPersonalitySpellRange] = useState('');
  const [newPersonalitySpellEffect, setNewPersonalitySpellEffect] = useState('');

  // Estados para añadir nota a personalidad
  const [newPersonalityNoteContent, setNewPersonalityNoteContent] = useState(''); // Solo contenido

  // Inicializar formulario si se edita un personaje existente
  useEffect(() => {
    if (existingCharacter) {
      const { id, currentStatus, activePersonalityId, ...rest } = existingCharacter;
      setFormData(rest);
    }
  }, [existingCharacter]);

  // Función para añadir un hechizo al personaje principal
  const addSpell = () => {
    if (newSpellName.trim() !== '') {
      const newSpell = {
        id: Date.now().toString(),
        name: newSpellName,
        difficulty: newSpellDifficulty,
        cost: newSpellCost,
        range: newSpellRange,
        effect: newSpellEffect,
      };
      setFormData(prev => ({
        ...prev,
        spellbook: [...prev.spellbook, newSpell],
      }));
      setNewSpellName('');
      setNewSpellDifficulty(0);
      setNewSpellCost(0);
      setNewSpellRange('');
      setNewSpellEffect('');
    }
  };

  // Función para añadir una nota al personaje principal
  const addNote = () => {
    if (newNoteContent.trim() !== '') {
      const key = `Nota-${Date.now()}`;
      const newNote = {
        id: Date.now().toString(),
        key: key,
        content: newNoteContent,
      };
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));
      setNewNoteContent('');
    }
  };

  // Función para añadir una personalidad alternativa
  const addPersonality = () => {
    if (currentPersonality.name && currentPersonality.alias) {
      const newPersonality: AlternatePersonality = {
        ...currentPersonality,
        id: Date.now().toString(),
      };
      setFormData(prev => ({
        ...prev,
        hasMultiplePersonalities: true, // Marcar que tiene personalidades
        alternatePersonalities: [...(prev.alternatePersonalities || []), newPersonality],
      }));
      // Resetear el formulario de personalidad
      setCurrentPersonality({
        image: '',
        name: '',
        alias: '',
        race: '',
        class: '',
        level: 0, // Cambiado de 1 a 0
        combatValues: {
          melee: 0,
          ranged: 0,
          magic: 0,
        },
        status: {
          health: 1, // Mínimo 1 para vida
          stamina: 0, // Cambiado de 1 a 0
          mana: 0,    // Cambiado de 1 a 0
        },
        attributes: {
          perception: {
            search: 0,
            stealth: 0,
            observe: 0,
          },
          dexterity: {
            locks: 0,
            traps: 0,
            objects: 0,
          },
          agility: {
            acrobatics: 0,
            disarm: 0,
            riding: 0,
          },
          intelligence: {
            eloquence: 0,
            resolve: 0,
          },
        },
        canAccessInventory: true,
        spellbook: [],
        notes: [],
        currentStatus: undefined, // Opcional
      });
    }
  };

  // Función para añadir hechizo a la personalidad actual
  const addPersonalitySpell = () => {
    if (newPersonalitySpellName.trim() !== '') {
      const newSpell = {
        id: Date.now().toString(),
        name: newPersonalitySpellName,
        difficulty: newPersonalitySpellDifficulty,
        cost: newPersonalitySpellCost,
        range: newPersonalitySpellRange,
        effect: newPersonalitySpellEffect,
      };
      setCurrentPersonality(prev => ({
        ...prev,
        spellbook: [...prev.spellbook, newSpell],
      }));
      setNewPersonalitySpellName('');
      setNewPersonalitySpellDifficulty(0);
      setNewPersonalitySpellCost(0);
      setNewPersonalitySpellRange('');
      setNewPersonalitySpellEffect('');
    }
  };

  // Función para añadir nota a la personalidad actual
  const addPersonalityNote = () => {
    if (newPersonalityNoteContent.trim() !== '') {
      const key = `Nota-${Date.now()}`;
      const newNote = {
        id: Date.now().toString(),
        key: key,
        content: newPersonalityNoteContent,
      };
      setCurrentPersonality(prev => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));
      setNewPersonalityNoteContent('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => {
        const sectionValue = prev[section as keyof typeof formData];
        if (typeof sectionValue === 'object' && sectionValue !== null && !Array.isArray(sectionValue)) {
            return {
                ...prev,
                [section]: {
                    ...sectionValue,
                    [field]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
                }
            };
        } else {
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

  const handlePersonalityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setCurrentPersonality(prev => {
        const sectionValue = prev[section as keyof typeof currentPersonality];
        if (typeof sectionValue === 'object' && sectionValue !== null && !Array.isArray(sectionValue)) {
            return {
                ...prev,
                [section]: {
                    ...sectionValue,
                    [field]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
                }
            };
        } else {
            console.warn(`No se puede actualizar la sección "${section}" porque no es un objeto.`);
            return prev;
        }
      });
    } else {
      setCurrentPersonality(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : (type === 'checkbox' ? checked : value),
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [name]: parseInt(value),
      },
    }));
  };

  const handlePersonalityStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPersonality(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [name]: parseInt(value),
      },
    }));
  };

  const handleCombatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      combatValues: {
        ...prev.combatValues,
        [name]: parseInt(value),
      },
    }));
  };

  const handlePersonalityCombatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPersonality(prev => ({
      ...prev,
      combatValues: {
        ...prev.combatValues,
        [name]: parseInt(value),
      },
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
          [field]: parseInt(value),
        }
      }
    }));
  };

  const handlePersonalityAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setCurrentPersonality(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [section]: {
          ...prev.attributes[section as keyof typeof prev.attributes],
          [field]: parseInt(value),
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const characterToSave: Character = {
      ...formData,
      id: existingCharacter?.id || Date.now().toString(),
    };
    onSave(characterToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div>
          <h2 className="text-xl font-bold mb-4">Personaje Principal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
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
                required
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
                required
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
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nivel</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Puntos de Vida</label>
              <input
                type="number"
                name="health"
                value={formData.status.health}
                onChange={handleStatusChange}
                min="1" // Mínimo 1 para vida
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Aguante</label>
              <input
                type="number"
                name="stamina"
                value={formData.status.stamina}
                onChange={handleStatusChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maná</label>
              <input
                type="number"
                name="mana"
                value={formData.status.mana}
                onChange={handleStatusChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Combate Cuerpo a Cuerpo</label>
                <input
                  type="number"
                  name="melee"
                  value={formData.combatValues.melee}
                  onChange={handleCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Combate a Distancia</label>
                <input
                  type="number"
                  name="ranged"
                  value={formData.combatValues.ranged}
                  onChange={handleCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Combate Mágico</label>
                <input
                  type="number"
                  name="magic"
                  value={formData.combatValues.magic}
                  onChange={handleCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Atributos</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Buscar</label>
                  <input
                    type="number"
                    name="perception.search"
                    value={formData.attributes.perception.search}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Sigilo</label>
                  <input
                    type="number"
                    name="perception.stealth"
                    value={formData.attributes.perception.stealth}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Observar</label>
                  <input
                    type="number"
                    name="perception.observe"
                    value={formData.attributes.perception.observe}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Cerraduras</label>
                  <input
                    type="number"
                    name="dexterity.locks"
                    value={formData.attributes.dexterity.locks}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Trampas</label>
                  <input
                    type="number"
                    name="dexterity.traps"
                    value={formData.attributes.dexterity.traps}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Manipular Objetos</label>
                  <input
                    type="number"
                    name="dexterity.objects"
                    value={formData.attributes.dexterity.objects}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Acrobacia</label>
                  <input
                    type="number"
                    name="agility.acrobatics"
                    value={formData.attributes.agility.acrobatics}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Desarmar</label>
                  <input
                    type="number"
                    name="agility.disarm"
                    value={formData.attributes.agility.disarm}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Equitación</label>
                  <input
                    type="number"
                    name="agility.riding"
                    value={formData.attributes.agility.riding}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Elocuencia</label>
                  <input
                    type="number"
                    name="intelligence.eloquence"
                    value={formData.attributes.intelligence.eloquence}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Resolver</label>
                  <input
                    type="number"
                    name="intelligence.resolve"
                    value={formData.attributes.intelligence.resolve}
                    onChange={handleAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div>
          <h2 className="text-xl font-bold mb-4">Grimorio</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Nombre del Hechizo</label>
                <input
                  type="text"
                  value={newSpellName}
                  onChange={(e) => setNewSpellName(e.target.value)}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Dificultad</label>
                <input
                  type="number"
                  value={newSpellDifficulty}
                  onChange={(e) => setNewSpellDifficulty(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Coste de Maná</label>
                <input
                  type="number"
                  value={newSpellCost}
                  onChange={(e) => setNewSpellCost(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Alcance</label>
                <input
                  type="text"
                  value={newSpellRange}
                  onChange={(e) => setNewSpellRange(e.target.value)}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Efecto</label>
              <textarea
                value={newSpellEffect}
                onChange={(e) => setNewSpellEffect(e.target.value)}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
              />
            </div>
            <button
              type="button"
              onClick={addSpell}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
            >
              Añadir Hechizo
            </button>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Hechizos Actuales</h3>
              {formData.spellbook.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.spellbook.map((spell) => (
                    <div key={spell.id} className="p-2 bg-background rounded border border-border">
                      <p className="font-medium">{spell.name}</p>
                      <p className="text-xs text-text-secondary">Dif: {spell.difficulty}, Coste: {spell.cost}, Alc: {spell.range}</p>
                      <p className="text-xs">{spell.effect}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-sm">No hay hechizos.</p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 mt-6">Bloc de Notas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contenido de la Nota</label>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Escribe aquí tu nota..."
              />
            </div>
            <button
              type="button"
              onClick={addNote}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
            >
              Añadir Nota
            </button>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Notas Actuales</h3>
              {formData.notes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.notes.map((note) => (
                    <div key={note.id} className="p-2 bg-background rounded border border-border">
                      <p>{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-sm">No hay notas.</p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 mt-6">Personalidades Alternativas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Personalidad</label>
              <input
                type="text"
                name="name"
                value={currentPersonality.name}
                onChange={handlePersonalityChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alias</label>
              <input
                type="text"
                name="alias"
                value={currentPersonality.alias}
                onChange={handlePersonalityChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Raza</label>
              <input
                type="text"
                name="race"
                value={currentPersonality.race}
                onChange={handlePersonalityChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Clase</label>
              <input
                type="text"
                name="class"
                value={currentPersonality.class}
                onChange={handlePersonalityChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nivel</label>
              <input
                type="number"
                name="level"
                value={currentPersonality.level}
                onChange={handlePersonalityChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Puntos de Vida</label>
              <input
                type="number"
                name="health"
                value={currentPersonality.status.health}
                onChange={handlePersonalityStatusChange}
                min="1" // Mínimo 1 para vida
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Aguante</label>
              <input
                type="number"
                name="stamina"
                value={currentPersonality.status.stamina}
                onChange={handlePersonalityStatusChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maná</label>
              <input
                type="number"
                name="mana"
                value={currentPersonality.status.mana}
                onChange={handlePersonalityStatusChange}
                min="0" // Cambiado de 1 a 0
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="canAccessInventory"
                name="canAccessInventory"
                checked={currentPersonality.canAccessInventory}
                onChange={(e) => handlePersonalityChange(e as any)} // any temporal
                className="mr-2 h-4 w-4 text-accent focus:ring-accent"
              />
              <label htmlFor="canAccessInventory" className="text-sm">Puede acceder al inventario</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Combate Cuerpo a Cuerpo</label>
                <input
                  type="number"
                  name="melee"
                  value={currentPersonality.combatValues.melee}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Combate a Distancia</label>
                <input
                  type="number"
                  name="ranged"
                  value={currentPersonality.combatValues.ranged}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Combate Mágico</label>
                <input
                  type="number"
                  name="magic"
                  value={currentPersonality.combatValues.magic}
                  onChange={handlePersonalityCombatValueChange}
                  min="0"
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Atributos</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Buscar</label>
                  <input
                    type="number"
                    name="perception.search"
                    value={currentPersonality.attributes.perception.search}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Sigilo</label>
                  <input
                    type="number"
                    name="perception.stealth"
                    value={currentPersonality.attributes.perception.stealth}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Observar</label>
                  <input
                    type="number"
                    name="perception.observe"
                    value={currentPersonality.attributes.perception.observe}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Cerraduras</label>
                  <input
                    type="number"
                    name="dexterity.locks"
                    value={currentPersonality.attributes.dexterity.locks}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Trampas</label>
                  <input
                    type="number"
                    name="dexterity.traps"
                    value={currentPersonality.attributes.dexterity.traps}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Manipular Objetos</label>
                  <input
                    type="number"
                    name="dexterity.objects"
                    value={currentPersonality.attributes.dexterity.objects}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Acrobacia</label>
                  <input
                    type="number"
                    name="agility.acrobatics"
                    value={currentPersonality.attributes.agility.acrobatics}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Desarmar</label>
                  <input
                    type="number"
                    name="agility.disarm"
                    value={currentPersonality.attributes.agility.disarm}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Equitación</label>
                  <input
                    type="number"
                    name="agility.riding"
                    value={currentPersonality.attributes.agility.riding}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Elocuencia</label>
                  <input
                    type="number"
                    name="intelligence.eloquence"
                    value={currentPersonality.attributes.intelligence.eloquence}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Resolver</label>
                  <input
                    type="number"
                    name="intelligence.resolve"
                    value={currentPersonality.attributes.intelligence.resolve}
                    onChange={handlePersonalityAttributeChange}
                    min="0"
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sección de Grimorio para Personalidad */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Grimorio de la Personalidad</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">Nombre del Hechizo</label>
                    <input
                      type="text"
                      value={newPersonalitySpellName}
                      onChange={(e) => setNewPersonalitySpellName(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Dificultad</label>
                    <input
                      type="number"
                      value={newPersonalitySpellDifficulty}
                      onChange={(e) => setNewPersonalitySpellDifficulty(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Coste de Maná</label>
                    <input
                      type="number"
                      value={newPersonalitySpellCost}
                      onChange={(e) => setNewPersonalitySpellCost(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Alcance</label>
                    <input
                      type="text"
                      value={newPersonalitySpellRange}
                      onChange={(e) => setNewPersonalitySpellRange(e.target.value)}
                      className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Efecto</label>
                  <textarea
                    value={newPersonalitySpellEffect}
                    onChange={(e) => setNewPersonalitySpellEffect(e.target.value)}
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={addPersonalitySpell}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                >
                  Añadir Hechizo a Personalidad
                </button>

                <div className="mt-2">
                  <h4 className="font-semibold text-sm mb-1">Hechizos Actuales</h4>
                  {currentPersonality.spellbook.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentPersonality.spellbook.map((spell) => (
                        <div key={spell.id} className="p-1 bg-background rounded border border-border text-xs">
                          <p className="font-medium">{spell.name}</p>
                          <p className="text-text-secondary">Dif: {spell.difficulty}, Coste: {spell.cost}, Alc: {spell.range}</p>
                          <p>{spell.effect}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-xs">No hay hechizos.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Bloc de Notas para Personalidad */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Bloc de Notas de la Personalidad</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Contenido de la Nota</label>
                  <textarea
                    value={newPersonalityNoteContent}
                    onChange={(e) => setNewPersonalityNoteContent(e.target.value)}
                    className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                    placeholder="Escribe aquí tu nota..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addPersonalityNote}
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm"
                >
                  Añadir Nota a Personalidad
                </button>

                <div className="mt-2">
                  <h4 className="font-semibold text-sm mb-1">Notas Actuales</h4>
                  {currentPersonality.notes.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentPersonality.notes.map((note) => (
                        <div key={note.id} className="p-1 bg-background rounded border border-border text-xs">
                          <p>{note.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-secondary text-xs">No hay notas.</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={addPersonality}
              className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
            >
              Añadir Personalidad
            </button>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Personalidades Actuales</h3>
              {(formData.alternatePersonalities || []).length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(formData.alternatePersonalities || []).map((personality) => (
                    <div key={personality.id} className="p-2 bg-background rounded border border-border">
                      <p className="font-medium">{personality.name} ({personality.alias})</p>
                      <p className="text-xs text-text-secondary">{personality.race} - {personality.class} (Nv. {personality.level})</p>
                      <p className="text-xs">Puede acceder al inventario: {personality.canAccessInventory ? 'Sí' : 'No'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-sm">No hay personalidades alternativas.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {existingCharacter ? 'Actualizar' : 'Crear'} Personaje
        </button>
      </div>
    </form>
  );
};

export default CharacterCreation;