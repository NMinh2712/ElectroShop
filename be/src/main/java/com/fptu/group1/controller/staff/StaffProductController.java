package com.fptu.group1.controller.staff;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.AuthorityConst;
import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.response.ProductDetailResponse;
import com.fptu.group1.dto.response.ProductPageResponse;
import com.fptu.group1.service.ProductAdminService;

@RestController
@RequestMapping(RouteConst.API_BASE + "/staff/product")
public class StaffProductController {

    private final ProductAdminService productAdminService;

    public StaffProductController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_STAFF_OR_ADMIN)
    public ResponseEntity<ApiResponse<ProductPageResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        ProductPageResponse response = productAdminService.getAllProducts(pageable, keyword);

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", response));
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize(AuthorityConst.AUTH_ROLE_STAFF_OR_ADMIN)
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductById(
            @PathVariable("id") Long productId) {

        ProductDetailResponse response = productAdminService.getProductById(productId);

        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", response));
    }
}

