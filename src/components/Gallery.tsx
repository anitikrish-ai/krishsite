import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArtCollection,
  ArtMedium,
  ArtworkItem,
  INITIAL_ARTWORK,
  PRIMARY_COLLECTIONS,
} from '../data/artwork';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from './Icons';

type ViewMode = 'library' | 'collections';
type TimeScale = 'all' | 'months' | 'years';
type FilterKind = 'all' | 'traditional' | 'digital' | 'favorites';

const STORAGE_ARTWORK_KEY = 'krish_gallery_artwork_v1';
const STORAGE_COLLECTIONS_KEY = 'krish_gallery_collections_v1';

export const Gallery: React.FC = () => {
  const [artwork, setArtwork] = useState<ArtworkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ARTWORK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ArtworkItem[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_ARTWORK;
  });

  const [customCollections, setCustomCollections] = useState<ArtCollection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLECTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ArtCollection[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [timeScale, setTimeScale] = useState<TimeScale>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [filterKind, setFilterKind] = useState<FilterKind>('all');
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMedium, setNewMedium] = useState<ArtMedium>('traditional');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newDescription, setNewDescription] = useState('');
  const [newImageData, setNewImageData] = useState<string>('');

  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ARTWORK_KEY, JSON.stringify(artwork));
    } catch {
      // ignore quota errors for large base64 images
    }
  }, [artwork]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLLECTIONS_KEY, JSON.stringify(customCollections));
    } catch {
      // ignore storage errors
    }
  }, [customCollections]);

  const allCollections = useMemo(
    () => [...PRIMARY_COLLECTIONS, ...customCollections],
    [customCollections]
  );

  const availablePeriods = useMemo(() => {
    if (timeScale === 'all') return [];
    const set = new Set<string>();
    artwork.forEach((item) => {
      if (!item.date) return;
      set.add(timeScale === 'years' ? item.date.slice(0, 4) : item.date.slice(0, 7));
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [artwork, timeScale]);

  const filteredArtwork = useMemo(() => {
    return artwork
      .filter((item) => {
        if (activeCollectionId) {
          if (activeCollectionId === 'traditional-art' && item.medium !== 'traditional') return false;
          if (activeCollectionId === 'digital-art' && item.medium !== 'digital') return false;
          if (
            activeCollectionId !== 'traditional-art' &&
            activeCollectionId !== 'digital-art' &&
            !item.collections?.includes(activeCollectionId)
          ) {
            return false;
          }
        }

        if (filterKind === 'traditional' && item.medium !== 'traditional') return false;
        if (filterKind === 'digital' && item.medium !== 'digital') return false;
        if (filterKind === 'favorites' && !item.favorite) return false;

        if (timeScale !== 'all' && selectedPeriod !== 'all') {
          const key = timeScale === 'years' ? item.date.slice(0, 4) : item.date.slice(0, 7);
          if (key !== selectedPeriod) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const haystack = [
            item.title,
            item.medium,
            item.description ?? '',
            item.date,
            ...(item.tags ?? []),
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [artwork, activeCollectionId, filterKind, timeScale, selectedPeriod, searchQuery]);

  // Keyboard navigation in Lightbox
  useEffect(() => {
    if (viewerIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerIndex(null);
        setZoom(1);
      } else if (e.key === 'ArrowRight') {
        setViewerIndex((idx) =>
          idx === null ? null : (idx + 1) % Math.max(filteredArtwork.length, 1)
        );
        setZoom(1);
      } else if (e.key === 'ArrowLeft') {
        setViewerIndex((idx) =>
          idx === null
            ? null
            : (idx - 1 + filteredArtwork.length) % Math.max(filteredArtwork.length, 1)
        );
        setZoom(1);
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))));
      } else if (e.key === '-') {
        setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerIndex, filteredArtwork.length]);

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkFavorite = () => {
    setArtwork((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, favorite: true } : item
      )
    );
    setSelectedIds([]);
    setSelectMode(false);
  };

  const handleBulkAssignCollection = (collectionId: string) => {
    if (!collectionId) return;
    setArtwork((prev) =>
      prev.map((item) => {
        if (!selectedIds.includes(item.id)) return item;
        const existing = item.collections ?? [];
        return existing.includes(collectionId)
          ? item
          : { ...item, collections: [...existing, collectionId] };
      })
    );
    setSelectedIds([]);
    setSelectMode(false);
  };

  const handleToggleFavoriteSingle = (id: string) => {
    setArtwork((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewImageData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageData || !newTitle.trim()) return;
    const item: ArtworkItem = {
      id: `art-${Date.now()}`,
      title: newTitle.trim(),
      src: newImageData,
      medium: newMedium,
      date: newDate,
      description: newDescription.trim() || undefined,
      collections: [newMedium === 'traditional' ? 'traditional-art' : 'digital-art'],
      favorite: false,
    };
    setArtwork((prev) => [item, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setNewImageData('');
    setShowAddModal(false);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const id = newCollectionName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setCustomCollections((prev) => [
      ...prev,
      {
        id,
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim() || 'Custom artwork collection.',
      },
    ]);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setShowNewCollectionModal(false);
  };

  const activeCollection = allCollections.find((c) => c.id === activeCollectionId) ?? null;
  const activeViewerItem = viewerIndex !== null ? filteredArtwork[viewerIndex] : null;

  return (
    <section id="gallery" className="gallery-section">
      <div className="container gallery-shell">
        {/* iOS Photos-inspired Header */}
        <div className="gallery-header">
          <div className="gallery-heading-wrap">
            <h2>{activeCollection ? activeCollection.name : 'Gallery'}</h2>
            <p className="gallery-count">
              {filteredArtwork.length} {filteredArtwork.length === 1 ? 'Artwork' : 'Artworks'}
              {activeCollection && (
                <>
                  {' '}
                  •{' '}
                  <button
                    type="button"
                    onClick={() => setActiveCollectionId(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-blue)',
                      cursor: 'pointer',
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    Back to All
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="gallery-top-controls">
            <div className="segmented-control" role="tablist" aria-label="Gallery View Mode">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'library'}
                className={`segmented-btn ${viewMode === 'library' ? 'is-active' : ''}`}
                onClick={() => {
                  setViewMode('library');
                  setActiveCollectionId(null);
                }}
              >
                Library
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'collections'}
                className={`segmented-btn ${viewMode === 'collections' ? 'is-active' : ''}`}
                onClick={() => setViewMode('collections')}
              >
                Collections
              </button>
            </div>

            <button
              type="button"
              className="glass-btn glass-btn--sm"
              onClick={() => setShowFilters((v) => !v)}
              aria-pressed={showFilters}
            >
              <FilterIcon size={15} />
              <span>Filter</span>
            </button>

            <button
              type="button"
              className="glass-btn glass-btn--sm"
              onClick={() => {
                setSelectMode((v) => !v);
                setSelectedIds([]);
              }}
              aria-pressed={selectMode}
            >
              <span>{selectMode ? 'Cancel' : 'Select'}</span>
            </button>

            <button
              type="button"
              className="glass-btn glass-btn--icon"
              onClick={() => setShowSearch((v) => !v)}
              aria-label="Search artwork"
              aria-pressed={showSearch}
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="glass-btn glass-btn--sm glass-btn--primary"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon size={15} />
              <span>Add Art</span>
            </button>
          </div>
        </div>

        {/* Floating Search Bar */}
        {showSearch && (
          <div className="gallery-search-bar glass-surface">
            <SearchIcon size={17} />
            <input
              type="search"
              className="gallery-search-input"
              placeholder="Search by title, medium (traditional / digital), date, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search artwork"
            />
            {searchQuery && (
              <button
                type="button"
                className="glass-btn glass-btn--sm"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Filter Pills */}
        {showFilters && (
          <div className="gallery-filter-pills" role="group" aria-label="Artwork Category Filters">
            {(['all', 'traditional', 'digital', 'favorites'] as FilterKind[]).map((kind) => (
              <button
                key={kind}
                type="button"
                className={`glass-btn glass-btn--sm ${
                  filterKind === kind ? 'glass-btn--primary' : ''
                }`}
                onClick={() => setFilterKind(kind)}
              >
                {kind === 'all' && 'All Mediums'}
                {kind === 'traditional' && 'Traditional Art'}
                {kind === 'digital' && 'Digital Art'}
                {kind === 'favorites' && 'Favorites'}
              </button>
            ))}
          </div>
        )}

        {/* Bulk Selection Bar */}
        {selectMode && (
          <div className="gallery-bulk-bar glass-surface">
            <span>
              <strong>{selectedIds.length}</strong> selected
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                type="button"
                className="glass-btn glass-btn--sm"
                disabled={selectedIds.length === 0}
                onClick={handleBulkFavorite}
              >
                <HeartIcon size={14} filled />
                <span>Favorite</span>
              </button>

              <select
                aria-label="Add selected artwork to collection"
                className="glass-btn glass-btn--sm"
                defaultValue=""
                disabled={selectedIds.length === 0}
                onChange={(e) => handleBulkAssignCollection(e.target.value)}
              >
                <option value="" disabled>
                  Add to Collection...
                </option>
                {allCollections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Collections View */}
        {viewMode === 'collections' && !activeCollectionId ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 14,
              }}
            >
              <button
                type="button"
                className="glass-btn glass-btn--sm"
                onClick={() => setShowNewCollectionModal(true)}
              >
                <PlusIcon size={15} />
                <span>New Collection</span>
              </button>
            </div>

            <div className="collections-grid">
              {allCollections.map((col) => {
                const items = artwork.filter((a) => {
                  if (col.id === 'traditional-art') return a.medium === 'traditional';
                  if (col.id === 'digital-art') return a.medium === 'digital';
                  return a.collections?.includes(col.id);
                });
                return (
                  <button
                    key={col.id}
                    type="button"
                    className="collection-card glass-surface"
                    onClick={() => {
                      setActiveCollectionId(col.id);
                      setViewMode('library');
                    }}
                  >
                    <div className="collection-thumb-strip">
                      {[0, 1, 2].map((slot) =>
                        items[slot] ? (
                          <img key={items[slot].id} src={items[slot].src} alt={items[slot].title} />
                        ) : (
                          <div key={slot} style={{ background: 'var(--surface-chip)' }} />
                        )
                      )}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.05rem' }}>{col.name}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {col.description}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: 8,
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Library / Edge-to-Edge Grid */
          <>
            {timeScale !== 'all' && availablePeriods.length > 0 && (
              <div className="gallery-filter-pills" style={{ marginBottom: 12 }}>
                <button
                  type="button"
                  className={`glass-btn glass-btn--sm ${
                    selectedPeriod === 'all' ? 'glass-btn--primary' : ''
                  }`}
                  onClick={() => setSelectedPeriod('all')}
                >
                  All {timeScale === 'years' ? 'Years' : 'Months'}
                </button>
                {availablePeriods.map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`glass-btn glass-btn--sm ${
                      selectedPeriod === period ? 'glass-btn--primary' : ''
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}

            {filteredArtwork.length === 0 ? (
              <div className="gallery-empty-state glass-surface">
                <h3 style={{ margin: 0 }}>Ready for Your Actual Artwork</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '52ch' }}>
                  No artwork files are loaded yet. Place your Traditional Art and Digital Art images in{' '}
                  <code>public/artwork/</code> and register them in <code>src/data/artwork.ts</code>, or click{' '}
                  <strong>Add Art</strong> to preview them right now in your browser.
                </p>
                <button
                  type="button"
                  className="glass-btn glass-btn--primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <PlusIcon size={16} />
                  <span>Add Artwork Preview</span>
                </button>
              </div>
            ) : (
              <div className="gallery-edge-grid-wrap">
                <div className="gallery-grid">
                  {filteredArtwork.map((item, idx) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="gallery-tile"
                        onClick={() => {
                          if (selectMode) {
                            toggleSelectId(item.id);
                          } else {
                            setViewerIndex(idx);
                            setZoom(1);
                          }
                        }}
                        aria-label={`${item.title} (${item.medium})`}
                      >
                        <img src={item.src} alt={item.title} loading="lazy" />

                        {item.favorite && !selectMode && (
                          <span className="gallery-tile-badge" aria-label="Favorite">
                            <HeartIcon size={13} filled />
                          </span>
                        )}

                        {selectMode && (
                          <span
                            className={`gallery-tile-select ${isSelected ? 'is-selected' : ''}`}
                            aria-hidden="true"
                          >
                            {isSelected && <CheckIcon size={13} />}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Floating Years / Months / All Pill */}
            <div className="gallery-bottom-dock">
              <div className="gallery-bottom-pill glass-pill" role="group" aria-label="Timeline Scale">
                {(['years', 'months', 'all'] as TimeScale[]).map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    className={`segmented-btn ${timeScale === scale ? 'is-active' : ''}`}
                    onClick={() => {
                      setTimeScale(scale);
                      setSelectedPeriod('all');
                    }}
                  >
                    {scale === 'years' ? 'Years' : scale === 'months' ? 'Months' : 'All'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Full-Screen Original-Quality Lightbox */}
      {activeViewerItem && viewerIndex !== null && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeViewerItem.title}
        >
          <div className="lightbox-topbar">
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              {viewerIndex + 1} / {filteredArtwork.length}
            </span>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => handleToggleFavoriteSingle(activeViewerItem.id)}
                aria-label="Toggle favorite"
              >
                <HeartIcon size={18} filled={activeViewerItem.favorite} />
              </button>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => setZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))}
                aria-label="Zoom out"
              >
                <ZoomOutIcon />
              </button>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))))}
                aria-label="Zoom in"
              >
                <ZoomInIcon />
              </button>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => {
                  setViewerIndex(null);
                  setZoom(1);
                }}
                aria-label="Close viewer"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div
            className="lightbox-stage"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(delta) > 48) {
                if (delta < 0) {
                  setViewerIndex((viewerIndex + 1) % filteredArtwork.length);
                } else {
                  setViewerIndex(
                    (viewerIndex - 1 + filteredArtwork.length) % filteredArtwork.length
                  );
                }
                setZoom(1);
              }
              touchStartX.current = null;
            }}
            onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}
          >
            <img
              src={activeViewerItem.src}
              alt={activeViewerItem.title}
              className="lightbox-img"
              style={{ transform: `scale(${zoom})` }}
            />

            {filteredArtwork.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox-nav-btn lightbox-nav-btn--prev"
                  onClick={() => {
                    setViewerIndex(
                      (viewerIndex - 1 + filteredArtwork.length) % filteredArtwork.length
                    );
                    setZoom(1);
                  }}
                  aria-label="Previous artwork"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  className="lightbox-nav-btn lightbox-nav-btn--next"
                  onClick={() => {
                    setViewerIndex((viewerIndex + 1) % filteredArtwork.length);
                    setZoom(1);
                  }}
                  aria-label="Next artwork"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </div>

          <div className="lightbox-meta">
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{activeViewerItem.title}</strong>
              {activeViewerItem.description && (
                <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#cbd5e1' }}>
                  {activeViewerItem.description}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <span className="chip">
                {activeViewerItem.medium === 'traditional' ? 'Traditional Art' : 'Digital Art'}
              </span>
              <span>{activeViewerItem.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Artwork Modal */}
      {showAddModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add Artwork">
          <form className="modal-card glass-surface" onSubmit={handleAddArtwork}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Add Artwork</h3>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <label className="form-field">
              <span>Image File (Original Quality)</span>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="form-input"
              />
            </label>

            <label className="form-field">
              <span>Title</span>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Pencil Character Sketch"
                className="form-input"
              />
            </label>

            <label className="form-field">
              <span>Collection / Medium</span>
              <select
                value={newMedium}
                onChange={(e) => setNewMedium(e.target.value as ArtMedium)}
                className="form-input"
              >
                <option value="traditional">Traditional Art</option>
                <option value="digital">Digital Art</option>
              </select>
            </label>

            <label className="form-field">
              <span>Creation Date</span>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="form-input"
              />
            </label>

            <label className="form-field">
              <span>Description (Optional)</span>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Pencil on paper, digital painting, etc."
                className="form-input"
              />
            </label>

            <button type="submit" className="glass-btn glass-btn--primary">
              Add to Gallery
            </button>
          </form>
        </div>
      )}

      {/* New Custom Collection Modal */}
      {showNewCollectionModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Create Custom Collection"
        >
          <form className="modal-card glass-surface" onSubmit={handleCreateCollection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>New Collection</h3>
              <button
                type="button"
                className="glass-btn glass-btn--icon"
                onClick={() => setShowNewCollectionModal(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <label className="form-field">
              <span>Collection Name</span>
              <input
                type="text"
                required
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Portraits or Ink Studies"
                className="form-input"
              />
            </label>

            <label className="form-field">
              <span>Description (Optional)</span>
              <input
                type="text"
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
                placeholder="Short note about this collection"
                className="form-input"
              />
            </label>

            <button type="submit" className="glass-btn glass-btn--primary">
              Create Collection
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
