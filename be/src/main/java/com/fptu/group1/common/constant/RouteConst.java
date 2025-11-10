package com.fptu.group1.common.constant;

public class RouteConst {

    public static final String API_VERSION = "/v1";
    public static final String API_BASE = "/api" + API_VERSION;

    public static final String API_PARAM_ID = "id";
    public static final String API_PARAM_ID_PATH = "/{" + API_PARAM_ID + "}";
    public static final String API_PARAM_USERNAME = "username";
    public static final String API_PARAM_USERNAME_PATH = "/{" + API_PARAM_USERNAME + "}";
    public static final String API_PARAM_STATUS = "status";
    public static final String API_PARAM_STATUS_PATH = "/{" + API_PARAM_STATUS + "}";

    // Authentication routes
    public static final String AUTH_ROUTE = "/auth";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";

    // User routes
    public static final String USER_ROUTE = "/user";

    // Admin routes
    public static final String ADMIN_ROUTE = "/admin";
    public static final String ADMIN_PRODUCT_ROUTE = ADMIN_ROUTE + "/product";
    public static final String ADMIN_CATEGORY_ROUTE = ADMIN_ROUTE + "/category";
}