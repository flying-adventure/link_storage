package com.example.linkstorage.controller;

import com.example.linkstorage.dto.AiSaveRequest;
import com.example.linkstorage.dto.LinkResponse;
import com.example.linkstorage.model.Link;
import com.example.linkstorage.service.AiLinkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/links")
public class AiLinkController {

    private final AiLinkService aiLinkService;

    public AiLinkController(AiLinkService aiLinkService) {
        this.aiLinkService = aiLinkService;
    }

    @PostMapping("/ai-save")
    public ResponseEntity<LinkResponse> saveWithAi(@Valid @RequestBody AiSaveRequest request) {
        Link saved = aiLinkService.saveFromUrl(request.getUrl());
        return ResponseEntity.ok(LinkResponse.from(saved));
    }
}
