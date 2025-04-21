# Shift-Bookk Admin Dashboard

A modern admin dashboard for managing employee shifts, time off requests, and analytics.

## Features

- Employee management
- Shift scheduling
- Time off request handling
- Real-time analytics
- Dark mode support
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and Firebase services
  ├── context/       # React context providers
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utility functions
  ├── styles/        # Global styles and theme
  └── App.js         # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
