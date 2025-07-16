'use client';

import 'instantsearch.css/themes/algolia-min.css';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

import {
    InstantSearch,
    SortBy,
    SearchBox,
    Pagination,
    ClearRefinements,
    RefinementList,
    Configure,
    Hits,
} from 'react-instantsearch';

import { MEILISEARCH_PRODUCTS_INDEX, searchClient } from '@/utils/meilisearch';
import Hit from './Hit';
import { capitalizeFirstLetter } from '@/common/functions';
import toast from 'react-hot-toast';

const SearchPage = () => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const toggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const handleImportCSV = () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.csv,.xlsx,.xls';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fileInput.onchange = async (e: any) => {
                const file = (e?.target?.files || [])[0];
                if (!file) {
                    alert('❌ Import failed. Please try again.');
                }
                setIsImporting(true);

                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/uploadProducts', {
                    method: 'POST',
                    body: formData,
                    cache: 'no-cache'
                });
                const json: { message: string, success: boolean } = await res.json();
                console.log('Upload response:', json);
                if (json.success) {
                    toast.success(json.message);
                } else {
                    toast.error(json.message);
                }
                setIsImporting(false);
            };
            fileInput.click();
        } catch (error) {
            console.log(error)
            toast.error('Some error occurred');
        }
    };

    const handleClearInventory = () => {
        new Promise(async (resolve, reject) => {
            try {
                console.log('Clear Inventory Clicked')
                setShowClearConfirm(true);
                const res = await fetch('/api/deleteAllProducts', {
                    method: 'DELETE',
                    cache: 'no-cache'
                });
                const json: { message: string, success: boolean } = await res.json();
                if (json.success) {
                    toast.success(json.message);
                } else {
                    toast.error('Upload failed');
                }
                return resolve(true);
            } catch (error) {
                console.log(error)
                toast.error('Some error occurred');
            }
        })
    };

    const confirmClearInventory = async () => {
        try {
            // TODO: Implement your clear inventory logic here
            console.log('Clearing inventory...');

            // Example implementation:
            // const response = await fetch('/api/clear-inventory', {
            //   method: 'DELETE'
            // });

            // Simulate clear process
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert('✅ Inventory cleared successfully!');
            setShowClearConfirm(false);
        } catch (error) {
            console.error('Clear failed:', error);
            alert('❌ Failed to clear inventory. Please try again.');
        }
    };

    const cancelClearInventory = () => {
        setShowClearConfirm(false);
    };

    return (
        <div className={styles.instantSearch}>
            <InstantSearch indexName={MEILISEARCH_PRODUCTS_INDEX} searchClient={searchClient}>
                {/* Mobile Filter Toggle Button */}
                <button
                    className={styles.mobileFilterToggle}
                    onClick={toggleFilters}
                    aria-label="Toggle filters"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filters
                </button>

                <div>
                    <div className={`${styles.leftPanel} ${isFiltersOpen ? styles.filtersOpen : ''}`}>
                        {/* Mobile Close Button */}
                        <button
                            className={styles.mobileCloseButton}
                            onClick={closeFilters}
                            aria-label="Close filters"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.filterSection}>
                            <ClearRefinements />
                        </div>

                        <div className={styles.filterSection}>
                            <label className={styles.sortLabel}>Sort by:</label>
                            <SortBy
                                items={[
                                    { value: `${MEILISEARCH_PRODUCTS_INDEX}:CREATED_AT_UNIX:asc`, label: 'Oldest First' },
                                    { value: `${MEILISEARCH_PRODUCTS_INDEX}:CREATED_AT_UNIX:desc`, label: 'Latest First' },
                                    { value: `${MEILISEARCH_PRODUCTS_INDEX}:MIN_VARIANT_PRICE:asc`, label: 'Low to High' },
                                    { value: `${MEILISEARCH_PRODUCTS_INDEX}:MAX_VARIANT_PRICE:desc`, label: 'High to Low' },
                                ]}
                            />
                        </div>

                        <h2>Vendors</h2>
                        <RefinementList
                            attribute="VENDOR"
                            limit={20}
                            showMore={true}
                            showMoreLimit={1000}
                            searchable={true}
                            searchablePlaceholder="Search vendors..."
                            transformItems={(items) =>
                                items.sort((a, b) =>
                                    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                                )
                            }
                        />

                        <h2>Status</h2>
                        <RefinementList
                            attribute="STATUS"
                            transformItems={(items) =>
                                items
                                    .map((item) => ({
                                        ...item,
                                        label: capitalizeFirstLetter(item.label),
                                    }))
                                    .sort((a, b) =>
                                        a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                                    )
                            }
                        />

                        <h2>Tags</h2>
                        <RefinementList
                            attribute="TAGS_ARRAY"
                            limit={20}
                            showMore={true}
                            showMoreLimit={1000}
                            searchable={true}
                            searchablePlaceholder="Search tags..."
                            transformItems={(items) =>
                                items.sort((a, b) =>
                                    a.label.toLowerCase().localeCompare(b.label.toLowerCase())
                                )
                            }
                        />

                        <Configure
                            hitsPerPage={12}
                            snippetEllipsisText="..."
                        />
                    </div>

                    <div className={styles.rightPanel}>
                        <div className={styles.searchHeader}>
                            <div className={styles.searchRow}>
                                <SearchBox placeholder="Search products..." />
                                <div className={styles.actionButtons}>
                                    <button
                                        className={`${styles.importButton} ${isImporting ? styles.loading : ''}`}
                                        onClick={handleImportCSV}
                                        disabled={isImporting}
                                    >
                                        {isImporting ? (
                                            <>
                                                <div className={styles.spinner}></div>
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14,2 14,8 20,8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    <polyline points="10,9 9,9 8,9"></polyline>
                                                </svg>
                                                Import CSV
                                            </>
                                        )}
                                    </button>

                                    <button
                                        className={styles.clearButton}
                                        onClick={handleClearInventory}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3,6 5,6 21,6"></polyline>
                                            <path d="m19,6v14a2,2 0,0 1,-2,2H7a2,2 0,0 1,-2,-2V6m3,0V4a2,2 0,0 1,2,-2h4a2,2 0,0 1,2,2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                        Clear Inventory
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.resultsContainer}>
                            <Hits hitComponent={Hit} />
                        </div>

                        <div className={styles.paginationContainer}>
                            <Pagination showLast />
                        </div>
                    </div>
                </div>

                {/* Clear Confirmation Modal */}
                {showClearConfirm && (
                    <>
                        <div className={styles.modalBackdrop} onClick={cancelClearInventory} />
                        <div className={styles.confirmationModal}>
                            <div className={styles.modalContent}>
                                <div className={styles.modalHeader}>
                                    <div className={styles.warningIcon}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    </div>
                                    <h3>Clear Entire Inventory?</h3>
                                </div>

                                <div className={styles.modalBody}>
                                    <p>This action will permanently delete <strong>all products</strong> from your inventory.</p>
                                    <p>This action <strong>cannot be undone</strong>.</p>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={cancelClearInventory}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={styles.confirmButton}
                                        onClick={confirmClearInventory}
                                    >
                                        Yes, Clear Everything
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Mobile Overlay */}
                {isFiltersOpen && (
                    <div
                        className={styles.mobileOverlay}
                        onClick={closeFilters}
                        aria-hidden="true"
                    />
                )}
            </InstantSearch>
        </div>
    );
};

export default SearchPage;