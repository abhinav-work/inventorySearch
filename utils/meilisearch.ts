// lib/meili.ts
import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const MEILISEARCH_HOST = 'http://localhost:7700';
const MEILISEARCH_API_KEY = 'MASTER_KEY';

export const meilisearchClient = new MeiliSearch({
    host: MEILISEARCH_HOST,
    apiKey: MEILISEARCH_API_KEY, // use server-only admin key
});


export const { searchClient } = instantMeiliSearch(
    MEILISEARCH_HOST,
    MEILISEARCH_API_KEY, // use server-only admin key
    {
        finitePagination: true,
    }
);


export const MEILISEARCH_PRODUCTS_INDEX = 'products'