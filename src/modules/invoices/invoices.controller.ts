import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { RequestWithUser } from './interfaces/request.interface';

@ApiTags('invoices')
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, type: InvoiceResponseDto })
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: RequestWithUser) {
    const userId = req.user.sub || req.user.id;
    if (!userId) {
      throw new Error('User ID not found in token');
    }
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
  @ApiOperation({ summary: 'Get all invoices for a specific user' })
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
