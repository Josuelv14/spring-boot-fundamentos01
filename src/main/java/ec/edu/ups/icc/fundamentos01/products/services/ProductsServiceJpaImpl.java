package ec.edu.ups.icc.fundamentos01.products.services;

import ec.edu.ups.icc.fundamentos01.categories.repositories.CategoryRepository;
import ec.edu.ups.icc.fundamentos01.core.dto.PaginationDto;
import ec.edu.ups.icc.fundamentos01.core.exception.BadRequestException;
import ec.edu.ups.icc.fundamentos01.core.exception.NotFoundException;
import ec.edu.ups.icc.fundamentos01.products.dto.CreateProductDto;
import ec.edu.ups.icc.fundamentos01.products.dto.PartialUpdateProductDto;
import ec.edu.ups.icc.fundamentos01.products.dto.ProductFilterByCategoryDto;
import ec.edu.ups.icc.fundamentos01.products.dto.ProductResponseDto;
import ec.edu.ups.icc.fundamentos01.products.dto.UpdateProductDto;
import ec.edu.ups.icc.fundamentos01.products.entities.ProductEntity;
import ec.edu.ups.icc.fundamentos01.products.mappers.ProductMapper;
import ec.edu.ups.icc.fundamentos01.products.repositories.ProductRepository;
import ec.edu.ups.icc.fundamentos01.security.services.UserDetailsImpl;
import ec.edu.ups.icc.fundamentos01.users.entity.UserEntity;
import ec.edu.ups.icc.fundamentos01.users.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductsServiceJpaImpl implements ProductsService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ProductsServiceJpaImpl(ProductRepository productRepository,
                                  CategoryRepository categoryRepository,
                                  UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<ProductResponseDto> findAll() {
        return productRepository.findAllByDeletedFalse()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> findAllPage(PaginationDto pagination) {
        Pageable pageable = createPageable(pagination);
        return productRepository.findActivePage(pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ProductResponseDto> findAllSlice(PaginationDto pagination, ec.edu.ups.icc.fundamentos01.security.services.UserDetailsImpl currentUser) {
        Pageable pageable = createPageable(pagination);
        Long ownerId = null;
        if (currentUser != null) {
            ownerId = currentUser.getId();
        }
        // Filtrar por owner: solo devolver productos que pertenezcan al usuario autenticado
        return productRepository.findByOwnerIdAndDeletedFalse(ownerId, pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public List<ProductResponseDto> findByCategoryIdWithFilters(Long categoryId, ProductFilterByCategoryDto filters) {
        if (!categoryRepository.existsByIdAndDeletedFalse(categoryId)) {
            throw new NotFoundException("Category not found");
        }

        String name = normalizeName(filters.getName());
        List<ProductEntity> products = productRepository.findByCategoryIdWithFilters(
                categoryId,
                name,
                filters.getMinPrice(),
                filters.getMaxPrice()
        );

        return products.stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> findByCategoryIdWithFiltersPage(Long categoryId, ProductFilterByCategoryDto filters, PaginationDto pagination) {
        if (!categoryRepository.existsByIdAndDeletedFalse(categoryId)) {
            throw new NotFoundException("Category not found");
        }

        String name = normalizeName(filters.getName());
        Pageable pageable = createPageable(pagination);

        return productRepository.findByCategoryIdWithFiltersPage(
                categoryId,
                name,
                filters.getMinPrice(),
                filters.getMaxPrice(),
                pageable
        ).map(ProductMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Slice<ProductResponseDto> findByCategoryIdWithFiltersSlice(Long categoryId, ProductFilterByCategoryDto filters, PaginationDto pagination) {
        if (!categoryRepository.existsByIdAndDeletedFalse(categoryId)) {
            throw new NotFoundException("Category not found");
        }

        String name = normalizeName(filters.getName());
        Pageable pageable = createPageable(pagination);

        return productRepository.findByCategoryIdWithFiltersSlice(
                categoryId,
                name,
                filters.getMinPrice(),
                filters.getMaxPrice(),
                pageable
        ).map(ProductMapper::toResponse);
    }

    @Override
    public Object findOne(Long id) {
        return productRepository.findById(id)
                .filter(entity -> !entity.isDeleted())
                .map(ProductMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    @Transactional
    public ProductResponseDto create(CreateProductDto dto, UserDetailsImpl currentUser) {
        UserEntity owner = findCurrentUserEntity(currentUser);
        ProductEntity entity = ProductMapper.toEntity(dto);
        entity.setOwner(owner);
        entity.setDeleted(false);
        entity.setCreatedAt(java.time.LocalDateTime.now());
        ProductEntity saved = productRepository.save(entity);
        return ProductMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public Object update(Long id, UpdateProductDto dto, UserDetailsImpl currentUser) {
        ProductEntity entity = findActiveProductOrThrow(id);
        validateOwnership(entity, currentUser);

        entity.setName(dto.getName());
        entity.setPrice(dto.getPrice());
        entity.setStock(dto.getStock());
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        return ProductMapper.toResponse(productRepository.save(entity));
    }

    @Override
    @Transactional
    public Object partialUpdate(Long id, PartialUpdateProductDto dto, UserDetailsImpl currentUser) {
        ProductEntity entity = findActiveProductOrThrow(id);
        validateOwnership(entity, currentUser);

        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getPrice() != null) {
            entity.setPrice(dto.getPrice());
        }
        if (dto.getStock() != null) {
            entity.setStock(dto.getStock());
        }
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        return ProductMapper.toResponse(productRepository.save(entity));
    }

    @Override
    @Transactional
    public Object delete(Long id, UserDetailsImpl currentUser) {
        ProductEntity entity = findActiveProductOrThrow(id);
        validateOwnership(entity, currentUser);

        entity.setDeleted(true);
        productRepository.save(entity);
        return new Object() {
            public final String message = "Deleted successfully";
        };
    }

    private ProductEntity findActiveProductOrThrow(Long id) {
        return productRepository.findById(id)
                .filter(product -> !product.isDeleted())
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    private UserEntity findCurrentUserEntity(UserDetailsImpl currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("Usuario no autenticado");
        }

        return userRepository.findByIdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new AccessDeniedException("Usuario no autorizado"));
    }

    private void validateOwnership(ProductEntity product, UserDetailsImpl currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("Usuario no autenticado");
        }

        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return;
        }

        if (product.getOwner() == null || product.getOwner().getId() == null) {
            throw new AccessDeniedException("El producto no tiene propietario válido");
        }

        if (!product.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("No puedes modificar productos ajenos");
        }
    }

    private boolean hasRole(UserDetailsImpl user, String role) {
        return user.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority -> authority.equals(role));
    }

    private Pageable createPageable(PaginationDto pagination) {
        String sortBy = normalizeSortBy(pagination.getSortBy());
        Sort.Direction direction = normalizeDirection(pagination.getDirection());
        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(pagination.getPage(), pagination.getSize(), sort);
    }

    private String normalizeSortBy(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "id";
        }

        return switch (sortBy) {
            case "id", "name", "price", "stock", "createdAt", "updatedAt" -> sortBy;
            default -> throw new BadRequestException("Campo de ordenamiento no permitido: " + sortBy);
        };
    }

    private Sort.Direction normalizeDirection(String direction) {
        if (direction == null || direction.isBlank()) {
            return Sort.Direction.ASC;
        }
        if (direction.equalsIgnoreCase("asc")) {
            return Sort.Direction.ASC;
        }
        if (direction.equalsIgnoreCase("desc")) {
            return Sort.Direction.DESC;
        }
        throw new BadRequestException("Dirección de ordenamiento no válida: " + direction);
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        return name.trim();
    }
}
