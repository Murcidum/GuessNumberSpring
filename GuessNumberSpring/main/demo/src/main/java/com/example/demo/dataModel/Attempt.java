package com.example.demo.dataModel;


public class Attempt {
    private int number;
    private String result;

    // Конструкторы, геттеры и сеттеры
    public Attempt(int number, String result) {
        this.number = number;
        this.result = result;
    }

    // Пустой конструктор
    public Attempt() {}

    public void setNumber(int number) {
        this.number = number;
    }

    public int getNumber() {
        return number;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getResult() {
        return result;
    }
}
