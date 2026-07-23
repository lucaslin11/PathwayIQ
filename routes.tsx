import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import HomePage from './pages/index';
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

const QuizPage = lazy(() => import('./pages/quiz'));
const DashboardPage = lazy(() => import('./pages/dashboard'));
const CareersPage = lazy(() => import('./pages/careers'));
const CollegesPage = lazy(() => import('./pages/colleges'));
const ClassesPage = lazy(() => import('./pages/classes'));

export const routes: RouteObject[] = [
  { path: '/PathwayIQ/', element: <HomePage /> },
  { path: '/PathwayIQ', element: <HomePage /> },
  { path: '/PathwayIQ/quiz', element: <QuizPage /> },
  { path: '/PathwayIQ/dashboard', element: <DashboardPage /> },
  { path: '/PathwayIQ/careers', element: <CareersPage /> },
  { path: '/PathwayIQ/colleges', element: <CollegesPage /> },
  { path: '/PathwayIQ/classes', element: <ClassesPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/' | '/quiz' | '/dashboard' | '/careers' | '/colleges' | '/classes';
export type Params = Record<string, string | undefined>;
