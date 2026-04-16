import { PageSkeleton } from "@/components/LoadingSkeleton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GeneratePage = lazy(() => import("./pages/GeneratePage"));
const VideoDetailPage = lazy(() => import("./pages/VideoDetailPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ScriptsPage = lazy(() => import("./pages/ScriptsPage"));
const SharePage = lazy(() => import("./pages/SharePage"));

function PageLoader() {
  return <PageSkeleton />;
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LandingPage />
    </Suspense>
  ),
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PricingPage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generate",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <GeneratePage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const videoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/video/$id",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <VideoDetailPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const scriptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scripts",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <ScriptsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

// Public share route — no auth required
const shareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/share/$token",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SharePage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  dashboardRoute,
  generateRoute,
  videoDetailRoute,
  settingsRoute,
  scriptsRoute,
  shareRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
