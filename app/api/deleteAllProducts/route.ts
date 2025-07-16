// app/api/load/route.ts
import { NextResponse } from 'next/server';
import { MEILISEARCH_PRODUCTS_INDEX, meilisearchClient } from '@/utils/meilisearch';

export async function DELETE() {
    try {
        const index = meilisearchClient.index(MEILISEARCH_PRODUCTS_INDEX);
        const task = await index.deleteAllDocuments()
        return NextResponse.json({ success: true, message: `Documents deletion has been ${task.status}` });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Unknown error' });
    }
}