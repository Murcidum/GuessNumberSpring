package com.example.demo.dataModel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Game {
    private int secretNumber;
    private int minRange;
    private int maxRange;
    private int maxAttempts;
    private int remainingAttempts;
    private List<Attempt> history = new ArrayList<>();

    // Конструкторы, геттеры и сеттеры
    // Конструктор для новой игры
    public Game(int minRange, int maxRange) {
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.secretNumber = ThreadLocalRandom.current().nextInt(minRange, maxRange + 1);
        this.maxAttempts = (int) Math.ceil(Math.log(maxRange - minRange + 1) / Math.log(2));
        this.remainingAttempts = this.maxAttempts;
        this.history = new ArrayList<>();
    }

    // Пустой конструктор для JPA/Jackson
    public Game() {}


    public void setMinRange(int minRange) {
        this.minRange = minRange;
    }

    public int getMinRange() {
        return minRange;
    }

    public void setMaxRange(int maxRange) {
        this.maxRange = maxRange;
    }

    public int getMaxRange() {
        return maxRange;
    }

    public void setSecretNumber(int secretNumber) {
        this.secretNumber = secretNumber;
    }

    public int getSecretNumber() {
        return secretNumber;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setRemainingAttempts(int remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }

    public int getRemainingAttempts() {
        return remainingAttempts;
    }

    public Collection<Attempt> getHistory() {
        return history;
    }

    public void setHistory(Collection<Attempt> history) {
        this.history = (List<Attempt>) history;
    }
}
