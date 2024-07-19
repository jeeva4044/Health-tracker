import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WorkoutListComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  pagesArray: number[] = [];
  searchTerm: string = '';
  filterType: string = '';
  itemsPerPageOptions = [5, 10, 15];

  constructor() {}

  ngOnInit() {
    this.loadInitialUsers();
    this.loadUsersFromLocalStorage();
    this.applyFilters();
  }

  loadInitialUsers() {
    this.users = [
      {
        name: 'John',
        workouts: [
          { type: 'Cycling', minutes: 35 },
          { type: 'Running', minutes: 40 }
        ]
      },
      {
        name: 'Ash',
        workouts: [
          { type: 'Swimming', minutes: 65 },
          { type: 'Running', minutes: 15}
        ]
      },
      {
        name: 'Tyson',
        workouts: [
          { type: 'Running', minutes: 60 },
          { type: 'Cycling', minutes: 50 }
        ]
      }
    ];
  }

  loadUsersFromLocalStorage() {
    const localStorageUsers = JSON.parse(localStorage.getItem('workouts') || '[]');
    localStorageUsers.forEach((localStorageUser: any) => {
      const userIndex = this.users.findIndex(user => user.name === localStorageUser.username);
      if (userIndex !== -1) {
        this.users[userIndex].workouts.push({
          type: localStorageUser.workoutType,
          minutes: localStorageUser.workoutMinutes
        });
      } else {
        this.users.push({
          name: localStorageUser.username,
          workouts: [
            {
              type: localStorageUser.workoutType,
              minutes: localStorageUser.workoutMinutes
            }
          ]
        });
      }
    });
  }

  applyFilters() {
    let filteredUsers = this.users;

    if (this.searchTerm) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterType && this.filterType !== 'All') {
      filteredUsers = filteredUsers.filter(user =>
        user.workouts.some(workout => workout.type === this.filterType)
      );
    }

    this.paginatedUsers = filteredUsers.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
    this.generatePagesArray(filteredUsers.length);
  }

  paginateUsers() {
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.pagesArray.length) {
      this.currentPage = page;
      this.paginateUsers();
    }
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.applyFilters();
  }

  generatePagesArray(totalItems: number) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getTotalWorkoutMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  getWorkoutTypes(user: User): string {
    return user.workouts.map(workout => workout.type).join(', ');
  }
}