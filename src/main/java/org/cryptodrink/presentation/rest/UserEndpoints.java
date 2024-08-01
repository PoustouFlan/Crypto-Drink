package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.UserConverter;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.service.UserService;
import org.cryptodrink.presentation.rest.response.UserResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Optional;

@Path("/api/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserEndpoints {

    @Inject
    UserService userService;
    @Inject
    UserConverter userConverter;

    @Path("/{username}")
    @GET
    public Response getUser(@PathParam("username") String username)
    {
        UserEntity user = userService.find(username, true, true);
        if (user == null)
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        UserResponse response = userConverter.convert(user);
        return Response.ok().entity(response).build();
    }

    @Path("/{username}")
    @PUT
    public Response updateUser(@PathParam("username") String username) {
        UserEntity user = userService.find(username, false, true);
        if (user == null)
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        UserResponse response = userConverter.convert(user);
        return Response.ok().entity(response).build();
    }
}