# Shift-Bookk

A cross-platform workforce management system designed for multi-store retail chains, supporting offline functionality with SQLite and cloud-based data management with Firebase.

## Features

- **User Authentication**: Role-based access control with Firebase Authentication
- **Multi-Store Architecture**: Support for multiple retail locations
- **Offline-First Design**: SQLite with encryption for local storage
- **Real-Time Updates**: Firebase Firestore for cloud synchronization
- **Shift Management**: Recurring schedules, shift pick/drop, availability tracking
- **Time Tracking**: Clock-in/out with geofencing and photo verification
- **Employee Engagement**: In-app chat, announcements, gamification
- **Analytics**: Real-time dashboards and reporting
- **AI Integration**: Smart scheduling and predictive analytics
- **Kiosk Mode**: Dedicated interface for store kiosks

## Tech Stack

### Frontend
- **Admin/Manager Dashboard**: React.js + TypeScript + Vite
- **Employee App**: Flutter (iOS, Android, Web)
- **State Management**: Riverpod (Flutter) / Redux (React)
- **UI Framework**: Material-UI / Flutter Material Design

### Backend
- **Cloud Platform**: Firebase (Firestore, Functions, Hosting)
- **Local Storage**: SQLite with SQLCipher
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Notifications**: Firebase Cloud Messaging

## Getting Started

### Prerequisites
- Node.js (v16+)
- Flutter SDK (v3.0+)
- Firebase CLI
- SQLite3

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/shift-bookk.git
cd shift-bookk
```

2. Install dependencies:
```bash
# Admin Dashboard
cd admin-dashboard
npm install

# Employee App
cd ../employee-app
flutter pub get
```

3. Set up Firebase:
```bash
firebase login
firebase init
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

5. Run the development servers:
```bash
# Admin Dashboard
cd admin-dashboard
npm run dev

# Employee App
cd ../employee-app
flutter run
```

## Project Structure

```
shift-bookk/
├── admin-dashboard/     # React admin dashboard
├── employee-app/        # Flutter employee app
├── firebase/           # Firebase configuration
├── docs/              # Documentation
└── scripts/           # Build and deployment scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shift-bookk.com or join our [Discord community](https://discord.gg/shift-bookk).
