import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CalculateFeeDto {
    @ApiProperty({
        type: String,
        example: '1546',
        description: 'Id del cliente'
    })
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @ApiProperty({
        type: Number,
        example: 100,
        description: 'Monto a transferir'
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    amount: number;

    @ApiProperty({
        type: String,
        example: '604',
        description: 'Codigo de la moneda'
    })
    @IsString()
    @IsNotEmpty()
    currency: string;
}