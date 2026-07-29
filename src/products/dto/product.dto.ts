export class CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice?: number;
  quantity?: number;
  minStock?: number;
  unit?: string;
}

export class UpdateProductDto {
  sku?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  costPrice?: number;
  quantity?: number;
  minStock?: number;
  unit?: string;
}
