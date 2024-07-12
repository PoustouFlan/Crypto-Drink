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

@Path("/api/scoreboard")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ScoreboardEndpoints {
    @Inject
    ScoreboardService scoreboardService;

    @Inject
    ScoreboardConverter scoreboardConverter;

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
}