package com.example.realchatapplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.realchatapplication.repository.UserRepository;

@Service    
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean userExists(String username){
        return userRepository.existsByUsername(username);
    }

    public void setUserOnlineStatus(String username, boolean isOnline){
        userRepository.updateUserOnlineStatus(username, isOnline);
    }
}
