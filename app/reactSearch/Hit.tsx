'use client';

import moment from 'moment';
import { Highlight, Snippet } from 'react-instantsearch';
import styles from './styles.module.css';
import { capitalizeFirstLetter } from '@/common/functions';

const Hit = ({ hit }: any) => {
  const imageUrl = hit.FEATURED_IMAGE_URL || '/productPlaceHolder.webp';
  const createdAt = hit.createdAt
    ? moment(hit.createdAt).format('MMM DD, YYYY')
    : 'N/A';

  return (
    <div className={styles.hitCard}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={hit.TITLE || 'Product'}
          className={styles.productImage}
        />
        <div className={styles[`${hit.STATUS.toLowerCase()}Badge`]}>
          {capitalizeFirstLetter(hit.STATUS)}
        </div>
      </div>

      <div className={styles.hitName}>
        <Highlight attribute="TITLE" hit={hit} />
      </div>

      <div className={styles.hitDescription}>
        Description: <Snippet attribute="DESCRIPTION" hit={hit} />
      </div>

       <div className={styles.hitInfo}>
        Vendor: <Highlight attribute="VENDOR" hit={hit} />
      </div>

      <div className={styles.hitInfo}>
        Min Price: {hit.MAX_VARIANT_CURRENCY_CODE} {hit.MIN_VARIANT_PRICE}
      </div>

      <div className={styles.hitInfo}>
        Max Price: {hit.MIN_VARIANT_CURRENCY_CODE} {hit.MAX_VARIANT_PRICE}
      </div>

      <div className={styles.hitInfo}>Created On: {createdAt}</div>
    </div>
  );
};

export default Hit;
