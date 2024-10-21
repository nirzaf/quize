import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let entry of leaderboard; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ entry.name }}</td>
            <td>{{ entry.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .leaderboard {
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #0078d4;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.leaderboardService.getLeaderboard().then(leaderboard => {
      this.leaderboard = leaderboard;
    });
  }
}