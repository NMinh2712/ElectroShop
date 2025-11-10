package com.fptu.group1.security;

import com.fptu.group1.model.User;
import com.fptu.group1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

/**
 * Custom UserDetailsService implementation for loading user details from database.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        User user = userOptional.get();

        // Get role name from roleId
        String roleName = getRoleNameFromRoleId(user.getRoleId());
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleName);

        return new CustomUserDetails(
                user.getUsername(),
                user.getPasswordHash(),
                Collections.singletonList(authority),
                !Boolean.TRUE.equals(user.getIsBanned()),
                user.getUserId().intValue()
        );
    }

    /**
     * Maps roleId to role name
     */
    private String getRoleNameFromRoleId(Long roleId) {
        if (roleId == null) {
            return "GUEST";
        }
        // Map roleId to role name
        // Assuming: 1 = ADMIN, 2 = MODERATOR, 3 = USER, 4 = GUEST, 5 = STAFF
        return switch (roleId.intValue()) {
            case 1 -> "ADMIN";
            case 2 -> "MODERATOR";
            case 3 -> "USER";
            case 4 -> "GUEST";
            case 5 -> "STAFF";
            default -> "GUEST";
        };
    }
}

