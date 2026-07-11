package ec.edu.ups.icc.fundamentos01.products.repositories;

import ec.edu.ups.icc.fundamentos01.products.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    List<ProductEntity> findAllByDeletedFalse();

    @Query(
            value = """
                    SELECT p
                    FROM ProductEntity p
                    WHERE p.deleted = false
                    """,
            countQuery = """
                    SELECT COUNT(p)
                    FROM ProductEntity p
                    WHERE p.deleted = false
                    """
    )
    Page<ProductEntity> findActivePage(Pageable pageable);

    @Query("""
            SELECT p
            FROM ProductEntity p
            WHERE p.deleted = false
            """)
    Slice<ProductEntity> findActiveSlice(Pageable pageable);

    @Query(
            value = """
                    SELECT DISTINCT p
                    FROM ProductEntity p
                    JOIN p.categories c
                    WHERE c.id = :categoryId
                      AND p.deleted = false
                      AND (:name IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:name), '%'))
                      AND (:minPrice IS NULL OR p.price >= :minPrice)
                      AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT p)
                    FROM ProductEntity p
                    JOIN p.categories c
                    WHERE c.id = :categoryId
                      AND p.deleted = false
                      AND (:name IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:name), '%'))
                      AND (:minPrice IS NULL OR p.price >= :minPrice)
                      AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                    """
    )
    Page<ProductEntity> findByCategoryIdWithFiltersPage(
            @Param("categoryId") Long categoryId,
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT p
            FROM ProductEntity p
            JOIN p.categories c
            WHERE c.id = :categoryId
              AND p.deleted = false
              AND (:name IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:name), '%'))
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Slice<ProductEntity> findByCategoryIdWithFiltersSlice(
            @Param("categoryId") Long categoryId,
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable
    );

    @Query("""
            SELECT DISTINCT p
            FROM ProductEntity p
            JOIN p.categories c
            WHERE c.id = :categoryId
              AND p.deleted = false
              AND (:name IS NULL OR LOWER(p.name) LIKE CONCAT('%', LOWER(:name), '%'))
              AND (:minPrice IS NULL OR p.price >= :minPrice)
              AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    List<ProductEntity> findByCategoryIdWithFilters(
            @Param("categoryId") Long categoryId,
            @Param("name") String name,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

        // Slice filtrado por owner (solo productos activos del propietario)
        Slice<ProductEntity> findByOwnerIdAndDeletedFalse(Long ownerId, Pageable pageable);
}
