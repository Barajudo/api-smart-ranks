import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const createdProduct = await this.productModel.create(createProductDto);
    return new ProductResponseDto(createdProduct.toJSON());
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productModel.find();
    return products.map(
      (product: Product) => new ProductResponseDto(product.toJSON()),
    );
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return new ProductResponseDto(product.toJSON());
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return new ProductResponseDto(product.toJSON());
  }

  async remove(id: string): Promise<boolean> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return true;
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStock = product.stock - quantity;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stock = newStock;
    await product.save();

    return new ProductResponseDto(product.toJSON());
  }
}
