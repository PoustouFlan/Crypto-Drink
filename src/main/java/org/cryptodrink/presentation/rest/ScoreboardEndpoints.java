package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.ChallengeService;
import org.cryptodrink.domain.service.ScoreboardService;
import org.cryptodrink.domain.service.UserService;
import org.cryptodrink.presentation.rest.request.ChallengeRequest;
import org.cryptodrink.presentation.rest.request.ScoreboardCreateRequest;
import org.cryptodrink.presentation.rest.request.ScoreboardSubscribeRequest;
import org.cryptodrink.presentation.rest.request.ScoreboardWebhookRequest;
import org.cryptodrink.presentation.rest.response.ChallengeResponse;
import org.cryptodrink.presentation.rest.response.ScoreboardResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.regex.Pattern;

@Path("/api/scoreboard")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ScoreboardEndpoints {
    @Inject
    ScoreboardService scoreboardService;

    @Inject
    ScoreboardConverter scoreboardConverter;

    @Inject
    UserService userService;

    @Inject
    ChallengeService challengeService;

    @Inject
    ChallengeConverter challengeConverter;

    private static final Pattern VALID_NAME_PATTERN = Pattern.compile("^[A-Za-z0-9_.~-]+$");

    // Utility method to get authenticated user from the JWT token
    private UserEntity getAuthenticatedUser(HttpHeaders headers) {
        String token = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " prefix
            return userService.getUserFromToken(token); // Implement this method to decode JWT and get UserEntity
        }
        return null;
    }

    @Path("/{name}")
    @GET
    public Response getScoreboard(@PathParam("name") String name, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);

        ScoreboardEntity scoreboard = scoreboardService.find(name);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getIsPublic() && (!scoreboard.getOwner().equals(authenticatedUser))) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        ScoreboardResponse response = scoreboardConverter.convert(scoreboard);
        return Response.ok().entity(response).build();
    }

    @Path("/{name}")
    @DELETE
    public Response deleteScoreboard(@PathParam("name") String name, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);
        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Unauthorized").build();
        }

        ScoreboardEntity scoreboard = scoreboardService.find(name);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getOwner().equals(authenticatedUser)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        ScoreboardEntity deletedScoreboard = scoreboardService.findAndDelete(name);
        if (deletedScoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        ScoreboardResponse response = scoreboardConverter.convert(deletedScoreboard);
        return Response.ok().entity(response).build();
    }

    @Path("/")
    @GET
    public Response getAllScoreboards(@Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);

        List<ScoreboardEntity> scoreboards = scoreboardService.getAll();
        List<ScoreboardResponse> response = scoreboards.stream()
                .filter(scoreboard -> scoreboard.getIsPublic() || (scoreboard.getOwner().equals(authenticatedUser)))
                .map(scoreboardConverter::convert)
                .toList();

        return Response.ok().entity(response).build();
    }

    @Path("/")
    @POST
    public Response createScoreboard(ScoreboardCreateRequest request, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);
        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Unauthorized").build();
        }

        if (!VALID_NAME_PATTERN.matcher(request.getName()).matches())
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid scoreboard name").build();

        ScoreboardEntity scoreboard = scoreboardService.find(request.getName());
        if (scoreboard != null)
            return Response.status(Response.Status.CONFLICT).entity("Scoreboard already exists").build();

        ScoreboardEntity createdScoreboard = scoreboardService.create(request.getName(), authenticatedUser);
        ScoreboardResponse response = scoreboardConverter.convert(createdScoreboard);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @Path("/{name}/register")
    @POST
    public Response subscribeToScoreboard(@PathParam("name") String name, ScoreboardSubscribeRequest request, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);
        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Unauthorized").build();
        }

        ScoreboardEntity scoreboard = scoreboardService.find(name);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getOwner().equals(authenticatedUser)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        UserEntity user = userService.find(request.getUsername(), true, true);
        if (user == null)
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();

        ScoreboardEntity newScoreboard = scoreboardService.subscribeUser(scoreboard, user);
        if (scoreboard.equals(newScoreboard))
            return Response.status(Response.Status.CONFLICT).entity("User already in scoreboard").build();

        return Response.ok(scoreboardConverter.convert(newScoreboard)).build();
    }

    @Path("/{name}/user/{username}")
    @DELETE
    public Response removeFromScoreboard(@PathParam("name") String name, @PathParam("username") String username, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);
        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Unauthorized").build();
        }

        ScoreboardEntity scoreboard = scoreboardService.find(name);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getOwner().equals(authenticatedUser)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        UserEntity user = userService.find(username, true, true);
        if (user == null)
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();

        ScoreboardEntity newScoreboard = scoreboardService.removeUser(scoreboard, user);
        if (scoreboard.equals(newScoreboard))
            return Response.status(Response.Status.NOT_FOUND).entity("User not in scoreboard").build();

        return Response.ok(scoreboardConverter.convert(newScoreboard)).build();
    }

    @Path("/{name}/webhook")
    @PUT
    public Response addWebhookToScoreboard(@PathParam("name") String name, ScoreboardWebhookRequest request, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);
        if (authenticatedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Unauthorized").build();
        }

        ScoreboardEntity scoreboard = scoreboardService.find(name);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getOwner().equals(authenticatedUser)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        Boolean changed = scoreboardService.addWebhook(scoreboard, request.getUrl());
        if (!changed)
            return Response.status(Response.Status.CONFLICT).entity("Webhook already registered").build();

        return Response.ok(scoreboardConverter.convert(scoreboard)).build();
    }

    @Path("/{scoreboardName}/challenge")
    @GET
    public Response getChallengeScoreboard(@PathParam("scoreboardName") String scoreboardName, ChallengeRequest request, @Context HttpHeaders headers) {
        UserEntity authenticatedUser = getAuthenticatedUser(headers);

        ScoreboardEntity scoreboard = scoreboardService.find(scoreboardName);
        if (scoreboard == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();

        if (!scoreboard.getIsPublic() && (!scoreboard.getOwner().equals(authenticatedUser))) {
            return Response.status(Response.Status.FORBIDDEN).entity("Access denied").build();
        }

        String category = request.getCategory();
        String name = request.getName();

        ChallengeEntity challenge = challengeService.find(category, name);
        if (challenge == null)
            return Response.status(Response.Status.NOT_FOUND).entity("Challenge not found").build();

        ChallengeResponse response = challengeConverter.convert(challenge, scoreboard);
        return Response.ok().entity(response).build();
    }

    @Path("/{scoreboardName}/challenge")
    @POST
    public Response getChallengeScoreboardPost(@PathParam("scoreboardName") String scoreboardName, ChallengeRequest request, @Context HttpHeaders headers) {
        return getChallengeScoreboard(scoreboardName, request, headers);
    }
}