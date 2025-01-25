import { applyDecorators } from "@nestjs/common";
import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse
} from "@nestjs/swagger";


export function GlobalSwagger(
    sumaryOperation: string,
    descriptionOperation: string,
    typeResponse: any = null,
    status = 200
) {
    return applyDecorators(
        ApiOperation({ summary: sumaryOperation, description: descriptionOperation }),
        ApiResponse({
            description: "Ok",
            type: typeResponse,
            status: status
        }),
        ApiBadRequestResponse({ description: 'Bad Request' }),
        ApiNotFoundResponse({ description: 'Not Found' }),
        ApiBadGatewayResponse({ description: 'Bad Gateway' }),
        ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
    );
}