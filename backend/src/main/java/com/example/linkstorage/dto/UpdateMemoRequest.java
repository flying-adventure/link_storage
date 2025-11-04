package com.example.linkstorage.dto;

public class UpdateMemoRequest {
    private String memo;

    public UpdateMemoRequest() {
    }

    public UpdateMemoRequest(String memo) {
        this.memo = memo;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
