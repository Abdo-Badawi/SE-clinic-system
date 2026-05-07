package com.clinic.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import feign.Logger;
import feign.Request;

import java.util.concurrent.TimeUnit;

@Configuration
public class FeignClientConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(10, TimeUnit.SECONDS, 60, TimeUnit.SECONDS, true);
    }
}
