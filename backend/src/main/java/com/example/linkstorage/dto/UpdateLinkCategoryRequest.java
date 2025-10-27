package com.example.linkstorage.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateLinkCategoryRequest {

    @NotNull
    private Long categoryId;

    public UpdateLinkCategoryRequest() {
    }

    public UpdateLinkCategoryRequest(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
