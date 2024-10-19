import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout.js";

const ReviewPDF = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-700 text-center">
          Review PDF
        </h1>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
            <iframe
              src="/resources/sample.pdf"
              title="PDF Viewer"
              width="100%"
              height="800px"
              style={{ border: "none" }}
            >
              This browser does not support PDFs. Please download the PDF to
              view it.
            </iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewPDF;
