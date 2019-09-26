package com.info.modules.exceptions;

/**
 * Created by developer on 07-12-2017.
 */
public class NotFoundException extends Exception {
    private static final long serialVersionUID = 1L;
    private final String errorMessage;

    public NotFoundException(String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {

        return errorMessage;
    }
}
