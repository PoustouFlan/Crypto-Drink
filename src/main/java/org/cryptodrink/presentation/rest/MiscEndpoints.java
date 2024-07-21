package org.cryptodrink.presentation.rest;

import org.cryptodrink.domain.service.ConfigService;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MiscEndpoints {
    @Inject
    ConfigService configService;

    @Path("/total-users")
    @GET
    public Response getTotalUsers() {
        Integer totalUsers = configService.getTotalUser();
        return Response.ok().entity(totalUsers).build();
    }
}
