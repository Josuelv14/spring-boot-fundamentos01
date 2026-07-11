package ec.edu.ups.icc.fundamentos01.security;

import ec.edu.ups.icc.fundamentos01.security.entities.RoleEntity;
import ec.edu.ups.icc.fundamentos01.security.enums.RoleName;
import ec.edu.ups.icc.fundamentos01.security.repositories.RoleRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class SecurityDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SecurityDataInitializer.class);
    private final RoleRepository roleRepository;

    public SecurityDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        insertRoleIfNotExists(RoleName.ROLE_USER);
        insertRoleIfNotExists(RoleName.ROLE_ADMIN);
    }

    private void insertRoleIfNotExists(RoleName roleName) {
        if (!roleRepository.existsByName(roleName)) {
            RoleEntity role = new RoleEntity(roleName, roleName.getDescription());
            roleRepository.save(role);
            logger.info("Created default role: {}", roleName.name());
        }
    }
}
