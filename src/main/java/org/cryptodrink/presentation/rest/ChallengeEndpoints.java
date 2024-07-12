package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.ChallengeService;
import org.cryptodrink.presentation.rest.request.ChallengeRequest;
import org.cryptodrink.presentation.rest.response.ChallengeResponse;
import org.cryptodrink.presentation.rest.response.UserResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Optional;

@Path("/api/challenge")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ChallengeEndpoints {
    @Inject
    ChallengeService challengeService;

    @Inject
    ChallengeConverter challengeConverter;

    @Path("/")
    @GET
    public Response getChallenge(ChallengeRequest request)
    {
        String category = request.getCategory();
        String name = request.getName();

        Optional<ChallengeEntity> challenge = challengeService.find(category, name);
        if (challenge.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("Challenge not found").build();
        ChallengeResponse response = challengeConverter.convert(challenge.get());
        return Response.ok().entity(response).build();
    }
}
