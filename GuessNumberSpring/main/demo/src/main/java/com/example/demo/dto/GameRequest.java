package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GameRequest {
    private int min;
    private int max;
    private Integer guess;
    private String checksum;

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    // Геттеры и сеттеры

    @JsonCreator
    public GameRequest(
            @JsonProperty("min") int min,
            @JsonProperty("max") int max,
            @JsonProperty("guess") Integer guess,
            @JsonProperty("checksum") String checksum
    ) {
        this.min = min;
        this.max = max;
        this.guess = guess;
        this.checksum = checksum;
    }


    public int getGuess() {
        return guess;
    }

    public void setGuess(int guess) {
        this.guess = guess;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }
}
