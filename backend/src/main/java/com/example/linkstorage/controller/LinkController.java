package com.example.linkstorage.controller;

import com.example.linkstorage.dto.LinkResponse;
import com.example.linkstorage.dto.UpdateLinkCategoryRequest;
import com.example.linkstorage.dto.UpdateMemoRequest;
import com.example.linkstorage.model.Link;
import com.example.linkstorage.service.LinkService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/links")
public class LinkController {

    private final LinkService linkService;

    public LinkController(LinkService linkService) {
        this.linkService = linkService;
    }

    @GetMapping
    public ResponseEntity<List<LinkResponse>> findAll(@RequestParam(name = "categoryId", required = false) Long categoryId) {
        List<LinkResponse> responses = linkService.findAll(categoryId).stream()
                .map(LinkResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/memo")
    public ResponseEntity<LinkResponse> updateMemo(@PathVariable Long id, @RequestBody UpdateMemoRequest request) {
        Link updated = linkService.updateMemo(id, request.getMemo());
        return ResponseEntity.ok(LinkResponse.from(updated));
    }

    @PatchMapping("/{id}/category")
    public ResponseEntity<LinkResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody UpdateLinkCategoryRequest request) {
        Link updated = linkService.updateCategory(id, request.getCategoryId());
        return ResponseEntity.ok(LinkResponse.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        linkService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
