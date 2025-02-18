import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, type: InvoiceResponseDto })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    // TODO: Get userId from JWT token once auth is implemented
    const userId = 'temporaryUserId';
    return this.invoicesService.create(userId, createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, type: [InvoiceResponseDto] })
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all invoices for a user' })
  @ApiResponse({ status: 200, type: [InvoiceResponseDto] })
  findByUser(@Param('userId') userId: string) {
    return this.invoicesService.findByUser(userId);
  }

  @Get('user/:userId/monthly-purchases')
  @ApiOperation({ summary: 'Get number of purchases in the last month' })
  @ApiResponse({ status: 200, type: Number })
  getMonthlyPurchases(@Param('userId') userId: string) {
    return this.invoicesService.getMonthlyPurchases(userId);
  }
}
