package com.clinic.appointment.exception;

import com.clinic.common.exception.CustomException;   // ✅ CORRECT IMPORT
import org.springframework.http.HttpStatus;

public class SlotUnavailableException extends CustomException {
    public SlotUnavailableException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}