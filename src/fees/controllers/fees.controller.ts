import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { GlobalSwagger } from '../../common/decorators/global-swagger.decorator';
import { CalculateFeeDto, FeeDto } from '../dto/__index';
import { FeesService } from '../services/fees.service';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @GlobalSwagger(
    'Calcula el monto de la comision',
    'Calcula el monto de la comision',
    FeeDto
  )
  @Post()
  calculateFee(@Body() calculateFeeDto: CalculateFeeDto): Promise<FeeDto> {
    return this.feesService.calculateFee(calculateFeeDto);
  }
}
