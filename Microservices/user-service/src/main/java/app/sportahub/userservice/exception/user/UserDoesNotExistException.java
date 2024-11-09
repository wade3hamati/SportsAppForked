package app.sportahub.userservice.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "User does not exist.")
public class UserDoesNotExistException extends ResponseStatusException{

    public UserDoesNotExistException(String id) {
        super(HttpStatus.NOT_FOUND, "User with id:" + id + "does not exist.");
    }
}