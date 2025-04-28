package com.example.demo.controller;

import com.example.demo.dto.GameRequest;
import com.example.demo.dto.GameResponse;
import com.example.demo.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public ResponseEntity<GameResponse> startGame(@RequestBody GameRequest request) {
        try {
            if(gameService.checkStartRequest(request.getMin(), request.getMax(), request.getChecksum())){
                return ResponseEntity.ok(gameService.startGame(request.getMin(), request.getMax()));
            }
            return ResponseEntity.badRequest().body(new GameResponse("Проверочные значение не сошлись. Похоже на подмену данных"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new GameResponse(e.getMessage()));
        }
    }

    @PostMapping("/guess")
    public ResponseEntity<GameResponse> handleGuess(@RequestBody GameRequest request) {
        try {
            if(gameService.checkGuessRequest(request.getGuess(), request.getChecksum())){
                return ResponseEntity.ok(gameService.handleGuess(request.getGuess()));
            }
            return ResponseEntity.badRequest().body(new GameResponse("Проверочные значение не сошлись. Похоже на подмену данных"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new GameResponse(e.getMessage()));
        }
    }
}
