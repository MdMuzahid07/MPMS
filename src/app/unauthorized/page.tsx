export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-red-500">
        403 - Unauthorized
      </h1>
      <p className="mt-2 text-gray-500">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
