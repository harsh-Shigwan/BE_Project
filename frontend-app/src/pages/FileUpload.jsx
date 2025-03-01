import { useState } from "react";
import axios from "axios";
import baseURL from "../assets/API_URL";
const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/api/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText(response.data.text);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Extract Text from File</h2>
        
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full border border-gray-300 rounded-lg p-2 mb-4 text-gray-600 cursor-pointer focus:outline-none focus:ring focus:border-blue-300"
        />

        <button 
          onClick={handleUpload} 
          className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Upload & Extract"}
        </button>

        {text && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 max-h-60 overflow-auto">
            <h3 className="font-semibold mb-2 text-lg">Extracted Text:</h3>
            <pre className="whitespace-pre-wrap">{text}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
