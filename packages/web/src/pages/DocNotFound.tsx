import { Link } from "react-router-dom";

export default function DocNotFound() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
      <h1 className="text-2xl font-semibold">Document not found</h1>
      <p>
        The document you are looking for does not exist or has been removed.
      </p>
      <Link to="/new" className="text-blue-600 hover:underline">
        Create a new document
      </Link>
    </div>
  );
}
