package com.example.demo.service;

import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.RuleMatch;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class GrammarCheckService {

    private final JLanguageTool langTool = new JLanguageTool(new AmericanEnglish());

    public Map<String, Object> correctText(String input) throws IOException {
        List<RuleMatch> matches = langTool.check(input);
        StringBuilder corrected = new StringBuilder(input);
        List<Map<String, Object>> corrections = new ArrayList<>();

        matches.sort((a, b) -> Integer.compare(b.getFromPos(), a.getFromPos())); // reverse order

        for (RuleMatch match : matches) {
            List<String> suggestions = match.getSuggestedReplacements();
            if (!suggestions.isEmpty()) {
                Map<String, Object> correction = new HashMap<>();
                correction.put("wrong", input.substring(match.getFromPos(), match.getToPos()));
                correction.put("suggestion", suggestions.get(0));
                correction.put("start", match.getFromPos());
                correction.put("end", match.getToPos());
                corrections.add(correction);

                corrected.replace(match.getFromPos(), match.getToPos(), suggestions.get(0));
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("original", input);
//        result.put("corrected", corrected.toString());
//        result.put("corrections", corrections);
        return result;
    }
}
