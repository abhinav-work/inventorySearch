interface PriceAmountAndCurrencyCode {
  amount: number;
  currency_code: string;
}

export interface PriceRange {
  max_variant_price: PriceAmountAndCurrencyCode;
  min_variant_price: PriceAmountAndCurrencyCode;
}


export interface Product {
  ADMIN_GRAPHQL_API_ID: string;
  BODY_HTML: string;
  CREATED_AT: string;
  DELETED_AT: string;
  DELETED_DESCRIPTION: string;
  DELETED_MESSAGE: string;
  DESCRIPTION: string;
  DESCRIPTION_HTML: string;
  FEATURED_IMAGE: string;
  FEATURED_MEDIA: string;
  FEEDBACK: string;
  HANDLE: string;
  HAS_ONLY_DEFAULT_VARIANT: string; // "TRUE" or "FALSE"
  HAS_OUT_OF_STOCK_VARIANTS: string; // "TRUE" or "FALSE"
  ID: string;
  IMAGE: string;
  IMAGES: string; // JSON string array
  IS_GIFT_CARD: string; // "TRUE" or "FALSE"
  LEGACY_RESOURCE_ID: string;
  MEDIA_COUNT: string;
  METAFIELDS: string;
  ONLINE_STORE_PREVIEW_URL: string;
  ONLINE_STORE_URL: string;
  OPTIONS: string;
  PRICE_RANGE: string;
  PRICE_RANGE_V2: string;
  PRODUCT_TYPE: string;
  PUBLISHED_AT: string;
  PUBLISHED_SCOPE: string;
  REQUIRES_SELLIN_PLAN: string;
  SEO: string;
  SEO_1: string;
  SHOP_URL: string;
  STATUS: string;
  TAGS: string;
  TEMPLATE_SUFFIX: string;
  TITLE: string;
  TOTAL_INVENTORY: string;
  TOTAL_VARIANTS: string;
  TRACKS_INVENTORY: string; // "TRUE" or "FALSE"
  UPDATED_AT: string;
  VARIANTS: string;
  VENDOR: string;
  "_AIRBYTE_EXTRACTED_AT": string;
  "_AIRBYTE_GENERATION_ID": string;
  "_AIRBYTE_META": string;
  "_AIRBYTE_RAW_ID": string;
}

export interface FEATURED_IMAGE {
    alt_text: string | null;
    url: string;
    id: string;
}