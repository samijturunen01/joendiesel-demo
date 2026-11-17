import { useEffect } from 'react';
import type { PageMeta } from '@/data/site';

/**
 * Keeps <title> and the description in sync during client-side navigation.
 * On first load both are already in the prerendered HTML (scripts/prerender.mjs),
 * so crawlers and link previews never depend on JavaScript.
 */
export function useDocumentMeta(page: PageMeta) {
  useEffect(() => {
    document.title = page.title;
    const set = (selector: string, value: string) => document.head.querySelector(selector)?.setAttribute('content', value);
    set('meta[name="description"]', page.description);
    set('meta[property="og:title"]', page.title);
    set('meta[property="og:description"]', page.description);
  }, [page]);
}
