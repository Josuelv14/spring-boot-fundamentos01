package ec.edu.ups.icc.fundamentos01.products.services;

import ec.edu.ups.icc.fundamentos01.categories.repositories.CategoryRepository;
import ec.edu.ups.icc.fundamentos01.products.dto.UpdateProductDto;
import ec.edu.ups.icc.fundamentos01.products.entities.ProductEntity;
import ec.edu.ups.icc.fundamentos01.products.repositories.ProductRepository;
import ec.edu.ups.icc.fundamentos01.security.services.UserDetailsImpl;
import ec.edu.ups.icc.fundamentos01.users.entity.UserEntity;
import ec.edu.ups.icc.fundamentos01.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductsServiceJpaImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProductsServiceJpaImpl service;

    @Test
    void updateShouldRejectProductFromAnotherUser() {
        ProductEntity product = new ProductEntity();
        product.setId(10L);
        product.setName("Laptop");
        product.setPrice(100.0);
        product.setStock(5);

        UserEntity owner = new UserEntity(1L, "Owner", "owner@example.com", "hash");
        product.setOwner(owner);

        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        UserDetailsImpl currentUser = new UserDetailsImpl(
                2L,
                "Other",
                "other@example.com",
                "hash",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        assertThrows(AccessDeniedException.class, () -> service.update(
                10L,
                new UpdateProductDto("New name", 200.0, 6),
                currentUser
        ));

        verify(productRepository, never()).save(any());
    }
}
