package com.example.demo.service;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GroqGrammarService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama3-70b-8192";

    public String correctWithGroq(String inputText) {
        try {
            OkHttpClient client = new OkHttpClient();

            JSONObject json = new JSONObject();
            json.put("model", MODEL);

            JSONArray messages = new JSONArray();
            messages.put(new JSONObject()
                    .put("role", "system")
                    .put("content", "You are a grammar correction assistant. Fix any grammar or spelling mistakes in the user's sentence."));
            messages.put(new JSONObject()
                    .put("role", "user")
                    .put("content", inputText));

            json.put("messages", messages);

            RequestBody body = RequestBody.create(json.toString(), MediaType.parse("application/json"));
            Request request = new Request.Builder()
                    .url(API_URL)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .post(body)
                    .build();

            Response response = client.newCall(request).execute();
            String res = response.body().string();
            JSONObject result = new JSONObject(res);
            return result.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
