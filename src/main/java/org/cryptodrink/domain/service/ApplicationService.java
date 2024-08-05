package org.cryptodrink.domain.service;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class ApplicationService {

    @Inject
    UserService userService;

    @PostConstruct
    public void onStart() {
        userService.startScheduledUpdates();
    }
}

