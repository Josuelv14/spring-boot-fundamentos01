package ec.edu.ups.icc.fundamentos01.users.mappers;

import ec.edu.ups.icc.fundamentos01.users.dto.CreateUserDto;
import ec.edu.ups.icc.fundamentos01.users.dto.UserResponseDto;
import ec.edu.ups.icc.fundamentos01.users.models.UserModel;

import java.time.LocalDateTime;

public class UserMapper {

    public static UserModel toModel(CreateUserDto dto) {
        UserModel model = new UserModel();
        model.setName(dto.getName());
        model.setEmail(dto.getEmail());
        model.setPassword(dto.getPassword());
        model.setPasswordHash("HASH_" + dto.getPassword());
        model.setCreatedAt(LocalDateTime.now());
        return model;
    }

    public static UserResponseDto toResponse(UserModel model) {
        UserResponseDto response = new UserResponseDto();
        response.setId(model.getId());
        response.setName(model.getName());
        response.setEmail(model.getEmail());
        return response;
    }
}
