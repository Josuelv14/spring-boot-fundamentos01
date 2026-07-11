export declare class UserSummaryDto {
    id: number;
    name: string;
    email: string;
}
export declare class CategorySummaryDto {
    id: number;
    name: string;
    description?: string;
}
export declare class ProductResponseDto {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
    user: UserSummaryDto;
    categories: CategorySummaryDto[];
    createdAt: Date;
    updatedAt: Date;
}
