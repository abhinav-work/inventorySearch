// app/api/load/route.ts
import { NextResponse } from 'next/server';
import { MEILISEARCH_PRODUCTS_INDEX, meilisearchClient } from '@/utils/meilisearch';
import * as Papa from 'papaparse';
import { FEATURED_IMAGE, PriceRange, Product } from '@/types/product';
import moment from 'moment';

export async function POST(request: Request) {
  try {
    const CHUNK_SIZE = 500;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file received' });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const csvText = buffer.toString('utf-8');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, fields } = await new Promise<{ data: Product[]; fields: string[] }>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        complete: (results: any) => {
          resolve({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: results?.data as any[],
            fields: results?.meta?.fields || [],
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (err: any) => {
          reject(err);
        },
      });
    });

    if (!fields?.length || !data.length) {
      return NextResponse.json({ success: false, error: 'No file received' });
    }

    // console.log(fields);
    // console.log(data[0]);
    // console.log(data.length);

    let chunkCount = 1;
    const dataToConsider = [];
    for (let index = 0; index < data.length; index++) {
      let parsedPriceRange: PriceRange = { min_variant_price: { amount: 0, currency_code: 'USD' }, max_variant_price: { amount: 0, currency_code: 'USD' } },
        featuredImage: FEATURED_IMAGE = { id: '', url: '', alt_text: '' };
      if (data[index].PRICE_RANGE) {
        parsedPriceRange = JSON.parse(data[index].PRICE_RANGE);
      }
      if (data[index].FEATURED_IMAGE) {
        featuredImage = JSON.parse(data[index].FEATURED_IMAGE);
      }

      dataToConsider.push({
        ...data[index],
        id: data[index].ID,
        TAGS_ARRAY: ((data[index].TAGS?.split('|') || [])[0]?.split(',') || []).map(eachTag => eachTag.trim()),
        CREATED_AT_UNIX: moment(data[index].CREATED_AT).unix(),
        UPDATED_AT_UNIX: moment(data[index].UPDATED_AT).unix(),
        MIN_VARIANT_PRICE: parsedPriceRange?.min_variant_price?.amount,
        MIN_VARIANT_CURRENCY_CODE: parsedPriceRange?.min_variant_price?.currency_code,
        MAX_VARIANT_PRICE: parsedPriceRange?.max_variant_price?.amount,
        MAX_VARIANT_CURRENCY_CODE: parsedPriceRange?.max_variant_price?.currency_code,
        FEATURED_IMAGE_URL: featuredImage?.url
      })

      if (!(dataToConsider.length % CHUNK_SIZE) || (index == (data?.length-1))) {
        console.log(`Chunk (${chunkCount++}) of size ${CHUNK_SIZE} processed`);
        await meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX).addDocuments(dataToConsider, { primaryKey: 'ID' });
        dataToConsider.length = 0;
      }
    }

    return NextResponse.json({ success: true, message: `Documents import has been enqueued` });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' });
  }
}