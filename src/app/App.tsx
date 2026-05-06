import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-gray-500">Cargando aplicación...</span>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
