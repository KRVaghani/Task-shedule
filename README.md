# Task Scheduler

A modern task scheduling application built with React, TypeScript, and Vite. This application helps you organize and manage your tasks with different calendar views (week, month, year) and task status tracking.

![Task Scheduler Screenshot](screenshot.png)

## Features

- **Multiple Calendar Views**: Switch between week, month, and year views
- **Task Management**: Create, update, and delete tasks
- **Status Tracking**: Monitor task status (pending, in-progress, completed)
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Theme Switching**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS with responsive design
- **API Communication**: Axios
- **Backend**: JSON Server (REST API)
- **Libraries**:
  - date-fns: Date manipulation
  - react-icons: UI icons
  - @hello-pangea/dnd: Drag and drop functionality

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KRVaghani/Task-shedule.git
   cd Task-shedule
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the JSON server (API):
   ```bash
   npx json-server --watch db.json --port 3001
   ```

4. In a new terminal, start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## Usage

1. **Adding a Task**:
   - Fill out the task form with title, description, date, time, and priority
   - Click "Add Task" to save

2. **Viewing Tasks**:
   - Use the view switcher to toggle between week, month, and year views
   - Tasks are displayed based on their scheduled dates

3. **Managing Tasks**:
   - Click on a task to view details or update its status
   - Tasks are color-coded by priority and status

## Project Structure

```
src/
├── App.tsx              # Main application component
├── components/
│   ├── MonthView.tsx    # Month calendar view
│   ├── StatusView.tsx   # Task status tracking view
│   ├── TaskForm.tsx     # Task creation form
│   ├── ThemeSwitcher.tsx # Theme toggle component
│   ├── ViewSwitcher.tsx # Calendar view selector
│   ├── WeekView.tsx     # Week calendar view
│   └── YearView.tsx     # Year calendar view
└── types/
    └── task.ts          # TypeScript interfaces for tasks
```

## Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production-ready application
- `npm run lint`: Lint the codebase
- `npm run preview`: Preview the built application

### Backend API

The application uses JSON Server as a mock backend. The API endpoints are:

- `GET /tasks`: Retrieve all tasks
- `POST /tasks`: Create a new task
- `PUT /tasks/:id`: Update a task
- `DELETE /tasks/:id`: Delete a task

## Deployment

To deploy the application:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your hosting provider of choice.

3. Ensure your backend API is also deployed and accessible.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast build tool
- All open-source libraries used in this project
