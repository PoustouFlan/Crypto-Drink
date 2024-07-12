package org.cryptodrink.domain.service;

import org.cryptodrink.converter.SolvedChallengeConverter;
import org.cryptodrink.converter.UserConverter;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.cryptohack.CryptoHackAPI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
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

    public Optional<UserEntity> find(String username, Boolean refreshIfEmpty)
    {
        logger.debug("Looking for {} in database", username);
        Optional<UserModel> user = users
                .find("LOWER(username)", username.toLowerCase())
                .firstResultOptional();
        if (user.isEmpty()) {
            logger.debug("User {} not found in database", username);
            if (refreshIfEmpty) {
                cryptoHack.updateUserInfo(username);
                return find(username, false);
            }
            return Optional.empty();
        }
        return Optional.of(userConverter.convert(user.get()));
    }

    public Optional<UserEntity> find(String username)
    {
        return find(username, true);
    }

    public List<SolvedChallengeEntity> getSolvedChallenge(UserEntity user)
    {
        UserModel model = users.findById(user.getId());
        return model.getSolvedChallenges().stream().map(solvedChallengeConverter::convert).toList();
    }
}