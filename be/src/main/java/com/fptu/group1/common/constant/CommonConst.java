package com.fptu.group1.common.constant;

public class CommonConst {

    // Default values for various configurations
    public static final String DEFAULT_LANGUAGE = "en";
    public static final String DEFAULT_CURRENCY = "USD";
    public static final String DEFAULT_TIMEZONE = "UTC";
    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public static final String DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    public static final long DEFAULT_PERFORMANCE_THRESHOLD = 5; // 5 seconds


    // Pagination constants
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MIN_PAGE_SIZE = 1;
    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    
    // Search safety constants
    public static final int MAX_SEARCH_RESULTS = 1000; // Maximum results for non-paginated search to prevent memory overflow

    // Guest booking default values
    public static final int GUEST_DEFAULT_ACCOUNT_ID = 86;
    public static final int GUEST_DEFAULT_MEMBER_ID = 37;

    // Scoring constants
    public static final int POINTS_PER_TICKET = 50;
    public static final float POINTS_TO_MONEY_RATIO = 0.1f; 

}
