import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../Layout/Layout.js";
import { storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Button } from "../Button/Button.js";

const ReviewPDF = () => {
  const { filePath } = useParams();
  const location = useLocation();
  const isDoctor = location.pathname.includes("/doctor");
  const userType = isDoctor ? "doctor" : "patient";

  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log("Fetching file with path:", filePath);
        const decodedPath = decodeURIComponent(filePath);
        console.log("Decoded file path:", decodedPath);
        const fileRef = ref(storage, decodedPath);
        const url = await getDownloadURL(fileRef);
        console.log("File URL:", url);
        setFileUrl(url);
      } catch (error) {
        console.error("Error fetching file:", error);
        setError(`Error fetching file: ${error.message}`);
      }
    };

    if (filePath) {
      fetchFile();
    } else {
      setError("No file path provided");
    }
  }, [filePath]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout userType={userType}>
      <div className="container mx-auto py-8 pb-40">
        <h1 className="text-3xl font-bold mb-8 text-red-700 text-center">
          Review File
        </h1>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            {fileUrl ? (
              <iframe
                src={fileUrl}
                title="File Viewer"
                width="100%"
                height="800px"
                style={{ border: "none" }}
              >
                This browser does not support inline frames. Please download the
                file to view it.
              </iframe>
            ) : (
              <p>Loading file...</p>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button size="lg" className="bg-red-700 hover:bg-red-800 text-white">
            Re-Upload
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewPDF;
