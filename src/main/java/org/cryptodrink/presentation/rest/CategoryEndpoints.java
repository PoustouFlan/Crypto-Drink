package org.cryptodrink.presentation.rest;

import org.cryptodrink.converter.CategoryConverter;
import org.cryptodrink.domain.entity.CategoryEntity;
import org.cryptodrink.domain.service.CategoryService;
import org.cryptodrink.presentation.rest.request.CategoryRequest;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;

@Path("/api/category")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CategoryEndpoints {
    @Inject
    CategoryService categoryService;

    @Inject
    CategoryConverter categoryConverter;

    @Path("/")
    @GET
    public Response getCategory(CategoryRequest request) {
        Optional<CategoryEntity> query = categoryService.find(request.getName());
        if (query.isEmpty())
            return Response.status(Response.Status.NOT_FOUND).entity("Unknown Category").build();
        CategoryEntity category = query.get();
        return Response.ok().entity(categoryConverter.convert(category)).build();
    }

    @Path("/")
    @POST
    public Response getCategoryPost(CategoryRequest request) {
        return getCategory(request);
    }

    @Path("/")
    @GET
    public Response getAllCategories() {
        List<CategoryEntity> categories = categoryService.findAll();
        List<String> response = categories.stream().map(CategoryEntity::getName).toList();
        return Response.ok().entity(response).build();
    }
}
