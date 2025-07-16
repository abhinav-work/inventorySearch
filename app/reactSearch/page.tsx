'use client';

import 'instantsearch.css/themes/algolia-min.css';
import styles from './styles.module.css';

import {
  InstantSearch,
  Hits,
  SortBy,
  SearchBox,
  Pagination,
  ClearRefinements,
  RefinementList,
  Configure,
} from 'react-instantsearch';

import { MEILISEARCH_PRODUCTS_INDEX, searchClient } from '@/utils/meilisearch';
import Hit from './Hit';
import { capitalizeFirstLetter } from '@/common/functions';

const SearchPage = () => {
  return (
    <div className={styles.instantSearch}>
    

      <InstantSearch indexName={MEILISEARCH_PRODUCTS_INDEX} searchClient={searchClient}>
        <div>
          <div className={styles.leftPanel}>
            <ClearRefinements />

            <SortBy
              items={[
                { value: `${MEILISEARCH_PRODUCTS_INDEX}:CREATED_AT_UNIX:asc`, label: 'Oldest First' },
                { value: `${MEILISEARCH_PRODUCTS_INDEX}:CREATED_AT_UNIX:desc`, label: 'Latest First' },
                { value: `${MEILISEARCH_PRODUCTS_INDEX}:MAX_VARIANT_PRICE:desc`, label: 'High to Low' },
                { value: `${MEILISEARCH_PRODUCTS_INDEX}:MIN_VARIANT_PRICE:asc`, label: 'Low to High' },
              ]}
            />

            <h2>Vendors</h2>
            <RefinementList attribute="VENDOR" />

            <h2>Status</h2>
            <RefinementList
              attribute="STATUS"
              transformItems={(items) =>
                items.map((item) => ({
                  ...item,
                  label: capitalizeFirstLetter(item.label),
                }))
              }
            />

            <h2>Tags</h2>
            <RefinementList attribute="TAGS_ARRAY" />

            <Configure
              hitsPerPage={6}
              attributesToSnippet={['TITLE:20', 'DESCRIPTION:25']}
              snippetEllipsisText="..."
            />
          </div>

          <div className={styles.rightPanel}>
            <SearchBox />
            <Hits hitComponent={Hit} />
            <Pagination showLast />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export default SearchPage;