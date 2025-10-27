package com.example.linkstorage.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

@Component
public class LlmCategoryClient {

    private static final Logger log = LoggerFactory.getLogger(LlmCategoryClient.class);
    private static final List<String> DEFAULT_CATEGORIES = List.of("Study", "News", "YouTube");

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;

    public LlmCategoryClient(RestTemplate restTemplate,
                             @Value("${link.ai.llm.api-url:}") String apiUrl,
                             @Value("${link.ai.llm.api-key:}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public String classify(String textSample, List<String> categories) {
        List<String> candidates = resolveCandidates(categories);
        if (!StringUtils.hasText(apiUrl)) {
            return fallbackCategory(textSample, candidates);
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (StringUtils.hasText(apiKey)) {
                headers.setBearerAuth(apiKey);
            }
            String prompt = buildPrompt(textSample, candidates);
            Map<String, Object> payload = Map.of("prompt", prompt);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            Map response = restTemplate.postForObject(apiUrl, request, Map.class);
            Object choice = response != null ? response.get("category") : null;
            if (choice instanceof String selected) {
                Optional<String> matched = candidates.stream()
                        .filter(candidate -> candidate.equalsIgnoreCase(selected.trim()))
                        .findFirst();
                if (matched.isPresent()) {
                    return matched.get();
                }
            }
        } catch (Exception ex) {
            log.warn("LLM classification failed, using fallback", ex);
        }
        return fallbackCategory(textSample, candidates);
    }

    private String fallbackCategory(String textSample, List<String> candidates) {
        if (candidates.isEmpty()) {
            throw new IllegalStateException("No categories available for fallback classification");
        }
        if (StringUtils.hasText(textSample)) {
            String sample = textSample.toLowerCase();
            if (sample.contains("youtube") || sample.contains("video")) {
                String match = matchCandidate(candidates, "youtube");
                if (match != null) {
                    return match;
                }
            }
            if (sample.contains("study") || sample.contains("tutorial") || sample.contains("lecture")) {
                String match = matchCandidate(candidates, "study");
                if (match != null) {
                    return match;
                }
            }
            if (sample.contains("news") || sample.contains("article") || sample.contains("breaking")) {
                String match = matchCandidate(candidates, "news");
                if (match != null) {
                    return match;
                }
            }
        }
        return candidates.get(0);
    }

    private List<String> resolveCandidates(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return DEFAULT_CATEGORIES;
        }
        return categories;
    }

    private String matchCandidate(List<String> candidates, String target) {
        return candidates.stream()
                .filter(candidate -> candidate.equalsIgnoreCase(target))
                .findFirst()
                .orElse(null);
    }

    private String buildPrompt(String textSample, List<String> candidates) {
        return "Read the following text snippet and respond with exactly one of the categories " +
                candidates + ":\n" + Objects.toString(textSample, "");
    }
}
