import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { QuizService } from './quiz.service';
import { QuizComponent } from './quiz/quiz.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, QuizComponent, LeaderboardComponent],
  template: `
    <div class="container">
      <h1>Azure 204 Certification Quiz Game</h1>
      <nav>
        <button (click)="showQuiz()">Quiz</button>
        <button (click)="showLeaderboard()">Leaderboard</button>
      </nav>
      <app-quiz *ngIf="currentView === 'quiz'"></app-quiz>
      <app-leaderboard *ngIf="currentView === 'leaderboard'"></app-leaderboard>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #0078d4;
      text-align: center;
    }
    nav {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    nav button {
      margin: 0 10px;
    }
  `]
})
export class AppComponent implements OnInit {
  currentView: 'quiz' | 'leaderboard' = 'quiz';

  constructor(private http: HttpClient, private quizService: QuizService) {}

  ngOnInit() {
    this.http.get<any[]>('assets/azure-204-questions.json').subscribe(
      (questions) => {
        this.quizService.setQuestions(questions);
      },
      (error) => {
        console.error('Error loading questions:', error);
      }
    );
  }

  showQuiz() {
    this.currentView = 'quiz';
  }

  showLeaderboard() {
    this.currentView = 'leaderboard';
  }
}