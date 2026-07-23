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
  { path: '/', element: <HomePage /> },
  { path: '/quiz', element: <QuizPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/careers', element: <CareersPage /> },
  { path: '/colleges', element: <CollegesPage /> },
  { path: '/classes', element: <ClassesPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export type Path = '/' | '/quiz' | '/dashboard' | '/careers' | '/colleges' | '/classes';
export type Params = Record<string, string | undefined>;
