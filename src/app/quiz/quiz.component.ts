import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../quiz.service';
import { LeaderboardService } from '../leaderboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ... (template remains unchanged) ... -->
  `,
  styles: [`
    /* ... (styles remain unchanged) ... */
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  playerName: string = '';
  quizStarted: boolean = false;
  currentQuestion: any;
  currentQuestionIndex = 0;
  score = 0;
  totalQuestions = 0;
  timeLeft = 30;
  timeTaken = 0;
  showExplanation = false;
  lastAnswerCorrect = false;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  private questionSubscription: Subscription | undefined;
  private timerSubscription: Subscription | undefined;

  constructor(
    private quizService: QuizService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit() {
    this.questionSubscription = this.quizService.currentQuestion$.subscribe(question => {
      this.currentQuestion = question;
      this.currentQuestionIndex = this.quizService.getCurrentQuestionIndex();
      this.score = this.quizService.getScore();
      this.totalQuestions = this.quizService.getTotalQuestions();
      this.showExplanation = false;
    });

    this.timerSubscription = this.quizService.timeLeft$.subscribe(timeLeft => {
      this.timeLeft = timeLeft;
    });
  }

  ngOnDestroy() {
    this.questionSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
    this.quizService.stopTimer();
  }

  // ... (rest of the component methods remain unchanged) ...
}