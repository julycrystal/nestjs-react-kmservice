import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationOutput {
    totalPages: number;
    totalItems: number;
    limit: number;
    currentPage: number;
    currentPageItems: number;
}

export class PaginationInput {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    pageNumber?: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    limit?: number;
}
