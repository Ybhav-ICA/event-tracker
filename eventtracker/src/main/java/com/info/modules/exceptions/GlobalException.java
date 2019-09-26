package com.info.modules.exceptions;

/**
 * Created by developer on 07-12-2017.
 */
public class GlobalException extends Exception {
    private static final long serialVersionUID = 1L;
    private String errorMessage;

    public GlobalException(String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
