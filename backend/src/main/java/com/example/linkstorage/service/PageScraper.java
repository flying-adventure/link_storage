package com.example.linkstorage.service;

import java.io.IOException;
import java.util.Optional;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

@Component
public class PageScraper {

    public Optional<PageSnapshot> fetch(String url) {
        try {
            Document document = Jsoup.connect(url).get();
            String title = extractTitle(document).orElse(url);
            String thumbnail = extractThumbnail(document).orElse(null);
            String bodySample = extractBodySample(document);
            return Optional.of(new PageSnapshot(title, thumbnail, bodySample));
        } catch (IOException e) {
            return Optional.empty();
        }
    }

    private Optional<String> extractTitle(Document document) {
        if (document.title() != null && !document.title().isBlank()) {
            return Optional.of(document.title());
        }
        Element ogTitle = document.selectFirst("meta[property=og:title]");
        if (ogTitle != null) {
            String content = ogTitle.attr("content");
            if (!content.isBlank()) {
                return Optional.of(content);
            }
        }
        return Optional.empty();
    }

    private Optional<String> extractThumbnail(Document document) {
        Element ogImage = document.selectFirst("meta[property=og:image]");
        if (ogImage != null) {
            String content = ogImage.attr("content");
            if (!content.isBlank()) {
                return Optional.of(content);
            }
        }
        Element twitterImage = document.selectFirst("meta[name=twitter:image]");
        if (twitterImage != null) {
            String content = twitterImage.attr("content");
            if (!content.isBlank()) {
                return Optional.of(content);
            }
        }
        return Optional.empty();
    }

    private String extractBodySample(Document document) {
        String text = document.body() != null ? document.body().text() : "";
        if (text.length() > 1000) {
            return text.substring(0, 1000);
        }
        return text;
    }

    public record PageSnapshot(String title, String thumbnailUrl, String textSample) {}
}
