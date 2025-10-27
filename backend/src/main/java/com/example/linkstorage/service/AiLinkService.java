package com.example.linkstorage.service;

import com.example.linkstorage.model.Category;
import com.example.linkstorage.model.Link;
import com.example.linkstorage.repository.LinkRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiLinkService {

    private final PageScraper pageScraper;
    private final LlmCategoryClient llmCategoryClient;
    private final LinkRepository linkRepository;
    private final CategoryService categoryService;

    public AiLinkService(PageScraper pageScraper,
                         LlmCategoryClient llmCategoryClient,
                         LinkRepository linkRepository,
                         CategoryService categoryService) {
        this.pageScraper = pageScraper;
        this.llmCategoryClient = llmCategoryClient;
        this.linkRepository = linkRepository;
        this.categoryService = categoryService;
    }

    @Transactional
    public Link saveFromUrl(String url) {
        PageScraper.PageSnapshot snapshot = pageScraper.fetch(url)
                .orElseGet(() -> new PageScraper.PageSnapshot(url, null, ""));
        List<Category> categories = categoryService.findAllOrdered();
        if (categories.isEmpty()) {
            throw new IllegalStateException("No categories configured. Create a category before saving links.");
        }
        String categoryName = llmCategoryClient.classify(snapshot.textSample(),
                categories.stream().map(Category::getName).toList());
        Category category = categoryService.findByNameIgnoreCase(categoryName)
                .orElse(categories.get(0));
        Link link = new Link(url, snapshot.title(), snapshot.thumbnailUrl(), category);
        link.setMemo(null);
        return linkRepository.save(link);
    }
}
