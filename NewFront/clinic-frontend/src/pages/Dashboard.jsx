export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to the Clinic Management System Dashboard.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">Patients</h3>
          <p>Manage patient records</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Doctors</h3>
          <p>View and manage doctors</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold">Appointments</h3>
          <p>Schedule and track appointments</p>
        </div>
      </div>
    </div>
  );
}