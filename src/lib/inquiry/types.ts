import { components, manufacturers, type ComponentId, type Manufacturer } from '@/data/equipment';

export type Topic = 'vianetsinta' | 'suuttimet-ja-pumput' | 'common-rail' | 'varaosat' | 'rahoitus' | 'muu';

export const topicOptions: { id: Topic; label: string }[] = [
  { id: 'vianetsinta', label: 'Vianetsintä ja huolto' },
  { id: 'suuttimet-ja-pumput', label: 'Suuttimet ja pumput' },
  { id: 'common-rail', label: 'Common rail' },
  { id: 'varaosat', label: 'Varaosat ja tarvikkeet' },
  { id: 'rahoitus', label: 'Rahoitus' },
  { id: 'muu', label: 'Muu asia' },
];

export type MakerChoice = Manufacturer['id'] | 'muu';
export type ComponentChoice = ComponentId | 'muu';

export const makerOptions: { id: MakerChoice; label: string }[] = [
  ...manufacturers.map((m) => ({ id: m.id, label: m.aka ? `${m.name} (${m.aka})` : m.name })),
  { id: 'muu', label: 'Muu / en tiedä' },
];

export const componentOptions: { id: ComponentChoice; label: string }[] = [
  ...components.map((c) => ({ id: c.id, label: c.name })),
  { id: 'muu', label: 'Muu / en tiedä' },
];

export interface InquiryRequest {
  topic: Topic | '';
  maker: MakerChoice | '';
  component: ComponentChoice | '';
  vehicle: string;
  partNumber: string;
  message: string;
  name: string;
  phone: string;
  email: string;
}

export const emptyInquiry: InquiryRequest = {
  topic: '',
  maker: '',
  component: '',
  vehicle: '',
  partNumber: '',
  message: '',
  name: '',
  phone: '',
  email: '',
};

export type InquiryField = keyof InquiryRequest | 'contact';
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export const maxLengths: Partial<Record<keyof InquiryRequest, number>> = {
  vehicle: 120,
  partNumber: 60,
  message: 2000,
  name: 100,
  phone: 30,
  email: 120,
};
