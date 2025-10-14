# Dokumentasi Migrasi ke React.js

Panduan lengkap untuk migrasi KBT App dari Django Templates ke React.js sebagai frontend modern.

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Analisis Arsitektur Saat Ini](#analisis-arsitektur-saat-ini)
3. [Strategi Migrasi](#strategi-migrasi)
4. [Persiapan](#persiapan)
5. [Setup React.js](#setup-reactjs)
6. [Migrasi Backend API](#migrasi-backend-api)
7. [Implementasi Frontend React](#implementasi-frontend-react)
8. [Integrasi dengan Backend](#integrasi-dengan-backend)
9. [Migrasi Fitur-Fitur Utama](#migrasi-fitur-fitur-utama)
10. [Testing & Deployment](#testing--deployment)
11. [Best Practices](#best-practices)

## 🎯 Gambaran Umum

### Arsitektur Saat Ini
- **Backend**: Django 4.2.9 dengan Django Templates
- **Frontend**: Bootstrap Material Design + jQuery + Leaflet.js
- **Rendering**: Server-Side Rendering (SSR)
- **API**: Partial REST API dengan Django REST Framework

### Arsitektur Target
- **Backend**: Django 4.2.9 sebagai REST API
- **Frontend**: React.js dengan component-based architecture
- **Rendering**: Client-Side Rendering (CSR) / Server-Side Rendering (SSR) dengan Next.js (opsional)
- **API**: Full REST API dengan Django REST Framework

### Keuntungan Migrasi ke React.js

✅ **User Experience Lebih Baik**
- Single Page Application (SPA) dengan navigasi yang smooth
- Update real-time tanpa page refresh
- Loading lebih cepat setelah initial load

✅ **Maintainability**
- Component-based architecture yang modular
- Reusable components
- Easier testing dengan Jest dan React Testing Library

✅ **Developer Experience**
- Hot Module Replacement (HMR) untuk development
- Rich ecosystem dan tooling
- Type safety dengan TypeScript (opsional)

✅ **Scalability**
- Separation of concerns antara frontend dan backend
- Dapat di-deploy secara terpisah
- Mudah untuk membuat mobile app dengan React Native (sharing logic)

## 🔍 Analisis Arsitektur Saat Ini

### Django Apps yang Ada

#### 1. **medaler** - Manajemen Anggota
- Views: Django class-based views
- Templates: HTML templates
- Features: CRUD operations, profile management

#### 2. **activity** - GPS Tracking & Aktivitas
- Views: Django views + REST API endpoints
- Templates: HTML dengan Leaflet maps
- Features: GPS tracking, file upload, Strava integration
- API Endpoints:
  - `POST /activity/upload/` - File upload
  - `GET /activity/` - Activity list
  - `GET /activity/report/` - Activity reports
  - `POST /activity/strava_entry/` - Strava data entry
  - `GET /activity/report/geni/activities/` - API list

#### 3. **events** - Manajemen Event
- Views: Django class-based views
- Templates: HTML dengan calendar, maps
- Features: Event management, GPX file upload

#### 4. **jobs** - Background Jobs Management
- Views: Django views
- Templates: HTML dengan job status
- Features: Celery job monitoring

#### 5. **reports** - Laporan & Analytics
- Views: Django views
- Templates: HTML dengan charts
- Features: Medal reports, leaderboard, statistics

### Dependencies Frontend Saat Ini

```
- jQuery 3.7.1
- Bootstrap Material Design 4.1.3
- Leaflet.js (maps)
- Chartist.js (charts)
- Bootstrap DateTimePicker
- Perfect Scrollbar
- Bootstrap Tags Input
- FullCalendar
- DataTables
```

### API Endpoints yang Sudah Ada

```python
# Authentication
POST /geni/token/              # Obtain JWT token
POST /geni/token/refresh/      # Refresh JWT token

# Activity
POST /activity/upload/         # Upload activity file
GET  /activity/                # List activities
GET  /activity/report/         # Activity reports
GET  /activity/report/geni/activities/  # API list (ViewSet)
POST /activity/strava_entry/   # Strava integration
GET  /activity/strava_graph/   # Activity graphs
```

## 🎯 Strategi Migrasi

### Pendekatan yang Disarankan: **Incremental Migration**

Migrasi dilakukan secara bertahap untuk meminimalkan risiko dan memastikan aplikasi tetap berfungsi.

### Fase Migrasi

#### **Fase 1: Persiapan & Setup (1-2 minggu)**
- Setup React project
- Konfigurasi build tools
- Setup routing
- Implement authentication

#### **Fase 2: Migrasi API Layer (2-3 minggu)**
- Lengkapi REST API untuk semua Django apps
- Standardisasi response format
- Implement CORS
- API documentation

#### **Fase 3: Migrasi UI Components (4-6 minggu)**
- Migrate page by page
- Start dengan halaman sederhana (dashboard, list views)
- Progress ke halaman kompleks (maps, charts, forms)

#### **Fase 4: Testing & Optimization (2-3 minggu)**
- Unit testing
- Integration testing
- Performance optimization
- Bug fixes

#### **Fase 5: Deployment & Monitoring (1 minggu)**
- Setup production build
- Deploy frontend
- Monitor errors
- User feedback

## 🚀 Persiapan

### 1. Audit Kode Existing

Buat inventory dari:
- [ ] Semua pages/views yang ada
- [ ] Semua API endpoints yang diperlukan
- [ ] Komponen UI yang dapat direuse
- [ ] Third-party libraries yang perlu diganti

### 2. Setup Development Environment

```bash
# Pastikan Node.js terinstall (v16+ recommended)
node --version
npm --version

# Atau gunakan Yarn
yarn --version
```

### 3. Backup dan Version Control

```bash
# Buat branch baru untuk migration
git checkout -b feature/react-migration

# Backup database
mysqldump -u root -p kbt_app > backup_before_migration.sql
```

## ⚛️ Setup React.js

### Opsi 1: Create React App (Recommended untuk Start)

```bash
# Di root project atau folder terpisah
npx create-react-app kbt-frontend
cd kbt-frontend

# Install dependencies
npm install axios react-router-dom
npm install @mui/material @emotion/react @emotion/styled  # Material-UI
npm install react-leaflet leaflet  # Maps
npm install chart.js react-chartjs-2  # Charts
npm install date-fns  # Date utilities
npm install formik yup  # Form handling
```

### Opsi 2: Vite (Recommended untuk Performance)

```bash
# Lebih cepat dari CRA
npm create vite@latest kbt-frontend -- --template react
cd kbt-frontend
npm install

# Install dependencies yang sama seperti di atas
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm install react-leaflet leaflet chart.js react-chartjs-2
npm install date-fns formik yup
```

### Opsi 3: Next.js (Untuk SSR/SEO)

```bash
# Jika butuh Server-Side Rendering
npx create-next-app@latest kbt-frontend
cd kbt-frontend

# Install dependencies
npm install axios @mui/material @emotion/react @emotion/styled
npm install react-leaflet leaflet chart.js react-chartjs-2
npm install date-fns formik yup
```

### Struktur Folder React Project

```
kbt-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                    # API services
│   │   ├── axios.js           # Axios configuration
│   │   ├── auth.js            # Authentication APIs
│   │   ├── activity.js        # Activity APIs
│   │   ├── events.js          # Event APIs
│   │   └── reports.js         # Report APIs
│   ├── components/            # Reusable components
│   │   ├── common/            # Common components
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Modal.js
│   │   │   └── Table.js
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Footer.js
│   │   │   └── Layout.js
│   │   ├── maps/              # Map components
│   │   │   ├── LeafletMap.js
│   │   │   └── GPXViewer.js
│   │   └── charts/            # Chart components
│   │       ├── BarChart.js
│   │       └── LineChart.js
│   ├── pages/                 # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── activities/
│   │   │   ├── ActivityList.js
│   │   │   ├── ActivityDetail.js
│   │   │   └── ActivityUpload.js
│   │   ├── events/
│   │   │   ├── EventList.js
│   │   │   └── EventDetail.js
│   │   ├── reports/
│   │   │   ├── ReportList.js
│   │   │   └── Leaderboard.js
│   │   └── medaler/
│   │       ├── MedalerList.js
│   │       └── MedalerProfile.js
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useWebSocket.js
│   ├── context/               # React Context
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── utils/                 # Utility functions
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/                # Global styles
│   │   ├── global.css
│   │   └── theme.js
│   ├── App.js                 # Main App component
│   ├── index.js               # Entry point
│   └── routes.js              # Route configuration
├── package.json
└── README.md
```

## 🔧 Migrasi Backend API

### 1. Lengkapi REST API Endpoints

Pastikan semua operasi yang tadinya dilakukan di Django views sekarang tersedia via API.

#### Contoh: Medaler API (Tambahkan ke `medaler/views.py`)

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Medalers
from .serializers import MedalersSerializer

class MedalerViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk CRUD operations Medaler
    """
    queryset = Medalers.objects.all()
    serializer_class = MedalersSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """GET /api/medaler/ - List all medalers"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """GET /api/medaler/{id}/ - Get single medaler"""
        medaler = self.get_object()
        serializer = self.get_serializer(medaler)
        return Response(serializer.data)
    
    def create(self, request):
        """POST /api/medaler/ - Create medaler"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        """PUT /api/medaler/{id}/ - Update medaler"""
        medaler = self.get_object()
        serializer = self.get_serializer(medaler, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """DELETE /api/medaler/{id}/ - Delete medaler"""
        medaler = self.get_object()
        medaler.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """GET /api/medaler/{id}/activities/ - Get medaler activities"""
        medaler = self.get_object()
        activities = medaler.activities_set.all()
        # Serialize and return activities
        return Response({"activities": []})  # Implement serialization
```

#### Update `medaler/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedalerViewSet

router = DefaultRouter()
router.register(r'api/medaler', MedalerViewSet, basename='medaler')

urlpatterns = [
    path('', include(router.urls)),
    # Keep existing template-based views for gradual migration
]
```

### 2. Standardisasi Response Format

Buat response wrapper untuk konsistensi:

```python
# app/api_response.py
from rest_framework.response import Response

class StandardResponse:
    @staticmethod
    def success(data=None, message="Success", status=200):
        return Response({
            "success": True,
            "message": message,
            "data": data
        }, status=status)
    
    @staticmethod
    def error(message="Error", errors=None, status=400):
        return Response({
            "success": False,
            "message": message,
            "errors": errors
        }, status=status)
```

### 3. Setup CORS (Cross-Origin Resource Sharing)

```bash
pip install django-cors-headers
```

Update `app/settings.py`:

```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add at the top
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Development - Allow all origins
CORS_ALLOW_ALL_ORIGINS = True

# Production - Specify allowed origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # Vite dev server
    "https://kbt.us.to",      # Production domain
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### 4. Update URL Structure untuk API

Update `app/urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints (untuk React)
    path('api/', include([
        path('auth/', include([
            path('token/', TokenObtainView.as_view(), name='token_obtain'),
            path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        ])),
        path('medaler/', include('medaler.urls')),
        path('activity/', include('activity.urls')),
        path('events/', include('events.urls')),
        path('jobs/', include('jobs.urls')),
        path('reports/', include('reports.urls')),
    ])),
    
    # Keep old template-based views for gradual migration
    path('', home, name='home'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 5. Create Serializers untuk Semua Models

Contoh untuk models yang belum punya serializer:

```python
# events/serializers.py
from rest_framework import serializers
from .models import Events

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'
    
    def to_representation(self, instance):
        """Customize output"""
        representation = super().to_representation(instance)
        # Add custom fields or format dates
        return representation
```

## ⚛️ Implementasi Frontend React

### 1. Setup Axios untuk API Calls

```javascript
// src/api/axios.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 2. Authentication Context

```javascript
// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      // Optionally fetch user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 3. API Services

```javascript
// src/api/activity.js
import axiosInstance from './axios';

export const activityAPI = {
  // Get all activities
  getActivities: async (params = {}) => {
    const response = await axiosInstance.get('/activity/', { params });
    return response.data;
  },

  // Get single activity
  getActivity: async (id) => {
    const response = await axiosInstance.get(`/activity/${id}/`);
    return response.data;
  },

  // Upload activity file
  uploadActivity: async (formData) => {
    const response = await axiosInstance.post('/activity/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get activity reports
  getReports: async (params = {}) => {
    const response = await axiosInstance.get('/activity/report/', { params });
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await axiosInstance.delete(`/activity/${id}/`);
    return response.data;
  },
};

// src/api/events.js
export const eventsAPI = {
  getEvents: async () => {
    const response = await axiosInstance.get('/events/');
    return response.data;
  },

  getEvent: async (id) => {
    const response = await axiosInstance.get(`/events/${id}/`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await axiosInstance.post('/events/', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await axiosInstance.put(`/events/${id}/`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await axiosInstance.delete(`/events/${id}/`);
    return response.data;
  },
};
```

### 4. React Router Setup

```javascript
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivityList from './pages/activities/ActivityList';
import ActivityDetail from './pages/activities/ActivityDetail';
import ActivityUpload from './pages/activities/ActivityUpload';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import ReportList from './pages/reports/ReportList';
import Leaderboard from './pages/reports/Leaderboard';
import MedalerList from './pages/medaler/MedalerList';
import MedalerProfile from './pages/medaler/MedalerProfile';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            {/* Activity routes */}
            <Route path="activity">
              <Route index element={<ActivityList />} />
              <Route path=":id" element={<ActivityDetail />} />
              <Route path="upload" element={<ActivityUpload />} />
            </Route>

            {/* Event routes */}
            <Route path="events">
              <Route index element={<EventList />} />
              <Route path=":id" element={<EventDetail />} />
            </Route>

            {/* Report routes */}
            <Route path="reports">
              <Route index element={<ReportList />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Medaler routes */}
            <Route path="medaler">
              <Route index element={<MedalerList />} />
              <Route path=":id" element={<MedalerProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 5. Layout Component

```javascript
// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
```

## 🗺️ Migrasi Fitur-Fitur Utama

### 1. Leaflet Maps (GPS Tracking)

```javascript
// src/components/maps/LeafletMap.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ center = [-7.5, 110.5], zoom = 13, activities = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    // Add markers for activities
    activities.forEach((activity) => {
      if (activity.latitude && activity.longitude) {
        L.marker([activity.latitude, activity.longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <b>${activity.title}</b><br>
            Distance: ${activity.distance} km<br>
            Duration: ${activity.duration}
          `);
      }
    });

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activities]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};

export default LeafletMap;
```

Atau gunakan `react-leaflet` (recommended):

```javascript
// src/components/maps/LeafletMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ center = [-7.5, 110.5], zoom = 13, activities = [] }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activities.map((activity) => (
        activity.latitude && activity.longitude && (
          <Marker key={activity.id} position={[activity.latitude, activity.longitude]}>
            <Popup>
              <b>{activity.title}</b><br />
              Distance: {activity.distance} km<br />
              Duration: {activity.duration}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
```

### 2. Charts (Chartist.js → Chart.js)

```javascript
// src/components/charts/ActivityChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = ({ data }) => {
  const chartData = {
    labels: data.labels, // e.g., ['Jan', 'Feb', 'Mar', ...]
    datasets: [
      {
        label: 'Distance (km)',
        data: data.distances,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Elevation (m)',
        data: data.elevations,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activity Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ActivityChart;
```

### 3. Data Tables

```javascript
// src/components/common/DataTable.js
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';

const DataTable = ({ columns, data, onRowClick }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.format ? column.format(row[column.id]) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
```

### 4. File Upload

```javascript
// src/pages/activities/ActivityUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../../api/activity';
import { Button, TextField, Box, Alert } from '@mui/material';

const ActivityUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('file', formData.file);
      uploadData.append('user_id', 1); // Get from auth context

      await activityAPI.uploadActivity(uploadData);
      navigate('/activity');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <h2>Upload Activity</h2>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={4}
        />
        
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Select File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".txt,.gpx"
          />
        </Button>
        
        {formData.file && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Selected: {formData.file.name}
          </Alert>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={uploading || !formData.file}
          sx={{ mt: 3 }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </Box>
  );
};

export default ActivityUpload;
```

### 5. WebSocket untuk Real-time Updates

```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Get token for authentication
    const token = localStorage.getItem('access_token');
    
    // Create WebSocket connection with token
    const wsUrl = `${url}?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { data, isConnected, sendMessage };
};

export default useWebSocket;
```

## 🧪 Testing & Deployment

### 1. Unit Testing dengan Jest

```javascript
// src/api/__tests__/activity.test.js
import { activityAPI } from '../activity';
import axiosInstance from '../axios';

jest.mock('../axios');

describe('Activity API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getActivities should fetch activities', async () => {
    const mockData = [
      { id: 1, title: 'Morning Ride', distance: 10 },
      { id: 2, title: 'Evening Ride', distance: 15 },
    ];

    axiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await activityAPI.getActivities();
    
    expect(axiosInstance.get).toHaveBeenCalledWith('/activity/', { params: {} });
    expect(result).toEqual(mockData);
  });

  test('uploadActivity should upload file', async () => {
    const mockFile = new File(['content'], 'activity.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', mockFile);

    axiosInstance.post.mockResolvedValue({ data: { success: true } });

    const result = await activityAPI.uploadActivity(formData);
    
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/activity/upload/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    expect(result).toEqual({ success: true });
  });
});
```

### 2. Component Testing

```javascript
// src/components/__tests__/DataTable.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../common/DataTable';

describe('DataTable Component', () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
  ];

  const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ];

  test('renders table with data', () => {
    render(<DataTable columns={columns} data={data} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  test('calls onRowClick when row is clicked', () => {
    const handleRowClick = jest.fn();
    render(<DataTable columns={columns} data={data} onRowClick={handleRowClick} />);
    
    fireEvent.click(screen.getByText('John'));
    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });
});
```

### 3. Build untuk Production

```bash
# Create .env.production
echo "REACT_APP_API_URL=https://kbt.us.to/api" > .env.production

# Build
npm run build

# Output akan ada di folder build/
```

### 4. Deploy React App

#### Opsi A: Deploy di Server yang Sama (Nginx)

```nginx
# /etc/nginx/sites-available/kbt-app
server {
    listen 80;
    server_name kbt.us.to;

    # React frontend
    location / {
        root /var/www/kbt-frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Django API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }

    # Static files (Django)
    location /static/ {
        alias /home/runner/work/kbt-app/kbt-app/static/;
    }

    # Media files
    location /media/ {
        alias /home/runner/work/kbt-app/kbt-app/media/;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### Opsi B: Deploy ke Vercel/Netlify

```bash
# Vercel
npm install -g vercel
vercel --prod

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

Update `vercel.json` atau `netlify.toml`:

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📚 Best Practices

### 1. Code Organization

- **Feature-based structure**: Group files by feature, bukan by type
- **Reusable components**: Buat komponen yang dapat digunakan ulang
- **Custom hooks**: Extract logic ke custom hooks
- **Constants**: Simpan constants di file terpisah

### 2. Performance Optimization

```javascript
// Use React.memo untuk prevent unnecessary re-renders
import React, { memo } from 'react';

const ActivityCard = memo(({ activity }) => {
  return (
    <div className="activity-card">
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
    </div>
  );
});

// Use lazy loading untuk code splitting
import React, { lazy, Suspense } from 'react';

const ActivityDetail = lazy(() => import('./pages/activities/ActivityDetail'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityDetail />
    </Suspense>
  );
}
```

### 3. Error Handling

```javascript
// src/components/common/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 4. Environment Variables

```bash
# .env.development
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws

# .env.production
REACT_APP_API_URL=https://kbt.us.to/api
REACT_APP_WS_URL=wss://kbt.us.to/ws
```

### 5. TypeScript (Optional tapi Recommended)

```typescript
// src/types/activity.ts
export interface Activity {
  id: number;
  title: string;
  description: string;
  distance: number;
  duration: number;
  elevation_gain: number;
  date: string;
  medaler_id: number;
}

// src/api/activity.ts
import { Activity } from '../types/activity';

export const activityAPI = {
  getActivities: async (): Promise<Activity[]> => {
    const response = await axiosInstance.get<Activity[]>('/activity/');
    return response.data;
  },
  
  getActivity: async (id: number): Promise<Activity> => {
    const response = await axiosInstance.get<Activity>(`/activity/${id}/`);
    return response.data;
  },
};
```

## 📝 Checklist Migrasi

### Persiapan
- [ ] Backup database dan code
- [ ] Setup development environment
- [ ] Create migration branch
- [ ] Document current architecture

### Backend API
- [ ] Install django-cors-headers
- [ ] Create serializers untuk semua models
- [ ] Create ViewSets untuk semua apps
- [ ] Update URL patterns untuk API
- [ ] Test API endpoints dengan Postman/Insomnia
- [ ] Write API documentation

### Frontend React
- [ ] Setup React project (CRA/Vite/Next.js)
- [ ] Install dependencies
- [ ] Setup routing
- [ ] Implement authentication
- [ ] Create API service layer
- [ ] Create layout components

### Migrasi UI
- [ ] Login page
- [ ] Dashboard
- [ ] Activity list
- [ ] Activity detail
- [ ] Activity upload
- [ ] Event list
- [ ] Event detail
- [ ] Report list
- [ ] Leaderboard
- [ ] Medaler list
- [ ] Medaler profile

### Integrasi
- [ ] Leaflet maps
- [ ] Charts
- [ ] File upload
- [ ] WebSocket untuk real-time
- [ ] Date/time pickers
- [ ] Data tables

### Testing
- [ ] Unit tests untuk API services
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests (optional)

### Deployment
- [ ] Build production
- [ ] Configure Nginx/Apache
- [ ] Deploy frontend
- [ ] Update CORS settings
- [ ] SSL certificate
- [ ] Monitor errors

## 🔗 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Material-UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Chart.js](https://www.chartjs.org/)

### Tools
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Postman](https://www.postman.com/) - API testing
- [VS Code Extensions](https://code.visualstudio.com/):
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint

### Learning
- [React Tutorial](https://react.dev/learn)
- [React + Django Tutorial](https://www.youtube.com/results?search_query=react+django+tutorial)
- [Full Stack React & Django](https://www.udemy.com/course/react-django-full-stack/)

## 💡 Tips & Tricks

1. **Mulai dari yang sederhana**: Migrate halaman sederhana dulu (list, detail) sebelum halaman kompleks (maps, charts)

2. **Gunakan Material-UI**: Karena sudah pakai Bootstrap Material Design, Material-UI akan familiar

3. **Keep backend views temporarily**: Jangan langsung hapus Django views, keep untuk fallback

4. **API versioning**: Pertimbangkan API versioning (`/api/v1/`) untuk future updates

5. **Error tracking**: Setup error tracking (Sentry, LogRocket) sejak awal

6. **Performance monitoring**: Monitor bundle size dan loading time

7. **Progressive migration**: Deploy incrementally, jangan sekaligus

8. **User feedback**: Collect feedback dari users selama migration

## 🤝 Support

Jika ada pertanyaan atau butuh bantuan selama proses migrasi:

1. Check dokumentasi React dan Django REST Framework
2. Search di Stack Overflow
3. Join React community di Discord/Slack
4. Konsultasi dengan senior developers

---

**Good luck dengan migrasi ke React.js! 🚀**

*Dokumentasi ini dibuat untuk membantu proses migrasi KBT App dari Django Templates ke React.js dengan pendekatan yang terstruktur dan incremental.*
