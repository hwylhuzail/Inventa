import React, { useState } from 'react';
import { Invention, InventionCategory } from '../../types/invention';
import {
  Bookmark,
  Search,
  PlusCircle,
  Hammer,
  Bot,
  Edit2,
  Trash2,
  Star,
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';

interface MyInventionsScreenProps {
  inventions: Invention[];
  onSelectInvention: (inv: Invention) => void;
  onOpenPrototype: (inv: Invention) => void;
  onOpenAssistant: (inv: Invention) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteInvention: (id: string) => void;
  onUpdateInvention: (updated: Invention) => void;
  onNavigateCreate: () => void;
}

export const MyInventionsScreen: React.FC<MyInventionsScreenProps> = ({
  inventions,
  onSelectInvention,
  onOpenPrototype,
  onOpenAssistant,
  onToggleFavorite,
  onDeleteInvention,
  onUpdateInvention,
  onNavigateCreate
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Edit project modal state
  const [editingInvention, setEditingInvention] = useState<Invention | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(inventions.map((inv) => inv.category)))];

  const filtered = inventions.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      inv.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || inv.category === selectedCategory;
    const matchesFav = !showOnlyFavorites || inv.isFavorite;
    return matchesSearch && matchesCat && matchesFav;
  });

  const handleStartEdit = (inv: Invention, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingInvention(inv);
    setEditName(inv.name);
    setEditDesc(inv.shortDescription);
  };

  const handleSaveEdit = () => {
    if (!editingInvention) return;
    onUpdateInvention({
      ...editingInvention,
      name: editName.trim() || editingInvention.name,
      shortDescription: editDesc.trim() || editingInvention.shortDescription
    });
    setEditingInvention(null);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 pb-12 bg-[#0B0F19] text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            My Inventions Vault
          </h2>
          <p className="text-xs text-slate-400">
            {inventions.length} projects stored in your private local vault
          </p>
        </div>

        <button
          onClick={onNavigateCreate}
          className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Bar & Favorite Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            showOnlyFavorites
              ? 'bg-violet-900/40 border-violet-500 text-violet-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Filter Bookmarked"
        >
          <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-violet-400 text-violet-400' : ''}`} />
          <span className="hidden sm:inline">Favorites</span>
        </button>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Inventions List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center my-auto">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300 mb-1">
            No matching inventions found
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            Try adjusting your search filters or generate a new invention concept.
          </p>
          <button
            onClick={onNavigateCreate}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Create an Invention
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onSelectInvention(inv)}
              className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                    <span className="text-cyan-400 font-semibold">{inv.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{inv.inventionType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      ${inv.costRange?.min}-${inv.costRange?.max}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                    {inv.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(inv.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-violet-400 rounded-lg hover:bg-slate-800"
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${inv.isFavorite ? 'fill-violet-400 text-violet-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleStartEdit(inv, e)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800"
                    title="Edit Name & Description"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => confirmDelete(inv.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {inv.shortDescription}
              </p>

              {/* Progress & Quick Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{ width: `${inv.progressPercent || 0}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {inv.progressPercent || 0}% built
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAssistant(inv);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-violet-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Bot className="w-3 h-3 text-cyan-400" />
                    <span>Copilot</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPrototype(inv);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Hammer className="w-3 h-3" />
                    <span>Studio</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingInvention && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Edit Project Details</h3>
              <button
                onClick={() => setEditingInvention(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Executive Description
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingInvention(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3 text-center">
            <Trash2 className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will permanently remove the project and its prototype checklist from your local vault.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteInvention(deletingId);
                  setDeletingId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
