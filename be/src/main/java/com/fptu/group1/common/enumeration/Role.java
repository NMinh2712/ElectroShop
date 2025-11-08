package com.fptu.group1.common.enumeration;

public class Role {

    private Role() {
        // Private constructor to prevent instantiation
    }

    public static final String ADMIN = "ROLE_ADMIN";
    public static final int ADMIN_ID = 1;
    public static final String MODERATOR = "ROLE_MODERATOR";
    public static final int MODERATOR_ID = 2;
    public static final String USER = "ROLE_USER";
    public static final int USER_ID = 3;
    public static final String GUEST = "ROLE_GUEST";
    public static final int GUEST_ID = 4;
    public static final int DEFAULT_ROLE_ID = USER_ID;
}
