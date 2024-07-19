package org.cryptodrink.domain.service;

import org.cryptodrink.converter.CategoryConverter;
import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.data.repository.CategoryRepository;
import org.cryptodrink.domain.entity.CategoryEntity;
import org.cryptodrink.domain.entity.ChallengeEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CategoryService {
    @Inject
    CategoryRepository categories;
    @Inject
    CategoryConverter categoryConverter;

    @Inject
    ChallengeConverter challengeConverter;

    public Optional<CategoryEntity> find(String name) {
        return categories.find("name", name)
                .firstResultOptional()
                .map(categoryConverter::convert);
    }

    public List<ChallengeEntity> listAllChallenges(CategoryEntity category) {
        return categories.findById(category.getId())
                .getChallenges()
                .stream().map(challengeConverter::convert).toList();
    }

    public List<CategoryEntity> findAll() {
        return categories.listAll()
                .stream().map(categoryConverter::convert).toList();
    }
}