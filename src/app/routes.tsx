import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./components/Dashboard";
import { EquipmentRegistry } from "./components/EquipmentRegistry";
import { CheckInOut } from "./components/CheckInOut";
import { MaintenanceTracker } from "./components/MaintenanceTracker";
import { AdminPanel } from "./components/AdminPanel";
import { Login } from "./components/Login";
import { createHashRouter } from "react-router"

export const router = createHashRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "equipment", Component: EquipmentRegistry },
      { path: "checkinout", Component: CheckInOut },
      { path: "maintenance", Component: MaintenanceTracker },
      { path: "admin", Component: AdminPanel },
    ],
  },
]);