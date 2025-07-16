package com.example.demo.controller;

import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private UserRepository userRepo;
    @Autowired private MessageRepository messageRepo;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/messages")
    public List<Message> getMessages(@RequestParam Long user1, @RequestParam Long user2) {
        User u1 = userRepo.findById(user1).orElseThrow();
        User u2 = userRepo.findById(user2).orElseThrow();
        return messageRepo.findBySenderAndReceiverOrReceiverAndSender(u1, u2, u1, u2);
    }
}


