package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.ScoreboardService;
import org.cryptodrink.domain.service.UserService;
import org.cryptodrink.domain.service.webhook.WebhookService;
import org.cryptodrink.presentation.rest.request.ScoreboardCreateRequest;
import org.cryptodrink.presentation.rest.request.ScoreboardSubscribeRequest;
import org.cryptodrink.presentation.rest.request.ScoreboardWebhookRequest;
import org.cryptodrink.presentation.rest.response.ScoreboardResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
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
    WebhookService webhookService;

    private static final Pattern VALID_NAME_PATTERN = Pattern.compile("^[A-Za-z0-9_.~-]+$");

    @Path("/{name}")
    @GET
    public Response getScoreboard(@PathParam("name") String name)
    {
        Optional<ScoreboardEntity> scoreboard = scoreboardService.find(name);
        if (scoreboard.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("scoreboard not found").build();
        ScoreboardResponse response = scoreboardConverter.convert(scoreboard.get());
        return Response.ok().entity(response).build();
    }

    @Path("/{name}")
    @DELETE
    public Response deleteScoreboard(@PathParam("name") String name) {
        Optional<ScoreboardEntity> scoreboard = scoreboardService.findAndDelete(name);
        if (scoreboard.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("scoreboard not found").build();
        ScoreboardResponse response = scoreboardConverter.convert(scoreboard.get());
        return Response.ok().entity(response).build();
    }

    @Path("/")
    @GET
    public Response getAllScoreboards() {
        List<ScoreboardEntity> scoreboards = scoreboardService.getAll();
        List<ScoreboardResponse> response = scoreboards.stream().map(scoreboardConverter::convert).toList();
        return Response.ok().entity(response).build();
    }

    @Path("/")
    @POST
    public Response createScoreboard(ScoreboardCreateRequest request)
    {
        if (!VALID_NAME_PATTERN.matcher(request.getName()).matches())
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid scoreboard name").build();
        Optional<ScoreboardEntity> scoreboard = scoreboardService.find(request.getName());
        if (scoreboard.isPresent())
            return Response.status(Response.Status.CONFLICT).entity("Scoreboard already exists").build();
        scoreboard = scoreboardService.create(request.getName());
        ScoreboardResponse response = scoreboardConverter.convert(scoreboard.get());
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @Path("/{name}/register")
    @POST
    public Response subscribeToScoreboard(@PathParam("name") String name, ScoreboardSubscribeRequest request)
    {
        Optional<ScoreboardEntity> scoreboard = scoreboardService.find(name);
        if (scoreboard.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();
        Optional<UserEntity> user = userService.find(request.getUsername(), true, true);
        if (user.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        ScoreboardEntity newScoreboard = scoreboardService.subscribeUser(scoreboard.get(), user.get());
        if (scoreboard.get().equals(newScoreboard))
            return Response.status(Response.Status.CONFLICT).entity("User already in scoreboard").build();
        return Response.ok(scoreboardConverter.convert(newScoreboard)).build();
    }

    @Path("/{name}/user/{username}")
    @DELETE
    public Response removeFromScoreboard(@PathParam("name") String name, @PathParam("username") String username) {
        Optional<ScoreboardEntity> scoreboard = scoreboardService.find(name);
        if (scoreboard.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();
        Optional<UserEntity> user = userService.find(username, true, true);
        if (user.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        ScoreboardEntity newScoreboard = scoreboardService.removeUser(scoreboard.get(), user.get());
        if (scoreboard.get().equals(newScoreboard))
            return Response.status(Response.Status.NOT_FOUND).entity("User not in scoreboard").build();
        return Response.ok(scoreboardConverter.convert(newScoreboard)).build();
    }

    @Path("/{name}/webhook")
    @POST
    public Response addWebhookToScoreboard(@PathParam("name") String name, ScoreboardWebhookRequest request)
    {
        Optional<ScoreboardEntity> scoreboard = scoreboardService.find(name);
        if (scoreboard.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("Scoreboard not found").build();
        ScoreboardEntity newScoreboard = scoreboardService.addWebhook(scoreboard.get(), request.getUrl());
        if (scoreboard.get().equals(newScoreboard))
            return Response.status(Response.Status.CONFLICT).entity("Webhook already registered").build();
        return Response.ok(scoreboardConverter.convert(newScoreboard)).build();
    }
}