import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    userId: string,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const items = await Promise.all(
      createInvoiceDto.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId);

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }
        await this.productsService.updateStock(item.productId, item.quantity);

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity,
        };
      }),
    );

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const invoice = await this.invoiceModel.create({
      userId,
      items,
      total,
    });

    return new InvoiceResponseDto(invoice.toJSON());
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceModel
      .find()
      .populate('userId', 'name email');
    return invoices.map(
      (invoice: Invoice) => new InvoiceResponseDto(invoice.toJSON()),
    );
  }

  async findOne(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('userId', 'name email');
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return new InvoiceResponseDto(invoice.toJSON());
  }

  async findByUser(userId: string): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceModel
      .find({ userId })
      .populate('userId', 'name email');
    return invoices.map(
      (invoice: Invoice) => new InvoiceResponseDto(invoice.toJSON()),
    );
  }

  async getMonthlyPurchases(userId: string): Promise<number> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const purchases = await this.invoiceModel.countDocuments({
      userId,
      createdAt: { $gte: oneMonthAgo },
    });

    return purchases;
  }
}
