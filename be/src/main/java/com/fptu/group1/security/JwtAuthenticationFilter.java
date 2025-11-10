package com.fptu.group1.security;

import com.fptu.group1.common.helper.JwtTokenProvider;
import com.fptu.group1.model.User;
import com.fptu.group1.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * JWT Authentication Filter that extracts JWT token from Authorization header,
 * validates it, and sets authentication in SecurityContext.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = getTokenFromRequest(request);

            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                Integer roleId = jwtTokenProvider.getRoleIdFromToken(token);

                if (username != null && roleId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> userOptional = userRepository.findByUsername(username);

                    if (userOptional.isPresent()) {
                        User user = userOptional.get();

                        // Check if user is banned
                        if (Boolean.TRUE.equals(user.getIsBanned())) {
                            log.warn("Banned user attempted to access: {}", username);
                            filterChain.doFilter(request, response);
                            return;
                        }

                        // Get role name from roleId
                        String roleName = getRoleNameFromRoleId(roleId);
                        if (roleName != null) {
                            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleName);

                            CustomUserDetails userDetails = new CustomUserDetails(
                                    user.getUsername(),
                                    user.getPasswordHash(),
                                    Collections.singletonList(authority),
                                    !Boolean.TRUE.equals(user.getIsBanned()),
                                    user.getUserId().intValue()
                            );

                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extracts JWT token from Authorization header
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    /**
     * Maps roleId to role name
     */
    private String getRoleNameFromRoleId(Integer roleId) {
        if (roleId == null) {
            return null;
        }
        // Map roleId to role name
        // Assuming: 1 = ADMIN, 2 = MODERATOR, 3 = USER, 4 = GUEST, 5 = STAFF
        return switch (roleId.intValue()) {
            case 1 -> "ADMIN";
            case 2 -> "MODERATOR";
            case 3 -> "USER";
            case 4 -> "GUEST";
            case 5 -> "STAFF";
            default -> null;
        };
    }
}

