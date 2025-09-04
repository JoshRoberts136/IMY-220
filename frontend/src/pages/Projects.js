import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Files from '../components/Files';
import Messages from '../components/Messages';
import EditProject from '../components/EditProject';
import LanguageTags from '../components/LanguageTags';
import ActivityFeed from '../components/ActivityFeed';
import '../styles.css';

function Projects() {
  const { projectId } = useParams();

  // Dummy data - in real app, fetch based on projectId
  const project = {
    id: projectId || '1',
    name: 'Dummy Project',
    description: 'Project description here',
    languages: [
      { name: 'JavaScript', level: 'expert' },
      { name: 'React', level: 'advanced' },
      { name: 'Node.js', level: 'intermediate' }
    ],
    files: [{ name: 'file1.js' }, { name: 'file2.js' }],
    messages: [{ msg: 'Check-in msg1' }, { msg: 'Check-in msg2' }],
    members: [
      { name: 'User1', avatar: '👤', role: 'Developer' },
      { name: 'User2', avatar: '👤', role: 'Designer' }
    ],
    stats: { stars: 10, forks: 5, commits: 50, issues: 2 },
    activities: [
      { id: 1, user: { name: 'User1', avatar: '👤', isOnline: true }, action: 'checked in', project: { name: 'Dummy Project' }, message: 'Fixed bug', timestamp: '1 hour ago', projectImage: '📁', likes: 5, type: 'checkin' }
    ]
  };

  return (
    <div className="wireframe-container">
      <Header />
      <div className="wireframe-layout">
        <div className="layout-label">Project Header</div>
        <div className="content-section">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="placeholder-image large">Project Image</div>
            <div style={{ flex: 1 }}>
              <h3 className="section-title">{project.name}</h3>
              <p className="text-gray-400">{project.description}</p>
              <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
                <button className="btn">Star</button>
                <button className="btn">Fork</button>
                <button className="btn">Join</button>
              </div>
              <LanguageTags languages={project.languages} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Files & Status</div>
            <Files files={project.files} />
          </div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Activity Feed</div>
            <ActivityFeed activities={project.activities} />
          </div>
        </div>
        <div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Members</div>
            <div className="sidebar">
              <h3 className="section-title">Squad Members</h3>
              {project.members.map((member, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <div className="user-avatar-placeholder">{member.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p>{member.name}</p>
                    <p className="text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
              <button className="btn">Add Member</button>
            </div>
          </div>
          <div className="wireframe-layout">
            <div className="layout-label">Discussion Board</div>
            <Messages messages={project.messages} />
          </div>
          <div className="wireframe-layout">
            <div className="layout-label">Project Stats</div>
            <div className="sidebar">
              <h3 className="section-title">Arsenal Stats</h3>
              <div className="grid-2">
                <div>
                  <p>Stars: {project.stats.stars}</p>
                  <p>Forks: {project.stats.forks}</p>
                </div>
                <div>
                  <p>Commits: {project.stats.commits}</p>
                  <p>Issues: {project.stats.issues}</p>
                </div>
              </div>
            </div>
          </div>
          <EditProject />
        </div>
      </div>
    </div>
  );
}

export default Projects;