package com.fptu.group1.common.helper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
    private static final String DEFAULT_PATTERN = "dd/MM/yyyy";
    public static Date parseDate(String dateStr) throws ParseException {
        if (dateStr == null || dateStr.isEmpty()) return null;
        return new SimpleDateFormat(DEFAULT_PATTERN).parse(dateStr);
    }
} 