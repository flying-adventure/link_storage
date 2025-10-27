package com.example.linkstorage.repository;

import com.example.linkstorage.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LinkRepository extends JpaRepository<Link, Long> {
}
