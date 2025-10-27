package com.example.linkstorage.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
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
    private static final List<String> CATEGORIES = List.of("Study", "News", "YouTube");

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

    public String classify(String textSample) {
        if (!StringUtils.hasText(apiUrl)) {
            return fallbackCategory(textSample);
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (StringUtils.hasText(apiKey)) {
                headers.setBearerAuth(apiKey);
            }
            String prompt = buildPrompt(textSample);
            Map<String, Object> payload = Map.of("prompt", prompt);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            Map response = restTemplate.postForObject(apiUrl, request, Map.class);
            Object choice = response != null ? response.get("category") : null;
            if (choice instanceof String selected && CATEGORIES.contains(selected)) {
                return selected;
            }
        } catch (Exception ex) {
            log.warn("LLM classification failed, using fallback", ex);
        }
        return fallbackCategory(textSample);
    }

    private String fallbackCategory(String textSample) {
        if (!StringUtils.hasText(textSample)) {
            return "News";
        }
        String sample = textSample.toLowerCase();
        if (sample.contains("youtube") || sample.contains("video")) {
            return "YouTube";
        }
        if (sample.contains("study") || sample.contains("tutorial") || sample.contains("lecture")) {
            return "Study";
        }
        return "News";
    }

    private String buildPrompt(String textSample) {
        return "Read the following text snippet and respond with exactly one of the categories " +
                CATEGORIES + ":\n" + Objects.toString(textSample, "");
    }
}
