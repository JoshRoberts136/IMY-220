import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';
import '../styles.css';

function Files() {
  const [files, setFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [activeTab, setActiveTab] = useState('files');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [filesResponse, commitsResponse] = await Promise.all([
          apiService.getFiles(),
          apiService.getCommits({ limit: 10 })
        ]);
        
        if (filesResponse.success) {
          setFiles(filesResponse.data);
        }
        if (commitsResponse.success) {
          setCommits(commitsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="content-section">
        <h3 className="section-title">Arsenal Files</h3>
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <h3 className="section-title">Arsenal Files</h3>
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <h3 className="section-title">Arsenal Files</h3>
      <div className="tabs-placeholder">
        <div
          className={`tab-placeholder ${activeTab === 'files' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('files')}
        >
          Files
        </div>
        <div
          className={`tab-placeholder ${activeTab === 'commits' ? 'active' : ''} tab-cursor`}
          onClick={() => setActiveTab('commits')}
        >
          Commits
        </div>
      </div>
      
      {activeTab === 'files' ? (
        files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-item">
              <div>
                <span>{file.name}</span>
                <small className="text-gray-400"> ({file.size})</small>
              </div>
              <div>
                <span className={`status-${file.status}`}>{file.status}</span>
                <small className="text-gray-400"> - {file.lastModified}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No files found</div>
        )
      ) : (
        commits.length > 0 ? (
          commits.map((commit) => (
            <div key={commit.id} className="file-item">
              <div>
                <span className="text-blue-400">#{commit.hash}</span>
                <span className="ml-2">{commit.message}</span>
              </div>
              <div>
                <span className="text-gray-400">{commit.author}</span>
                <small className="text-gray-400"> - {commit.timestamp}</small>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No commits found</div>
        )
      )}
    </div>
  );
}

export default Files;