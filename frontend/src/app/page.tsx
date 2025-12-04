import LogoUpload from "@/components/LogoUpload";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            TruLogo Risk Analysis
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Upload your logo to check for trademark infringement risks against our database.
          </p>
        </div>
        <LogoUpload />
      </div>
    </div>
  );
}
