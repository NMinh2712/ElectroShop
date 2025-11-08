package com.fptu.group1.common.constant;

/**
 * MessageConst stores standardized error and info codes for consistent
 * responses across the application.
 */
public class MessageConst {

    // ==== General Error Messages ====
    public static final String ERROR_ACCOUNT_NOT_FOUND = "E0001";
    public static final String ERROR_PASSWORD_NOT_MATCH = "E0002";
    public static final String ERROR_INVALID_IMAGE = "E0003";
    public static final String ERROR_INVALID_DATE = "E0004";
    public static final String ERROR_MEMBER_NOT_FOUND = "E0005";

    // ==== Registration-Specific Errors ====
    public static final String ERROR_USERNAME_EXISTS = "E0006";
    public static final String ERROR_EMAIL_EXISTS = "E0007";
    public static final String ERROR_PASSWORD_MISMATCH = "E0008";
    public static final String ERROR_REGISTER_FAILED = "E0009";

    // ==== Cinema Room Errors ====
    public static final String ERROR_CINEMA_ROOM_NOT_FOUND = "E0010";
    public static final String ERROR_CINEMA_ROOM_FETCH_FAILED = "E0011";
    public static final String ERROR_CINEMA_ROOM_CREATE_FAILED = "E0012";
    public static final String ERROR_CINEMA_ROOM_SEAT_UPDATE_FAILED = "E0013";
    public static final String ERROR_CINEMA_ROOM_UPDATE_FAILED = "E0016";

    // ==== Score Errors ====
    public static final String ERROR_INVALID_SCORE_STATUS = "E0014";
    public static final String ERROR_SCORE_HISTORY_FETCH_FAILED = "E0015";

    // ==== Booking Errors ====
    public static final String ERROR_INVALID_BOOKING_STATUS = "E0017";
    public static final String ERROR_BOOKING_HISTORY_FETCH_FAILED = "E0018";
    public static final String ERROR_INVALID_REQUEST_DATA = "E0025";
    public static final String ERROR_INVOICE_NOT_FOUND = "E0026";
    public static final String ERROR_CANNOT_REDEEM_POINTS_GUEST = "E0027";
    public static final String ERROR_INVALID_INVOICE_DATA = "E0028";
    public static final String ERROR_NOT_ENOUGH_SCORE = "E0029";
    public static final String ERROR_INVALID_SEARCH_PARAMETERS = "E0030";
    public static final String ERROR_INVALID_INVOICE_ID_FORMAT = "E0031";
    public static final String ERROR_INVALID_MEMBER_ID_FORMAT = "E0032";
    public static final String ERROR_INVALID_SEARCH_FIELD = "E0033";
    public static final String ERROR_DATABASE_ACCESS = "E0034";
    public static final String ERROR_UNEXPECTED = "E0035";
    public static final String ERROR_FETCHING_BOOKINGS = "E0036";
    public static final String ERROR_SEARCHING_BOOKINGS = "E0037";
    public static final String ERROR_FETCHING_PAGINATED_BOOKINGS = "E0038";

    // ==== Ticket Booking Errors ====
    public static final String ERROR_BOOKING_INVALID_REQUEST = "E0039";
    public static final String ERROR_BOOKING_ACCOUNT_NOT_FOUND = "E0040";
    public static final String ERROR_BOOKING_SHOWDATE_NOT_FOUND = "E0041";
    public static final String ERROR_BOOKING_SEAT_ALREADY_BOOKED = "E0042";
    public static final String ERROR_BOOKING_SEAT_NOT_FOUND = "E0043";
    public static final String ERROR_BOOKING_ROOM_NOT_FOUND = "E0044";
    public static final String ERROR_BOOKING_MOVIE_OR_SCHEDULE_INFO_NOT_FOUND = "E0045";
    public static final String ERROR_SEAT_DETAIL_NOT_FOUND = "E0046";
    public static final String ERROR_USER_POINTS_FETCH_FAILED = "E0047";

    // ==== Employee Errors ====
    public static final String ERROR_EMPLOYEE_NOT_FOUND = "E0020";
    public static final String ERROR_EMPLOYEE_CREATE_FAILED = "E0021";
    public static final String ERROR_EMPLOYEE_UPDATE_FAILED = "E0022";
    public static final String ERROR_EMPLOYEE_DELETE_FAILED = "E0023";
    public static final String ERROR_INVALID_DATE_FORMAT = "E0024";

    // ==== Success Info ====
    public static final String INFO_REQUEST_SUCCESS = "I0001";
    public static final String INFO_REGISTER_SUCCESS = "I0002";
    public static final String INFO_CINEMA_ROOM_CREATED = "I0010";
    public static final String INFO_CINEMA_ROOM_FETCH_SUCCESS = "I0011";
    public static final String INFO_CINEMA_ROOM_EMPTY = "I0012";
    public static final String INFO_CINEMA_ROOM_SEAT_UPDATE_SUCCESS = "I0013";
    public static final String INFO_SCORE_HISTORY_FETCH_SUCCESS = "I0014";
    public static final String INFO_SCORE_HISTORY_EMPTY = "I0015";
    public static final String INFO_CINEMA_ROOM_UPDATED = "I0016";
    public static final String INFO_BOOKING_HISTORY_FETCH_SUCCESS = "I0017";
    public static final String INFO_BOOKING_HISTORY_EMPTY = "I0018";
    public static final String SUCCESS_BOOKING_CONFIRMED = "I0025";
    public static final String SUCCESS_BOOKING_CONFIRMED_GUEST = "I0026";
    public static final String INFO_USER_POINTS_FETCH_SUCCESS = "I0027";
    public static final String INFO_USER_POINTS_NOT_MEMBER = "I0028";
    public static final String INFO_EMPLOYEE_CREATED = "I0020";
    public static final String INFO_EMPLOYEE_UPDATED = "I0021";
    public static final String INFO_EMPLOYEE_DELETED = "I0022";
    public static final String INFO_EMPLOYEE_EMPTY = "I0023";
    public static final String INFO_EMPLOYEE_FETCH_SUCCESS = "I0024";

    // === Authorization Errors ===
    public static final String ERROR_ACCESS_DENIED = "E9999"; // 403
    public static final String ERROR_UNAUTHORIZED = "E9998"; // 401

    // ==== Promotion Errors ====
    public static final String ERROR_PROMOTION_NOT_FOUND = "E0020";
    public static final String ERROR_PROMOTION_CREATE_FAILED = "E0021";
    public static final String ERROR_PROMOTION_UPDATE_FAILED = "E0022";
    public static final String ERROR_PROMOTION_DELETE_FAILED = "E0023";
    public static final String ERROR_INVALID_PROMOTION_DATA = "E0024";

    // ==== Promotion Success Info ====
    public static final String INFO_PROMOTION_FETCH_SUCCESS = "I0020";
    public static final String INFO_PROMOTION_CREATED = "I0021";
    public static final String INFO_PROMOTION_UPDATED = "I0022";
    public static final String INFO_PROMOTION_DELETED = "I0023";
    public static final String INFO_PROMOTION_EMPTY = "I0024";
}