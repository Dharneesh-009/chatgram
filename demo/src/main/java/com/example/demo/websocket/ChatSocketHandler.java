package com.example.demo.websocket;

import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import com.example.demo.repository.MessageRepository;
import com.example.demo.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSocketHandler extends TextWebSocketHandler {

    private final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatSocketHandler(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String query = session.getUri().getQuery(); // userId=1
        Long userId = Long.parseLong(query.split("=")[1]);
        sessions.put(userId, session);
        System.out.println("WebSocket Connected: User " + userId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().removeIf(s -> s.getId().equals(session.getId()));
        System.out.println("WebSocket Disconnected: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            JSONObject json = new JSONObject(message.getPayload());

            Long senderId = json.getLong("senderId");
            Long receiverId = json.getLong("receiverId");
            String text = json.getString("text");

            // Fetch sender and receiver from DB
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            // Save message to DB
            Message msg = new Message();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setText(text);
            msg.setTimestamp(LocalDateTime.now());
            messageRepository.save(msg);

            // Send to receiver
            WebSocketSession receiverSession = sessions.get(receiverId);
            if (receiverSession != null && receiverSession.isOpen()) {
                receiverSession.sendMessage(new TextMessage(json.toString()));
            }

            // Echo back to sender
            session.sendMessage(new TextMessage(json.toString()));

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error handling message: " + e.getMessage());
        }
    }
}
