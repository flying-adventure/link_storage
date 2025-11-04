package com.example.linkstorage.service;

import com.example.linkstorage.model.Category;
import com.example.linkstorage.model.Link;
import com.example.linkstorage.repository.LinkRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LinkService {

    private final LinkRepository linkRepository;
    private final CategoryService categoryService;

    public LinkService(LinkRepository linkRepository, CategoryService categoryService) {
        this.linkRepository = linkRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public List<Link> findAll(Long categoryId) {
        if (categoryId != null) {
            return linkRepository.findAllByCategoryIdOrderByCreatedAtDesc(categoryId);
        }
        return linkRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Link updateMemo(Long id, String memo) {
        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Link not found: " + id));
        link.setMemo(memo);
        return link;
    }

    @Transactional
    public Link updateCategory(Long id, Long categoryId) {
        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Link not found: " + id));
        Category category = categoryService.getById(categoryId);
        link.setCategory(category);
        return link;
    }

    @Transactional
    public void delete(Long id) {
        if (!linkRepository.existsById(id)) {
            throw new IllegalArgumentException("Link not found: " + id);
        }
        linkRepository.deleteById(id);
    }
}
