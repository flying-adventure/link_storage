package com.example.linkstorage.dto;

import com.example.linkstorage.model.Link;
import java.time.OffsetDateTime;

public class LinkResponse {
    private Long id;
    private String url;
    private String title;
    private String thumbnailUrl;
    private String category;
    private String memo;
    private OffsetDateTime createdAt;

    public LinkResponse(Long id, String url, String title, String thumbnailUrl, String category, String memo, OffsetDateTime createdAt) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.thumbnailUrl = thumbnailUrl;
        this.category = category;
        this.memo = memo;
        this.createdAt = createdAt;
    }

    public static LinkResponse from(Link link) {
        return new LinkResponse(
                link.getId(),
                link.getUrl(),
                link.getTitle(),
                link.getThumbnailUrl(),
                link.getCategory(),
                link.getMemo(),
                link.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getTitle() {
        return title;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getCategory() {
        return category;
    }

    public String getMemo() {
        return memo;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
