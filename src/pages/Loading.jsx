function Loading() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">

      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-700"></div>

      <h2 className="text-3xl font-bold mt-8 text-blue-700">
        AI CivicAssist
      </h2>

      <p className="mt-4 text-lg text-gray-700">
        Checking your eligibility for government schemes...
      </p>

      <p className="text-gray-500 mt-2">
        Please wait...
      </p>

    </div>
  );
}

export default Loading;