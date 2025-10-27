package com.example.linkstorage.service;

import com.example.linkstorage.model.Link;
import com.example.linkstorage.repository.LinkRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LinkService {

    private final LinkRepository linkRepository;

    public LinkService(LinkRepository linkRepository) {
        this.linkRepository = linkRepository;
    }

    @Transactional(readOnly = true)
    public List<Link> findAll() {
        return linkRepository.findAll();
    }

    @Transactional
    public Link updateMemo(Long id, String memo) {
        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Link not found: " + id));
        link.setMemo(memo);
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
