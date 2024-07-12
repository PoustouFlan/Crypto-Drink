package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.service.ScoreboardService;
import org.cryptodrink.presentation.rest.request.CreateScoreboardRequest;
import org.cryptodrink.presentation.rest.response.ScoreboardResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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

    @Path("/")
    @POST
    public Response createScoreboard(CreateScoreboardRequest request)
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
}