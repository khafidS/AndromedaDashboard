// src/FileManager.js
import React, { useState } from 'react';
// import './FileManager.css'; // Optional: You can keep this for any custom styles

const FileManager = () => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');

  const addFolder = () => {
    if (!newFolderName) return;
    const folder = { id: Date.now(), name: newFolderName, files: [] };
    setFolders([...folders, folder]);
    setNewFolderName('');
  };

  const addFile = () => {
    if (!newFileName || !currentFolder) return;
    const updatedFolders = folders.map(folder => {
      if (folder.id === currentFolder.id) {
        return {
          ...folder,
          files: [...folder.files, { id: Date.now(), name: newFileName }],
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
    setNewFileName('');
  };

  const downloadFile = (fileName) => {
    const blob = new Blob(["This is the content of the file: " + fileName], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectFolder = (folder) => {
    setCurrentFolder(folder);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">File Manager</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addFolder}>Add Folder</button>
      </div>

      <h2>Folders</h2>
      <ul className="list-group">
        {folders.map(folder => (
          <li key={folder.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span onClick={() => selectFolder(folder)} style={{ cursor: 'pointer' }}>{folder.name}</span>
            {currentFolder && currentFolder.id === folder.id && (
              <div>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New File Name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                  />
                  <button className="btn btn-success" onClick={addFile}>Add File</button>
                </div>

                <h3>Files</h3>
                <ul className="list-group">
                  {folder.files.map(file => (
                    <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {file.name}
                      <button className="btn btn-info" onClick={() => downloadFile(file.name)}>Download</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;