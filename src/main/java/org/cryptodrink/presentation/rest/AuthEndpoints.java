package org.cryptodrink.presentation.rest;

import org.cryptodrink.domain.service.AuthService;
import org.cryptodrink.presentation.rest.request.AuthRequest;
import org.cryptodrink.presentation.rest.response.TokenResponse;
import org.cryptodrink.presentation.rest.response.JwtResponse;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("/auth")
@Consumes("application/json")
@Produces("application/json")
public class AuthEndpoints {

    @Inject
    AuthService authService;

    @GET
    @Path("/generate-token")
    public Response generateToken() {
        try {
            TokenResponse tokenResponse = authService.generateToken();
            return Response.ok().entity(tokenResponse).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error generating token").build();
        }
    }

    @POST
    @Path("/verify-token")
    public Response verifyToken(AuthRequest authRequest) {
        try {
            boolean isValid = authService.verifyToken(authRequest.getUsername(), authRequest.getPayload());
            if (isValid) {
                String jwt = authService.generateJWT(authRequest.getUsername());
                JwtResponse jwtResponse = new JwtResponse(jwt);
                return Response.ok().entity(jwtResponse).build();
            } else {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error verifying token").build();
        }
    }
}
