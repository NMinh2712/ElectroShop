package com.fptu.group1.common.constant;

public class AuthorityConst {
    public static final long TOKEN_EXPIRED_TIME = 1000 * 60 * 24; 

    public static final String AUTH_ROLE_ADMIN = "hasAuthority('ROLE_ADMIN')";
    public static final String AUTH_ROLE_MODERATOR = "hasAuthority('ROLE_MODERATOR')";
    public static final String AUTH_ROLE_STAFF = "hasAuthority('ROLE_STAFF')";
    public static final String AUTH_ROLE_USER = "hasAuthority('ROLE_USER')";
    public static final String AUTH_ROLE_GUEST = "hasAuthority('ROLE_GUEST')";
    public static final String AUTH_ROLE_ALL = AUTH_ROLE_ADMIN + " or " + AUTH_ROLE_MODERATOR + " or " + AUTH_ROLE_USER;
    public static final String AUTH_ANONYMOUS = "isAnonymous()";

    // Combined roles for convenience
    public static final String AUTH_ROLE_ADMIN_OR_MODERATOR = AUTH_ROLE_ADMIN + " or " + AUTH_ROLE_MODERATOR;
    public static final String AUTH_ROLE_ADMIN_OR_STAFF = AUTH_ROLE_ADMIN + " or " + AUTH_ROLE_STAFF;
    public static final String AUTH_ROLE_STAFF_OR_ADMIN = AUTH_ROLE_STAFF + " or " + AUTH_ROLE_ADMIN;
    public static final String AUTH_ROLE_ALL_USERS = AUTH_ROLE_ADMIN + " or " + AUTH_ROLE_MODERATOR + " or " + AUTH_ROLE_USER;
    public static final String AUTH_ROLE_ADMIN_OR_USER = AUTH_ROLE_ADMIN + " or " + AUTH_ROLE_USER;

    public static final String AUTH_ROLE_ADMIN_OR_ANO = AUTH_ROLE_ADMIN + " or " + AUTH_ANONYMOUS;

    public static final String AUTH_ALL = "permitAll()";
}
    