package com.example.linkstorage.service;

import com.example.linkstorage.model.Link;
import com.example.linkstorage.repository.LinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiLinkService {

    private final PageScraper pageScraper;
    private final LlmCategoryClient llmCategoryClient;
    private final LinkRepository linkRepository;

    public AiLinkService(PageScraper pageScraper, LlmCategoryClient llmCategoryClient, LinkRepository linkRepository) {
        this.pageScraper = pageScraper;
        this.llmCategoryClient = llmCategoryClient;
        this.linkRepository = linkRepository;
    }

    @Transactional
    public Link saveFromUrl(String url) {
        PageScraper.PageSnapshot snapshot = pageScraper.fetch(url)
                .orElseGet(() -> new PageScraper.PageSnapshot(url, null, ""));
        String category = llmCategoryClient.classify(snapshot.textSample());
        Link link = new Link(url, snapshot.title(), snapshot.thumbnailUrl(), category);
        link.setMemo(null);
        return linkRepository.save(link);
    }
}
