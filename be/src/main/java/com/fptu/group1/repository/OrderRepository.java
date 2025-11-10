package com.fptu.group1.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fptu.group1.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    
    // Remove ORDER BY from query - let Pageable handle sorting to avoid duplicate ORDER BY
    @Query("SELECT o FROM Order o")
    Page<Order> findAllOrders(Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.statusId = :statusId")
    Page<Order> findByStatusId(@Param("statusId") Long statusId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.userId = :userId")
    Page<Order> findByUserId(@Param("userId") Long userId, Pageable pageable);
}

