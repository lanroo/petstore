# Pet Store Application

A modern Angular application for pet adoption management, built with Angular 18+ and following enterprise-grade development practices.

## Overview

This application transforms the traditional PetStore API into a comprehensive pet adoption platform. It provides a user-friendly interface for browsing available pets, managing adoptions, and handling store inventory operations.

## Architecture

### Core Features
- **Pet Management**: Complete CRUD operations for pet listings
- **Adoption System**: Streamlined pet adoption workflow
- **Store Inventory**: Product catalog and order management
- **Error Handling**: Comprehensive error management with custom pages
- **Responsive Design**: Mobile-first approach with Material Design

### Technical Stack
- **Framework**: Angular 18+
- **UI Library**: Angular Material
- **Styling**: SCSS with custom design system
- **State Management**: RxJS Observables and Services
- **API Integration**: RESTful API consumption with error handling
- **Routing**: Lazy-loaded feature modules

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/          # HTTP interceptors
│   │   ├── models/               # TypeScript interfaces
│   │   ├── services/             # Core business services
│   │   └── utils/                # Utility functions
│   ├── features/
│   │   ├── errors/               # Error page components
│   │   ├── home/                 # Landing page module
│   │   ├── pets/                 # Pet management module
│   │   └── store/                # Store inventory module
│   ├── layouts/                  # Application layouts
│   └── shared/                   # Reusable components
└── assets/                       # Static assets
```

## Key Components

### Services
- **PetService**: Manages pet CRUD operations and API communication
- **ImageService**: Handles pet image management with fallback mechanisms
- **ErrorService**: Centralized error handling with reactive patterns
- **StoreService**: Inventory and order management
- **UserService**: User account operations

### Modules
- **HomeModule**: Landing page with adoption statistics
- **PetsModule**: Pet listing, details, and management
- **StoreModule**: Product catalog and inventory
- **ErrorsModule**: Custom error pages (404, 500)

## API Integration

The application consumes a custom Pet Adoption API with intelligent adaptations:

- **Pet Endpoints**: Real pet adoption data
- **Store Endpoints**: Pet product inventory management
- **User Endpoints**: Adoption account management
- **Error Handling**: Comprehensive HTTP error management

## Development Features

### Code Quality
- **TypeScript**: Strict mode with comprehensive typing
- **Linting**: ESLint and Angular-specific rules
- **Error Handling**: Global HTTP interceptor with custom error pages
- **Performance**: Lazy loading and optimized bundle sizes

### User Experience
- **Responsive Design**: Mobile-first approach
- **Loading States**: Global loading indicators
- **Error Recovery**: User-friendly error messages and recovery options
- **Material Design**: Consistent UI components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Angular CLI 19+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lanroo/petstore.git
cd petstore
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200`

### Build for Production

```bash
ng build --configuration production
```

## Testing

Run unit tests:
```bash
ng test
```

Unit tests are configured with Karma and Jasmine for all services and components.

## Deployment

The application is ready for deployment with:
- Production build configuration
- Asset optimization
- Environment configuration

## API Configuration

The application uses a custom Pet Adoption API:
- **Base URL**: `https://projeto-jornadadados-pet-api-adoptt.zjnxkg.easypanel.host`
- **Authentication**: Not required for demo purposes
- **Rate Limiting**: Implemented with retry mechanisms

## Error Handling

Comprehensive error management includes:
- **HTTP Interceptors**: Global error handling
- **Custom Error Pages**: 404 and 500 error pages
- **User Notifications**: Toast notifications for user feedback
- **Logging**: Console logging for debugging

## Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **Image Optimization**: Cached pet images with fallbacks
- **Bundle Splitting**: Optimized chunk loading
- **Memory Management**: Proper subscription cleanup

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+


## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.