package ec.edu.ups.icc.fundamentos01.products.services;

import ec.edu.ups.icc.fundamentos01.core.dto.PaginationDto;
import ec.edu.ups.icc.fundamentos01.products.dto.CreateProductDto;
import ec.edu.ups.icc.fundamentos01.products.dto.PartialUpdateProductDto;
import ec.edu.ups.icc.fundamentos01.products.dto.ProductFilterByCategoryDto;
import ec.edu.ups.icc.fundamentos01.products.dto.ProductResponseDto;
import ec.edu.ups.icc.fundamentos01.products.dto.UpdateProductDto;
import ec.edu.ups.icc.fundamentos01.security.services.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface ProductsService {

    List<ProductResponseDto> findAll();

    Page<ProductResponseDto> findAllPage(PaginationDto pagination);

    Slice<ProductResponseDto> findAllSlice(PaginationDto pagination, ec.edu.ups.icc.fundamentos01.security.services.UserDetailsImpl currentUser);

    List<ProductResponseDto> findByCategoryIdWithFilters(Long categoryId, ProductFilterByCategoryDto filters);

    Page<ProductResponseDto> findByCategoryIdWithFiltersPage(Long categoryId, ProductFilterByCategoryDto filters, PaginationDto pagination);

    Slice<ProductResponseDto> findByCategoryIdWithFiltersSlice(Long categoryId, ProductFilterByCategoryDto filters, PaginationDto pagination);

    Object findOne(Long id);

    ProductResponseDto create(CreateProductDto dto, UserDetailsImpl currentUser);

    Object update(Long id, UpdateProductDto dto, UserDetailsImpl currentUser);

    Object partialUpdate(Long id, PartialUpdateProductDto dto, UserDetailsImpl currentUser);

    Object delete(Long id, UserDetailsImpl currentUser);
}
