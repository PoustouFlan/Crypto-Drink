package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.converter.SolvedChallengeConverter;
import org.cryptodrink.converter.UserConverter;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.domain.entity.*;
import org.cryptodrink.domain.service.cryptohack.CryptoHackAPI;
import org.cryptodrink.presentation.rest.response.CategoryCompletionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Inject
    UserRepository users;
    @Inject
    CryptoHackAPI cryptoHack;
    @Inject
    UserConverter userConverter;
    @Inject
    SolvedChallengeConverter solvedChallengeConverter;
    @Inject
    ScoreboardConverter scoreboardConverter;
    @Inject
    CategoryService categoryService;

    public Optional<UserEntity> find(String username, Boolean databaseAllowed, Boolean apiAllowed)
    {
        Optional<UserModel> user = Optional.empty();
        if (databaseAllowed) {
            logger.debug("Looking for {} in database", username);
            user = users
                    .find("LOWER(username)", username.toLowerCase())
                    .firstResultOptional();
        }
        if (user.isEmpty()) {
            logger.debug("User {} not found in database", username);
            if (apiAllowed) {
                cryptoHack.updateUserInfo(username);
                return find(username, true, false);
            }
            return Optional.empty();
        }
        return Optional.of(userConverter.convert(user.get()));
    }

    public List<SolvedChallengeEntity> getSolvedChallenges(UserEntity user)
    {
        UserModel model = users.findById(user.getId());
        return model.getSolvedChallenges().stream().map(solvedChallengeConverter::convert).toList();
    }

    public List<ScoreboardEntity> getScoreboards(UserEntity user)
    {
        UserModel model = users.findById(user.getId());
        return model.getScoreboards().stream().map(scoreboardConverter::convert).toList();
    }

    public List<CategoryCompletionResponse> getCompletion(UserEntity user) {
        // TODO: not properly layered :(
        List<CategoryCompletionResponse> completion = new ArrayList<>();
        for (CategoryEntity category : categoryService.findAll()) {
            List<ChallengeEntity> challenges = categoryService.listAllChallenges(category);
            Integer solved = 0;
            Integer totalScore = 0;
            Integer score = 0;
            for (ChallengeEntity challenge : challenges) {
                totalScore += challenge.getPoints();
                if (getSolvedChallenges(user).stream().anyMatch(
                        s -> challenge.getId().equals(s.getChallenge().getId())
                )) {
                    score += challenge.getPoints();
                    solved++;
                }
            }

            completion.add(new CategoryCompletionResponse(
                    category.getName(), solved, challenges.size(), score, totalScore
            ));
        }

        return completion;
    }
}