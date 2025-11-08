package com.fptu.group1.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fptu.group1.common.constant.RouteConst;
import com.fptu.group1.dto.ApiResponse;
import com.fptu.group1.dto.request.AddProductRequest;
import com.fptu.group1.dto.response.AddProductResponse;
import com.fptu.group1.service.ProductAdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(RouteConst.API_BASE + RouteConst.ADMIN_PRODUCT_ROUTE)
public class ProductAdminController {

    private final ProductAdminService productAdminService;

    // Explicit constructor to satisfy IDEs that don't process Lombok annotations
    public ProductAdminController(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AddProductResponse>> addProduct(
            @Valid @RequestBody AddProductRequest request) {

        AddProductResponse response = productAdminService.addProduct(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", response));
    }
}

