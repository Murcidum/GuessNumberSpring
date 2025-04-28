package com.example.demo.service;

import com.example.demo.dataModel.Attempt;
import com.example.demo.dataModel.Game;
import com.example.demo.dto.GameResponse;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import java.util.ArrayList;

@Service
@SessionScope
public class GameService {
    private Game currentGame;

    public GameResponse startGame(int min, int max) {
        validateRange(min, max);
        currentGame = new Game(min, max);
        return buildResponse("Игра началась! Попыток: " + currentGame.getMaxAttempts());
    }

    public GameResponse handleGuess(int guess) {
        validateGameState();

        currentGame.setRemainingAttempts(currentGame.getRemainingAttempts() - 1);
        Attempt attempt = new Attempt(guess, evaluateGuess(guess));
        currentGame.getHistory().add(attempt);

        return buildResponseForGuess(attempt);
    }

    public boolean checkStartRequest(int min, int max, String checkSum) {
        String sha = DigestUtils.sha256Hex("" + min + max);
        return sha.equalsIgnoreCase(checkSum);
    }

    public boolean checkGuessRequest(int guess, String checkSum) {
        String sha = DigestUtils.sha256Hex("" + guess);
        return sha.equalsIgnoreCase(checkSum);
    }

    private GameResponse buildResponse(String message) {
        return new GameResponse(
                message,
                currentGame.getRemainingAttempts(),
                new ArrayList<>(currentGame.getHistory()),
                false
        );
    }

    private GameResponse buildResponseForGuess(Attempt attempt) {
        String message;
        boolean gameOver = false;

        if ("CORRECT".equals(attempt.getResult())) {
            message = "🎉 Правильно! Вы выиграли!";
            //gameOver = true;
        } else if (currentGame.getRemainingAttempts() <= 0) {
            message = "❌ Игра окончена! Число: " + currentGame.getSecretNumber();
            //gameOver = true;
        } else {
            message = "Число " + (attempt.getResult().equals("LOW") ? "больше" : "меньше");
        }

        return new GameResponse(
                message,
                currentGame.getRemainingAttempts(),
                new ArrayList<>(currentGame.getHistory()),
                gameOver
        );
    }

    private String evaluateGuess(int guess) {
        if (guess == currentGame.getSecretNumber()) return "CORRECT";
        return guess < currentGame.getSecretNumber() ? "LOW" : "HIGH";
    }

    private void validateRange(int min, int max) {
        if (min >= max) throw new IllegalArgumentException("Неверный диапазон");
    }

    private void validateGameState() {
        if (currentGame == null) throw new IllegalStateException("Игра не начата");
    }

}
