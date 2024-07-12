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

@Path("/user")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserEndpoints {

    @Inject
    UserService userService;
    @Inject
    UserConverter userConverter;

    @Path("/{username}")
    @GET
    public Response getCryptoHackUser(@PathParam("username") String username)
    {
        Optional<UserEntity> user = userService.findUserByName(username);
        if (user.isEmpty())
            return Response.status(Response.Status.BAD_REQUEST).build();
        UserResponse response = userConverter.convert(user.get());
        return Response.ok().entity(response).build();
    }
}
