package com.example.linkstorage.config;

import com.example.linkstorage.service.CategoryService;
import jakarta.annotation.PostConstruct;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryService categoryService;

    public DataInitializer(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostConstruct
    public void seedDefaults() {
        if (!categoryService.findAllOrdered().isEmpty()) {
            return;
        }
        List<SeedCategory> defaults = List.of(
                new SeedCategory("Study", "#4C6EF5"),
                new SeedCategory("News", "#228BE6"),
                new SeedCategory("YouTube", "#FF6B6B")
        );
        for (SeedCategory seed : defaults) {
            try {
                categoryService.create(seed.name(), seed.color());
            } catch (Exception ex) {
                log.warn("Failed to create default category {}", seed.name(), ex);
            }
        }
    }

    private record SeedCategory(String name, String color) {
    }
}
