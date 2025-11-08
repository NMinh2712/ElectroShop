package com.fptu.group1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity class representing the many-to-many relationship between Promotions and Products.
 * Maps to the 'PromotionProducts' table in the 'ElectroShop' schema.
 * Uses composite primary key (promotion_id + product_id).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@IdClass(PromotionProductId.class)
@Table(name = "PromotionProducts", schema = "dbo")
public class PromotionProduct {

    // Composite key part 1: Reference to the promotion.
    @Id
    @Column(name = "promotion_id", nullable = false, columnDefinition = "int")
    private Long promotionId;

    // Promotion entity relationship.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id", nullable = false, insertable = false, updatable = false)
    private Promotion promotion;

    // Composite key part 2: Reference to the product.
    @Id
    @Column(name = "product_id", nullable = false, columnDefinition = "int")
    private Long productId;

    // Product entity relationship.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private Product product;
}

/**
 * Composite key class for PromotionProduct entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
class PromotionProductId implements java.io.Serializable {
    private Long promotionId;
    private Long productId;
}

