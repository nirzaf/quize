import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: Question[] = [];
  private currentQuestionIndex = 0;
  private score = 0;
  private timeLeft = 30; // 30 seconds per question
  private timerInterval: any;
  private difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  private questionsSubject = new BehaviorSubject<Question | null>(null);
  currentQuestion$ = this.questionsSubject.asObservable();

  private timeLeftSubject = new BehaviorSubject<number>(this.timeLeft);
  timeLeft$ = this.timeLeftSubject.asObservable();

  constructor() {}

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  startQuiz() {
    this.resetQuiz();
    this.updateCurrentQuestion();
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
    this.difficulty = difficulty;
    this.resetQuiz();
  }

  answerQuestion(answer: string): boolean {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === answer;
    if (isCorrect) {
      this.score++;
    }
    return isCorrect;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.updateCurrentQuestion();
  }

  private updateCurrentQuestion() {
    const filteredQuestions = this.questions.filter(q => q.difficulty === this.difficulty);
    if (this.currentQuestionIndex < filteredQuestions.length) {
      this.questionsSubject.next(filteredQuestions[this.currentQuestionIndex]);
      this.resetTimer();
    } else {
      this.questionsSubject.next(null);
    }
  }

  getScore() {
    return this.score;
  }

  getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }

  getTotalQuestions() {
    return this.questions.filter(q => q.difficulty === this.difficulty).length;
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.stopTimer();
  }

  private resetTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = 30;
    this.timeLeftSubject.next(this.timeLeft);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timeLeftSubject.next(this.timeLeft);
      if (this.timeLeft === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }
}