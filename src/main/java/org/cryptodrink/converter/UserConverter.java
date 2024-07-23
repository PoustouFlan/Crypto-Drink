package org.cryptodrink.converter;

import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.UserService;
import org.cryptodrink.presentation.rest.response.UserResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class UserConverter {
    @Inject
    UserService userService;

    @Inject
    SolvedChallengeConverter solvedChallengeConverter;

    public UserEntity convert(UserModel user)
    {
        return new UserEntity(
                user.getId(),
                user.getUsername(),
                user.getCountry(),
                user.getFirstBloods(),
                user.getJoined(),
                user.getLevel(),
                user.getRank(),
                user.getScore(),
                user.getWebsite(),
                user.getLastRefreshed()
        );
    }

    public UserResponse convert(UserEntity user)
    {
        List<SolvedChallengeEntity> solved = userService.getSolvedChallenges(user);
        return new UserResponse(
                userService.getCompletion(user), // TODO: layer
                user.getCountry(),
                user.getFirstBloods(),
                user.getJoined().toString(), // TODO: Format
                user.getLevel(),
                user.getRank(),
                user.getScore(),
                solved.stream().map(solvedChallengeConverter::convertChallenge).toList(),
                user.getUsername(),
                user.getWebsite(),
                user.getLastRefreshed().toString()
        );
    }
}
