package org.cryptodrink.converter;

import org.cryptodrink.data.model.CategoryModel;
import org.cryptodrink.domain.entity.CategoryEntity;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.service.CategoryService;
import org.cryptodrink.presentation.rest.response.CategoryResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class CategoryConverter {

    @Inject
    CategoryService categoryService;

    public CategoryEntity convert(CategoryModel category) {
        return new CategoryEntity(
                category.getId(),
                category.getName()
        );
    }

    public CategoryResponse convert(CategoryEntity category) {
        return new CategoryResponse(
                category.getName(),
                categoryService.listAllChallenges(category).stream().map(ChallengeEntity::getName).toList()
        );
    }
}