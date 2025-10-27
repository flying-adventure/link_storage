package com.example.linkstorage.repository;

import com.example.linkstorage.model.Link;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findAllByOrderByCreatedAtDesc();

    List<Link> findAllByCategoryIdOrderByCreatedAtDesc(Long categoryId);

    long countByCategoryId(Long categoryId);
}
