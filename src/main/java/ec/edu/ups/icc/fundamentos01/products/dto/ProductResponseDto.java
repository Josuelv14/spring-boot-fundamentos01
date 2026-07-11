package ec.edu.ups.icc.fundamentos01.products.dto;

import ec.edu.ups.icc.fundamentos01.categories.dto.CategoryResponseDto;

import java.util.ArrayList;
import java.util.List;

public class ProductResponseDto {

    private Long id;
    private String name;
    private Double price;
    private Integer stock;
    private List<CategoryResponseDto> categories = new ArrayList<>();

    public ProductResponseDto() {
    }

    public ProductResponseDto(Long id, String name, Double price, Integer stock, List<CategoryResponseDto> categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.categories = categories;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public List<CategoryResponseDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryResponseDto> categories) {
        this.categories = categories;
    }
}
