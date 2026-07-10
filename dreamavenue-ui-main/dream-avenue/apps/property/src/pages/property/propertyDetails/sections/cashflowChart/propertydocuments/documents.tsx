import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFile,
  FaPlusCircle,
  FaEdit,
} from "react-icons/fa";
import { Button, Card } from "container/components";
import PropertyServices from "../../../../../../Services/property";
import pdfIcon from "@/assets/property_icons/pdfIcon.svg";
import docIcon from "@/assets/property_icons/docIcon.svg";
import addFolder from "@/assets/property_icons/folderIcon.svg";
interface DocumentsProps {
  propertyId: string;
}

const DocumentsSection: React.FC<DocumentsProps> = ({ propertyId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await PropertyServices.getPropertyDocuments(
          propertyId
        );

        // Process the documents
        const docs = response
          .filter((doc: any) => !doc.isFolder)
          .map((doc: any) => ({
            id: doc.id,
            name: doc.name || "Unnamed Document",
            type: getDocumentType(doc.name || ""),
            icon: getDocumentIcon(doc.name || ""),
            hasEdit: doc.canEdit || false,
            folderId: doc.folderId || null,
          }));

        setDocuments(docs);

        // Extract folders from the response
        const folderData = response
          .filter((item: any) => item.isFolder)
          .map((folder: any) => ({
            id: folder.id,
            name: folder.name || "Unnamed Folder",
          }));

        setFolders(folderData);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchDocuments();
    }
  }, [propertyId]);

  const getDocumentType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "doc";
      case "xls":
      case "xlsx":
        return "excel";
      case "jpg":
      case "jpeg":
      case "png":
        return "image";
      default:
        return "other";
    }
  };

  const getDocumentIcon = (filename: string) => {
    const type = getDocumentType(filename);
    switch (type) {
      case "pdf":
        return <img src={pdfIcon} />;
      case "doc":
        return <img src={docIcon} />;
      case "excel":
        return <FaFileExcel className="text-green-500" />;
      case "image":
        return <FaFileImage className="text-purple-500" />;
      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  const handleDocumentClick = async (docId: string) => {
    try {
      const blob = await PropertyServices.downloadPropertyDocument(
        propertyId,
        docId
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download =
        documents.find((doc) => doc.id === docId)?.name || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleNewFolderClick = () => {
    setShowNewFolderModal(true);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      return;
    }

    try {
      // Replace with your actual API call
      // const response = await PropertyServices.createPropertyFolder(
      //   propertyId,
      //   {
      //     name: newFolderName,
      //   }
      // );

      // Add the new folder to the folders state
      setFolders([...folders, { id: response.id, name: newFolderName }]);

      // Reset and close modal
      setNewFolderName("");
      setShowNewFolderModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleFolderClick = (folderId: string) => {
    // Handle folder click - either navigate to folder or show folder contents
    console.log(`Folder clicked: ${folderId}`);
    // Implementation would depend on your app's navigation/state management
  };

  if (isLoading) {
    return <div className="p-4">Loading documents...</div>;
  }

  // Filter documents that are not in any folder for the top section
  const unfilteredDocuments = documents.filter((doc) => !doc.folderId);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-xl font-bold text-gray-800">Documents</h2>
        <Button
          variant="outline"
          className="flex items-center px-4 py-2 border border-whsale rounded-md "
          onClick={handleNewFolderClick}
        >
          <img src={addFolder} className="mr-2 text-whsale" />
          <span className="text-whsale">New Folder</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {unfilteredDocuments.length > 0 ? (
          unfilteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center  bg-[#F9FAFB]  p-3 rounded-lg space-x-2 cursor-pointer hover:bg-gray-50 min-w-40 w-full"
              onClick={() => handleDocumentClick(doc.id)}
            >
              {doc.icon}
              <span className="font-medium text-gray-700 truncate max-w-32">
                {doc.name}
              </span>
              {doc.hasEdit && (
                <span className="text-gray-500 ml-auto">
                  <FaEdit />
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 ">No documents available</div>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex flex-col items-center p-4 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleFolderClick(folder.id)}
          >
            <FaFolder className="text-slate-500 text-4xl mb-2" />
            <span className="text-sm text-slate-700 text-center truncate w-full">
              {folder.name}
            </span>
          </div>
        ))}
      </div>
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => setShowNewFolderModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 bg-blue-600 text-white"
                onClick={handleCreateFolder}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
