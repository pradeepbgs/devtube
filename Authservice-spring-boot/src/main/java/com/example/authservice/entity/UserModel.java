package com.example.authservice.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection ="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserModel {

    @Id
    private String id;

    @Field(name = "username")
    @Indexed(unique = true)
    private String username;

    @Field(name = "password")
    private String password;

    @Field(name = "email")
    private String email;

    @Field(name = "fullname")
    private String fullname;

    
    @Field(name = "avatar")
    @Builder.Default
    private String avatar = "https://cdn-icons-png.flaticon.com/512/17/17004.png";

    @Field(name = "coverImage")
    private String coverImage;

    @Field(name = "refreshToken")
    private String refreshToken;
}
