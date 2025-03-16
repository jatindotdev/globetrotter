# Globetrotter

Globetrotter is an interactive geography game that challenges your knowledge of world locations. Test your geography skills by guessing cities based on clues and improve your global awareness.

<img src="https://github.com/user-attachments/assets/3864e192-f1f4-4a7e-8920-8ee004e58094" width="500" />

<img src="https://github.com/user-attachments/assets/a42a7f8f-0c79-49b5-9397-d00bf1071a9e" width="500" />


## Features

- 🗺️ **Interactive Map Experience**: Navigate a fully interactive world map powered by Google Maps API
- 🎮 **Geography-based Challenges**: Receive clues about cities around the world and pinpoint their location
- 🏆 **Score Tracking**: Track your performance with correct/incorrect guesses and high scores
- 👥 **User Authentication**: Create an account to save your progress and high scores
- 💡 **Multiple Clues**: Get additional hints when you need them
- 🎉 **Visual Feedback**: Enjoy confetti celebrations when you guess correctly
- 🔗 **Challenge Friends**: Share your high scores and challenge friends to beat them

## Tech Stack

### Frontend

- **Next.js 13+** with App Router for modern React applications
- **React** for component-based UI development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for responsive and utility-first styling
- **Shadcn UI** for beautiful, accessible UI components
- **@vis.gl/react-google-maps** for interactive map integration
- **Canvas Confetti** for fun visual effects

### Backend

- **Next.js API Routes** for serverless backend functionality
- **PostgreSQL** for data persistence
- **Drizzle ORM** for database management
- **NextAuth.js** for authentication

### Infrastructure

- **Vercel** for hosting and deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Google Maps API key
- PostgreSQL database (local or hosted)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/globetrotter.git
   cd globetrotter
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # Database
   DATABASE_URL="your-database-connection-string"

   # Google Maps
   NEXT_PUBLIC_MAPS_API="your-google-maps-api-key-for-client"
   MAPS_BACKEND_API="your-maps-backend-api-key-for-server"
   JWT_SECRET="your-jwt-secret"
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to start playing!

## Game Instructions

1. You'll be presented with clues about a city somewhere in the world
2. Place a marker on the map where you think the city is located
3. Click "Check Answer" to verify your guess
4. Earn points for correct answers and track your high score
5. You have three lives per game session
6. Try to get as many correct answers as possible!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
