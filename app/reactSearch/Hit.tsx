'use client';

import moment from 'moment';
import { Highlight, Snippet } from 'react-instantsearch';
import styles from './styles.module.css';
import { capitalizeFirstLetter } from '@/common/functions';
import { useState, useEffect } from 'react';

const Hit = ({ hit }: any) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const imageUrl = hit.FEATURED_IMAGE_URL || '/productPlaceHolder.webp';
    const createdAt = hit.CREATED_AT
        ? moment(hit.CREATED_AT).format('MMM DD, YYYY')
        : 'N/A';

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handlePopupClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleBackdropClick = () => {
        setIsPopupVisible(false);
    };

    // Close popup on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPopupVisible) {
                setIsPopupVisible(false);
            }
        };

        if (isPopupVisible) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isPopupVisible]);

    return (
        <>
            <div
                className={styles.hitCard}
                onClick={handleCardClick}
            >
                <div className={styles.imageWrapper}>
                    <img src={imageUrl} alt={hit.TITLE || 'Product'} className={styles.productImage} />
                    <div className={styles[`${hit.STATUS.toLowerCase()}Badge`]}>
                        {capitalizeFirstLetter(hit.STATUS)}
                    </div>
                </div>

                <div className={styles.hitName}>
                    <Highlight attribute="TITLE" hit={hit} />
                </div>

                <div className={styles.hitDescription}>
                    <Snippet attribute="DESCRIPTION" hit={hit} />
                </div>

                <div className={styles.hitInfo}>
                    <span>Vendor:</span>
                    <Highlight attribute="VENDOR" hit={hit} />
                </div>

                <div className={styles.hitInfo}>
                    <span>Min Price:</span>
                    <span>{hit.MIN_VARIANT_CURRENCY_CODE} {hit.MIN_VARIANT_PRICE}</span>
                </div>

                <div className={styles.hitInfo}>
                    <span>Max Price:</span>
                    <span>{hit.MAX_VARIANT_CURRENCY_CODE} {hit.MAX_VARIANT_PRICE}</span>
                </div>

                <div className={styles.hitInfo}>
                    <span>Created:</span>
                    <span>{createdAt}</span>
                </div>
            </div>

            {isPopupVisible && (
                <>
                    <div className={styles.popupBackdrop} onClick={handleBackdropClick} />
                    <div className={styles.productModal} onClick={handlePopupClick}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Product Details</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={handleClosePopup}
                                    aria-label="Close modal"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.modalImageSection}>
                                    <div className={styles.modalImageWrapper}>
                                        <img
                                            src={imageUrl}
                                            alt={hit.TITLE || 'Product'}
                                            className={styles.modalImage}
                                        />
                                        <div className={styles[`modal${capitalizeFirstLetter(hit.STATUS.toLowerCase())}Badge`]}>
                                            {capitalizeFirstLetter(hit.STATUS)}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.modalDetailsSection}>
                                    <div className={styles.modalProductInfo}>
                                        <h1 className={styles.modalProductTitle}>
                                            <Highlight attribute="TITLE" hit={hit} />
                                        </h1>

                                        <div className={styles.modalDescription}>
                                            <h3>Description</h3>
                                            <p><Snippet attribute="DESCRIPTION" hit={hit} /></p>
                                        </div>

                                        <div className={styles.modalPriceSection}>
                                            <h3>Pricing</h3>
                                            <div className={styles.modalPriceRange}>
                                                <div className={styles.priceItem}>
                                                    <span className={styles.priceLabel}>Starting Price:</span>
                                                    <span className={styles.modalPrice}>
                                                        {hit.MIN_VARIANT_CURRENCY_CODE} {hit.MIN_VARIANT_PRICE}
                                                    </span>
                                                </div>
                                                <div className={styles.priceItem}>
                                                    <span className={styles.priceLabel}>Maximum Price:</span>
                                                    <span className={styles.modalPrice}>
                                                        {hit.MAX_VARIANT_CURRENCY_CODE} {hit.MAX_VARIANT_PRICE}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.modalMetaSection}>
                                            <h3>Product Information</h3>
                                            <div className={styles.modalMetaGrid}>
                                                <div className={styles.modalMetaItem}>
                                                    <span className={styles.modalLabel}>Vendor:</span>
                                                    <span className={styles.modalValue}>
                                                        <Highlight attribute="VENDOR" hit={hit} />
                                                    </span>
                                                </div>

                                                <div className={styles.modalMetaItem}>
                                                    <span className={styles.modalLabel}>Number of Variants:</span>
                                                    <span className={styles.modalValue}>
                                                        {capitalizeFirstLetter(hit.TOTAL_VARIANTS)}
                                                    </span>
                                                </div>

                                                <div className={styles.modalMetaItem}>
                                                    <span className={styles.modalLabel}>Created On:</span>
                                                    <span className={styles.modalValue}>{createdAt}</span>
                                                </div>

                                                {hit.PRODUCT_TYPE && (
                                                    <div className={styles.modalMetaItem}>
                                                        <span className={styles.modalLabel}>Product Type:</span>
                                                        <span className={styles.modalValue}>{hit.PRODUCT_TYPE}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {hit.TAGS_ARRAY && hit.TAGS_ARRAY.length > 0 && (
                                            <div className={styles.modalTagsSection}>
                                                <h3>Tags</h3>
                                                <div className={styles.modalTagsList}>
                                                    {hit.TAGS_ARRAY.map((tag: string, index: number) => (
                                                        <span key={index} className={styles.modalTag}>{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Hit;