# 🚀 InterPrep - Complete Interview Platform

**InterPrep** is a comprehensive technical interview platform that enables seamless video-based coding interviews with real-time collaboration features. Built with modern web technologies, it provides everything needed for conducting, scheduling, and reviewing technical interviews.

## ✨ Features

### 🎥 **Live Video Interviews**

- High-quality video conferencing with Stream.io
- Real-time audio/video controls
- Professional meeting setup with camera and microphone testing
- Screen sharing capabilities
- Multiple layout options (grid and speaker view)

### 💻 **Integrated Code Editor**

- Monaco Editor integration for code collaboration
- Syntax highlighting for multiple programming languages
- Real-time code sharing between interviewer and candidate
- Support for JavaScript, Python, Java, and more

### 📅 **Smart Scheduling System**

- Intuitive interview scheduling interface
- Calendar integration with date/time selection
- Multi-interviewer support
- Candidate and interviewer role management
- Automated interview reminders

### 👥 **Role-Based Access Control**

- **Interviewer Dashboard**: Schedule interviews, manage candidates, review recordings
- **Candidate Portal**: View upcoming interviews, join meetings, access preparations
- Secure authentication with Clerk
- User profile management

### 📊 **Interview Management**

- Interview status tracking (upcoming, live, completed)
- Recording and playback functionality
- Comment system for feedback
- Interview history and analytics
- Admin dashboard for oversight

### 🎨 **Modern UI/UX**

- Responsive design for all devices
- Dark/Light theme support
- Professional and intuitive interface
- Smooth animations with Framer Motion
- Accessible components with Radix UI

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### **Backend & Database**

- **Convex** - Backend-as-a-Service platform
- **Stream.io** - Video/Audio SDK
- **Clerk** - Authentication and user management
- **Webhooks** - Real-time data synchronization

### **Development Tools**

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Docker** - Containerization
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or later
- npm, yarn, pnpm, or bun
- Clerk account for authentication
- Stream.io account for video functionality
- Convex account for backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TusharChauhan09/InterPrep.git
   cd InterPrep
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_webhook_secret

   # Stream.io Video
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key

   # Convex Backend
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOYMENT=your_convex_deployment
   ```

4. **Setup Convex**

   ```bash
   npx convex dev
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Development Environment

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Environment

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 📁 Project Structure

```
InterPrep/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── (root)/            # Main application routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI component library
│   │   ├── providers/        # Context providers
│   │   └── blocks/           # Feature-specific components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── constants/            # Application constants
│   └── actions/              # Server actions
├── convex/                   # Backend schema and functions
├── public/                   # Static assets
├── docker-compose.*.yml      # Docker configurations
└── package.json             # Dependencies and scripts
```

## 🔧 Configuration

### Clerk Authentication Setup

1. Create a Clerk application
2. Configure OAuth providers
3. Set up webhooks for user synchronization
4. Add authentication middleware

### Stream.io Video Setup

1. Create a Stream application
2. Generate API keys
3. Configure video call settings
4. Set up recording capabilities

### Convex Backend Setup

1. Deploy Convex functions
2. Configure database schema
3. Set up real-time subscriptions
4. Configure authentication integration

## 🚀 Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Build for production     |
| `npm run start`  | Start production server  |
| `npm run lint`   | Run ESLint               |
| `npx convex dev` | Start Convex development |

## 🎯 Key Features Implementation

### Interview Scheduling

- Calendar-based date selection
- Time slot management
- Multi-participant support
- Automated notifications

### Video Conferencing

- WebRTC-based communication
- Device testing and setup
- Recording capabilities
- Real-time chat

### Code Collaboration

- Monaco Editor integration
- Syntax highlighting
- Real-time synchronization
- Multiple language support

### User Management

- Role-based access (Interviewer/Candidate)
- Profile management
- Authentication flows
- Permission controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or need help:

1. Check the [documentation](https://github.com/TusharChauhan09/InterPrep/wiki)
2. Search [existing issues](https://github.com/TusharChauhan09/InterPrep/issues)
3. Create a [new issue](https://github.com/TusharChauhan09/InterPrep/issues/new)

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Stream.io](https://getstream.io/) - Video/Audio SDK
- [Clerk](https://clerk.com/) - Authentication platform
- [Convex](https://convex.dev/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://radix-ui.com/) - Component library

---

**Made with ❤️ by [TusharChauhan09](https://github.com/TusharChauhan09)**
