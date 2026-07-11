package ec.edu.ups.icc.fundamentos01.products.dto;

public class ProductFilterByCategoryDto {

    private String name;
    private Double minPrice;
    private Double maxPrice;

    public ProductFilterByCategoryDto() {
    }

    public ProductFilterByCategoryDto(String name, Double minPrice, Double maxPrice) {
        this.name = name;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }
}
