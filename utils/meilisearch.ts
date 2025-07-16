import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILISEARCH_API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY;

export const meilisearchClient = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY,
});


export const { searchClient } = instantMeiliSearch(
    MEILISEARCH_HOST,
    MEILISEARCH_API_KEY,
    {
        primaryKey: 'ID',
        keepZeroFacets: true,
        finitePagination: true,
    }
);


export const MEILISEARCH_PRODUCTS_INDEX = 'products'

// Update faceting settings
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
        oneTypo: 0,
        twoTypos: 0
    }
})