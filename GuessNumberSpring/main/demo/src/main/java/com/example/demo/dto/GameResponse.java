package com.example.demo.dto;

import com.example.demo.dataModel.Attempt;

import java.util.ArrayList;
import java.util.List;

public class GameResponse {
    private String message;
    private int remainingAttempts;
    private List<Attempt> history;
    private boolean gameOver;

//    public String getCheckSum() {
//        return checkSum;
//    }
//
//    public void setCheckSum(String checkSum) {
//        this.checkSum = checkSum;
//    }
//
//    private String checkSum;

    // Геттеры и сеттеры
    public GameResponse(String message, int remainingAttempts, List<Attempt> history, boolean gameOver) {
        this.message = message;
        this.remainingAttempts = remainingAttempts;
        this.history = history != null ? history : new ArrayList<>();;
        this.gameOver = gameOver;
    }

    public GameResponse(String message) {
        this.message = message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setRemainingAttempts(int remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }

    public int getRemainingAttempts() {
        return remainingAttempts;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public List<Attempt> getHistory() {
        return history;
    }

}
