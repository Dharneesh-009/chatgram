package com.example.demo.controller;

import com.example.demo.service.GrammarCheckService;
import com.example.demo.service.GroqGrammarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/grammar")
@CrossOrigin(origins = "*") // Allow cross-origin for frontend access
public class GrammarController {

    private final GrammarCheckService grammarCheckService;
    private final GroqGrammarService groqGrammarService;

    @Autowired
    public GrammarController(GrammarCheckService grammarCheckService, GroqGrammarService groqGrammarService) {
        this.grammarCheckService = grammarCheckService;
        this.groqGrammarService = groqGrammarService;
    }

    /**
     * POST /api/grammar/check
     * Uses LanguageTool for local grammar and spelling correction.
     */
    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkGrammar(@RequestBody Map<String, String> body) throws IOException {
        String input = body.get("text");
        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text input is required"));
        }

        Map<String, Object> result = grammarCheckService.correctText(input);
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/grammar/groq
     * Uses Groq LLM API for advanced grammar correction.
     */
    @PostMapping("/groq")
    public ResponseEntity<Map<String, String>> fixWithGroq(@RequestBody Map<String, String> body) {
        String input = body.get("text");
        if (input == null || input.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Text input is required"));
        }

        String corrected = groqGrammarService.correctWithGroq(input);
        return ResponseEntity.ok(Map.of(
                "original", input,
                "corrected", corrected
        ));
    }
}
