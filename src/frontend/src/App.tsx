import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import DashboardLayout from "./components/DashboardLayout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Analytics from "./pages/Analytics";
import ApiDocs from "./pages/ApiDocs";
import ApiKeys from "./pages/ApiKeys";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Logs from "./pages/Logs";
import PhoneNumbers from "./pages/PhoneNumbers";
import Support from "./pages/Support";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
  beforeLoad: ({ context }: { context: unknown }) => {
    void context;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

const apiKeysRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/keys",
  component: ApiKeys,
});

const analyticsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/analytics",
  component: Analytics,
});

const phoneNumbersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/numbers",
  component: PhoneNumbers,
});

const billingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/billing",
  component: Billing,
});

const apiDocsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/docs",
  component: ApiDocs,
});

const logsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/logs",
  component: Logs,
});

const supportRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard/support",
  component: Support,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    apiKeysRoute,
    analyticsRoute,
    phoneNumbersRoute,
    billingRoute,
    apiDocsRoute,
    logsRoute,
    supportRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  void identity;
  void isInitializing;
  return <RouterProvider router={router} />;
}
