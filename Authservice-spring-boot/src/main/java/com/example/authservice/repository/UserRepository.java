package com.example.authservice.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.example.authservice.entity.UserModel;

public interface UserRepository extends CrudRepository<UserModel,String> {
    Optional<UserModel> findByUsername(String username);
}
