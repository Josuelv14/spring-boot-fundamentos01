package ec.edu.ups.icc.fundamentos01.products.mappers;

import ec.edu.ups.icc.fundamentos01.categories.mappers.CategoryMapper;
import ec.edu.ups.icc.fundamentos01.products.dto.CreateProductDto;
import ec.edu.ups.icc.fundamentos01.products.dto.ProductResponseDto;
import ec.edu.ups.icc.fundamentos01.products.entities.ProductEntity;
import ec.edu.ups.icc.fundamentos01.products.models.ProductModel;

import java.time.LocalDateTime;

public class ProductMapper {

    public static ProductEntity toEntity(CreateProductDto dto) {
        ProductEntity entity = new ProductEntity();
        entity.setName(dto.getName());
        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());
        entity.setCreatedAt(LocalDateTime.now());
        return entity;
    }

    public static ProductModel toModel(CreateProductDto dto) {
        ProductModel model = new ProductModel();
        model.setName(dto.getName());
        model.setPrice(dto.getPrice());
        model.setStock(dto.getStock());
        model.setCreatedAt(LocalDateTime.now());
        return model;
    }

    public static ProductResponseDto toResponse(ProductModel model) {
        ProductResponseDto response = new ProductResponseDto();
        response.setId(model.getId());
        response.setName(model.getName());
        response.setPrice(model.getPrice());
        response.setStock(model.getStock());
        return response;
    }

    public static ProductResponseDto toResponse(ProductEntity entity) {
        ProductResponseDto response = new ProductResponseDto();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setPrice(entity.getPrice());
        response.setStock(entity.getStock());
        if (entity.getCategories() != null) {
            response.setCategories(entity.getCategories()
                    .stream()
                    .map(CategoryMapper::toResponse)
                    .toList());
        }
        return response;
    }
}
