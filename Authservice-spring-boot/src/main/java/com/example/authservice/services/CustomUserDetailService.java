package com.example.authservice.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.authservice.entity.UserModel;
import com.example.authservice.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService{

    private final UserRepository userRepository;
    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel userModel = userRepository
            .findByUsername(username)
            .orElseThrow(()->new UsernameNotFoundException("User not found"));

        return User
            .withUsername(userModel.getUsername())
            .password(userModel.getPassword())
            .roles("USER")
            .build();
    }

}
