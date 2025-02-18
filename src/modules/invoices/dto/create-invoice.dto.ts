import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import * as swagger from '@nestjs/swagger';

export class InvoiceItemDto {
  @swagger.ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  productId: string;

  @swagger.ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateInvoiceDto {
  @swagger.ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}
