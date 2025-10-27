package com.example.linkstorage.dto;

import jakarta.validation.constraints.NotBlank;

public class AiSaveRequest {
    @NotBlank
    private String url;

    public AiSaveRequest() {
    }

    public AiSaveRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
