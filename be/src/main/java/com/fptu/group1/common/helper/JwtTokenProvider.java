package com.fptu.group1.common.helper;

import javax.crypto.SecretKey;

import com.fptu.group1.common.constant.AuthorityConst;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Component responsible for generating and validating JWT tokens.
 */
@Component
public class JwtTokenProvider {

    // Secret key used to sign the JWT token (replace with a secure, real secret in
    // production)
    @Value("${jwt.secret:your-secret-key-your-secret-key-your-secret-key-your-secret-key-your-secret-key}")
    private String jwtSecret;

    private SecretKey getSigningKey() {
        // Ensure secret key is at least 512 bits (64 characters) for HS512
        String secret = jwtSecret;
        if (secret.length() < 64) {
            // Pad or repeat to ensure minimum length
            secret = secret.repeat((64 / secret.length()) + 1).substring(0, 64);
        }
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    /**
     * Generates a JWT token containing username, accountId, and roleId as claims.
     * The token is valid for the specified expiration time.
     *
     * @param username  the username to include in the token subject
     * @param accountId the user's account ID to include as a claim
     * @param roleId    the user's role ID to include as a claim
     * @return a signed JWT token string
     */
    public String generateToken(String username, int accountId, Long roleId) {
        return Jwts.builder()
                .subject(username) // Set token subject as username
                .claim("accountId", accountId) // Add accountId claim
                .claim("roleId", roleId) // Add roleId claim
                .issuedAt(new Date()) // Set token issuance time to now
                .expiration(new Date(System.currentTimeMillis() + AuthorityConst.TOKEN_EXPIRED_TIME)) // Set expiration time
                .signWith(getSigningKey()) // Sign token with secret key
                .compact(); // Build the token
    }

    /**
     * Extracts the username (subject) from the given JWT token.
     *
     * @param token the JWT token string
     * @return the username stored in the token subject
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Set the signing key to verify token
                .build()
                .parseSignedClaims(token) // Parse the token claims
                .getPayload()
                .getSubject(); // Return the subject (username)
    }

    /**
     * Validates the given JWT token.
     *
     * @param token the JWT token string
     * @return true if the token is valid (signature and expiration), false
     *         otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true; // Token is valid
        } catch (Exception e) {
            return false; // Token is invalid or expired
        }
    }

    /**
     * Lấy roleId từ JWT token
     */
    public Integer getRoleIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Object roleId = claims.get("roleId");
        if (roleId instanceof Integer integer) {
            return integer;
        } else if (roleId instanceof Long longValue) {
            return longValue.intValue();
        }
        return null;
    }

    public Integer getAccountIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Object accountId = claims.get("accountId");
        if (accountId instanceof Integer integer) {
            return integer;
        } else if (accountId instanceof Long longValue) {
            return longValue.intValue();
        }
        return null;
    }

}
