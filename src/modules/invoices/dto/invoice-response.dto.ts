import { Exclude, Expose, Type } from 'class-transformer';

class InvoiceItemResponseDto {
  @Expose()
  productId: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Expose()
  subtotal: number;
}

@Exclude()
export class InvoiceResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => InvoiceItemResponseDto)
  items: InvoiceItemResponseDto[];

  @Expose()
  total: number;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<InvoiceResponseDto>) {
    Object.assign(this, partial);
  }
}
