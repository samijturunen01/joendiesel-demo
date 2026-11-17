import { componentOptions, emptyInquiry, makerOptions, topicOptions, type InquiryRequest } from './types';

/**
 * Starting values from the URL, so links elsewhere can pre-select what the visitor was looking at:
 *   /yhteystiedot?aihe=common-rail&valmistaja=denso&laite=cr-suuttimet#tarjouspyynto
 * Unknown values are ignored – only options that really exist are accepted.
 */
export function prefillFromParams(params: URLSearchParams): InquiryRequest {
  const r: InquiryRequest = { ...emptyInquiry };
  const topic = params.get('aihe');
  if (topic && topicOptions.some((t) => t.id === topic)) r.topic = topic as InquiryRequest['topic'];
  const maker = params.get('valmistaja');
  if (maker && makerOptions.some((m) => m.id === maker)) r.maker = maker as InquiryRequest['maker'];
  const component = params.get('laite');
  if (component && componentOptions.some((c) => c.id === component)) r.component = component as InquiryRequest['component'];
  return r;
}
