export default function Jobs() {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>
          <div className="grid gap-4">
            {/* Job listings will be populated here */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Sample Job Position</h2>
              <p className="text-gray-600">This is where job listings will appear</p>
            </div>
          </div>
        </main>
      </div>
    );
  }