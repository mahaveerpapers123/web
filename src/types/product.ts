export type Product = {
  id: string | number;
  name: string;
  model_name?: string | null;
  brand?: string | null;
  category_slug: string;
  price: number | string | null;
  discount_b2b?: number | null;
  discount_b2c?: number | null;
  b2b_price?: number | null;
  b2c_price?: number | null;
  description?: string | null;
  images?: unknown;
  imgs?: { thumbnails?: string[]; previews?: string[] } | string[] | string | null;
  published?: boolean;
  created_at?: string;
  reviews?: number | null;
};
