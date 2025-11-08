package com.fptu.group1.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Read-only entity representing the product rating summary view.
 * Maps to the 'vw_ProductRatingSummary' view in the 'ElectroShop' schema.
 * This is an immutable view entity that aggregates rating data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Immutable
@Subselect("SELECT p.product_id, p.name, p.brand_id, p.category_id, " +
           "AVG(CAST(r.rating AS FLOAT)) AS avg_rating, " +
           "COUNT(r.rating_id) AS rating_count " +
           "FROM dbo.Products p " +
           "LEFT JOIN dbo.Ratings r ON p.product_id = r.product_id " +
           "GROUP BY p.product_id, p.name, p.brand_id, p.category_id")
@Table(name = "vw_ProductRatingSummary", schema = "dbo")
public class ProductRatingSummary {

    // Product identifier.
    @Id
    @Column(name = "product_id")
    private Long productId;

    // Product name.
    @Column(name = "name")
    private String name;

    // Brand identifier.
    @Column(name = "brand_id")
    private Long brandId;

    // Category identifier.
    @Column(name = "category_id")
    private Long categoryId;

    // Average rating value.
    @Column(name = "avg_rating", precision = 18, scale = 2)
    private BigDecimal avgRating;

    // Total number of ratings.
    @Column(name = "rating_count")
    private Long ratingCount;
}

