import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
console.log(process.env)
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST;
const MEILISEARCH_API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY;

export const meilisearchClient = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY, // use server-only admin key
});


export const { searchClient } = instantMeiliSearch(
    MEILISEARCH_HOST,
    MEILISEARCH_API_KEY, // use server-only admin key
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
        "*": "alpha",           // Default alphabetical for all facets
        "TAGS_ARRAY": "count",  // Sort tags by popularity (most used first)
        "VENDOR": "count"       // Sort vendors by popularity
    }
})

await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).updateTypoTolerance({
  enabled: true,
  minWordSizeForTypos: {
    oneTypo: 5,    // Allow one typo for words >= 5 characters
    twoTypos: 9    // Allow two typos for words >= 9 characters
  }
})