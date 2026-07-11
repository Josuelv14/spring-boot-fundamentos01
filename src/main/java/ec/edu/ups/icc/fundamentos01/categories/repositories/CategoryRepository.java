package ec.edu.ups.icc.fundamentos01.categories.repositories;

import ec.edu.ups.icc.fundamentos01.categories.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    boolean existsByIdAndDeletedFalse(Long id);
}
