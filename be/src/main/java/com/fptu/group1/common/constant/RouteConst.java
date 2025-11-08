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

    // Movie routes
    public static final String MOVIE_ROUTE = "/movie";
    public static final String MOVIE_DETAIL = MOVIE_ROUTE + API_PARAM_ID_PATH;

    // Booking routes
    public static final String BOOKING_ROUTE = "/booking";
    public static final String BOOKING_HISTORY = BOOKING_ROUTE + API_PARAM_ID_PATH + "/history" + API_PARAM_STATUS_PATH;

    // Promotion routes
    public static final String PROMOTION_ROUTE = "/promotion";
    
    // Payment routes
    public static final String PAYMENT_ROUTE = "/payment";
    public static final String PAYMENT_PROCESS = PAYMENT_ROUTE + "/process";

    // Member routes
    public static final String MEMBER_ROUTE = "/member";
    public static final String SCORE_ROUTE = MEMBER_ROUTE + "/score";

    // Ticket routes
    public static final String TICKET_SELLING_ROUTE = "/ticket-selling";
    public static final String TICKET_BOOKING_ROUTE = "/ticket-booking";

    // Cinema room routes
    public static final String CINEMA_ROOM_ROUTE = "/cinema-room";
    public static final String CINEMA_ROOM_SEATS = "/{roomId}/seats";
    public static final String CINEMA_ROOM_SEAT_TYPE = "/rooms/{roomId}/seats/set-type";

    // Employee routes
    public static final String EMPLOYEE_ROUTE = "/employee";
    public static final String EMPLOYEE_SEARCH = EMPLOYEE_ROUTE + "/search";
    public static final String EMPLOYEE_DETAIL = EMPLOYEE_ROUTE + API_PARAM_ID_PATH;

    // Chat Assistant routes
    public static final String CHAT_ASSISTANT_ROUTE = "/chat-assistant";
}