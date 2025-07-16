'use client'
import React from 'react';
import { InstantSearch, SearchBox, InfiniteHits, Pagination } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import 'instantsearch.css/themes/satellite.css';

const { searchClient } = instantMeiliSearch(
  'https://ms-adf78ae33284-106.lon.meilisearch.io',
  'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303', {
    
  }
);

const App = () => (
  <InstantSearch
    indexName="steam-videogames"
    searchClient={searchClient}
  >
    <SearchBox />
    <InfiniteHits hitComponent={Hit} />
    <Pagination showLast={true} />
  </InstantSearch>
);

const Hit = ({ hit }) => (
  <article key={hit.id}>
    <img src={hit.image} alt={hit.name} />
    <h1>{hit.name}</h1>
    <p>${hit.description}</p>
  </article>
);
export default App