# Photo Gallery App

## Overview

This is a **Photo Gallery App** built with Angular 19. The app allows users to browse a collection of images, favorite them, and view detailed information about each image. It features infinite scrolling, local storage for favorites, and responsive design. The app is designed to be modular, with standalone components and a clean architecture.

## Features

- **Home Page:**  
  Displays a grid of images fetched from the [Picsum Photos API](https://picsum.photos/). Supports infinite scrolling to load more images as the user scrolls.

- **Favorites Page:**  
  Shows a list of favorited images, stored in `localStorage`, with validation to ensure data integrity.

- **Image Details Page:**  
  Displays a full-size image with navigation controls (previous/next) and an option to remove the image from favorites.

- **Responsive Design:**  
  Uses CSS Grid and Material Design components for a responsive and user-friendly interface.

- **Unit Tests:**  
  Comprehensive test suites for all components (`HomeComponent`, `FavoritesComponent`, `ImageDetailsComponent`, `AppComponent`) using Jasmine and Karma.

## Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js:** Version 18 or later
- **Angular CLI:** Version 19
npm install -g @angular/cli@19
npm install

## Installation

1. **Clone the Repository:**
git clone (repository link)

2. **Navigate to project directory**
cd photo-gallery-app

3. **Install Dependencies:**
npm install

4. **Verify Installation:**  
Ensure all dependencies are installed correctly by checking the `node_modules` directory.

## Running the App

- **Start the Development Server:**
ng serve

## Run Tests

- **Run Tests:**
ng test

The app will be available at http://localhost:4200.

