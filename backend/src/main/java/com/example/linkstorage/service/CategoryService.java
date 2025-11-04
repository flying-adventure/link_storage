package com.example.linkstorage.service;

import com.example.linkstorage.model.Category;
import com.example.linkstorage.repository.CategoryRepository;
import com.example.linkstorage.repository.LinkRepository;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CategoryService {

    private static final String DEFAULT_COLOR = "#4C6EF5";
    private static final Pattern COLOR_PATTERN = Pattern.compile("#?[0-9a-fA-F]{6}");

    private final CategoryRepository categoryRepository;
    private final LinkRepository linkRepository;

    public CategoryService(CategoryRepository categoryRepository, LinkRepository linkRepository) {
        this.categoryRepository = categoryRepository;
        this.linkRepository = linkRepository;
    }

    @Transactional(readOnly = true)
    public List<Category> findAllOrdered() {
        return categoryRepository.findAllByOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<Category> findByNameIgnoreCase(String name) {
        if (!StringUtils.hasText(name)) {
            return Optional.empty();
        }
        return categoryRepository.findByNameIgnoreCase(name.trim());
    }

    @Transactional
    public Category create(String name, String color) {
        String normalizedName = normalizeName(name);
        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new IllegalArgumentException("Category already exists: " + normalizedName);
        }
        String normalizedColor = normalizeColor(color);
        Category category = new Category(normalizedName, normalizedColor);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(Long id, String name, String color) {
        Category category = getById(id);
        String normalizedName = normalizeName(name);
        if (!category.getName().equalsIgnoreCase(normalizedName)
                && categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new IllegalArgumentException("Category already exists: " + normalizedName);
        }
        category.setName(normalizedName);
        category.setColor(normalizeColor(color));
        return category;
    }

    @Transactional
    public void delete(Long id) {
        Category category = getById(id);
        long linkedCount = linkRepository.countByCategoryId(id);
        if (linkedCount > 0) {
            throw new IllegalStateException("Cannot delete category with linked items: " + linkedCount);
        }
        categoryRepository.delete(category);
    }

    private String normalizeName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("Category name must not be blank");
        }
        return name.trim();
    }

    private String normalizeColor(String color) {
        if (!StringUtils.hasText(color)) {
            return DEFAULT_COLOR;
        }
        String trimmed = color.trim();
        if (!COLOR_PATTERN.matcher(trimmed).matches()) {
            throw new IllegalArgumentException("Color must be a hex value like #AABBCC");
        }
        if (!trimmed.startsWith("#")) {
            trimmed = "#" + trimmed;
        }
        return trimmed.toUpperCase();
    }
}
