import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILISEARCH_API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY;

export const meilisearchClient = new MeiliSearch({
    host: MEILISEARCH_HOST || '',
    apiKey: MEILISEARCH_API_KEY,
});


export const { searchClient } = instantMeiliSearch(
    MEILISEARCH_HOST || '',
    MEILISEARCH_API_KEY,
    {
        primaryKey: 'ID',
        keepZeroFacets: true,
        finitePagination: true,
    }
);


export const MEILISEARCH_PRODUCTS_INDEX = 'products'

await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateFaceting({
    maxValuesPerFacet: 1000,
    sortFacetValuesBy: {
        "*": "alpha",
        "TAGS_ARRAY": "count",
        "VENDOR": "count"
    }
})

await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateTypoTolerance({
    enabled: true,
    minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8
    }
})

await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateFilterableAttributes([
    'VENDOR',
    'STATUS',
    'TAGS_ARRAY',
    'PRODUCT_TYPE',
    'TRACKS_INVENTORY'
])
await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateSearchableAttributes([
    'TITLE',
    'DESCRIPTION',
    'VENDOR',
])
await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateSortableAttributes([
    'CREATED_AT_UNIX',
    'UPDATED_AT_UNIX',
    'MAX_VARIANT_PRICE',
    'MIN_VARIANT_PRICE'
])