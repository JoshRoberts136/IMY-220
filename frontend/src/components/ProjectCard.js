import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Files from './Files';
import Messages from './Messages';
import EditProject from './EditProject';
import DeleteProject from './DeleteProject';
import AddMemberToProject from './AddMemberToProject';
import LanguageTags from './LanguageTags';
import PageContainer from './PageContainer';
import apiService from '../utils/apiService';
import '../styles.css';
import { Edit3 } from 'lucide-react';
import Button from './Button';

const ProjectCard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const handleEditProject = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProject(projectId);
      
      if (response.success) {
        const currentUser = apiService.getUser();
        const isProjectOwner = response.ownedBy === currentUser?.id;
        const isMember = response.members?.includes(currentUser?.id);
        setIsOwner(isProjectOwner);
        setIsMember(isMember);
        
        const projectData = {
          id: response.id,
          name: response.name,
          description: response.description,
          image: getProjectIcon(response.language),
          owner: {
            id: response.ownedBy,
            name: response.ownerName || 'Unknown',
            avatar: response.ownerAvatar || '👤',
            isOnline: true
          },
          stats: {
            stars: response.stars || 0,
            forks: response.forks || 0,
            commits: response.commits?.length || 0,
            issues: 0
          },
          tags: response.hashtags || [],
          languages: [response.language],
          visibility: response.visibility || 'public',
          repository: response.repository || '',
          created: formatDate(response.createdAt),
          lastUpdated: formatDate(response.lastUpdated),
          members: response.members || [],
          commits: response.commits || [],
          messages: response.messages || []
        };
        
        setProject(projectData);
        
        if (response.members && response.members.length > 0) {
          fetchMemberDetails(response.members, response.ownedBy);
        }
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberDetails = async (memberIds, ownerId) => {
    try {
      const memberDetails = [];
      const uniqueMemberIds = new Set(memberIds);
      
      for (const memberId of uniqueMemberIds) {
        try {
          const userResponse = await apiService.getUserById(memberId);
          
          if (userResponse && userResponse.success !== false) {
            const isOwner = memberId === ownerId;
            
            memberDetails.push({
              id: userResponse.id || memberId,
              name: userResponse.username || 'Unknown User',
              avatar: userResponse.profile?.avatar || '👤',
              role: isOwner ? 'Project Owner' : 'Team Member',
              isOnline: Math.random() > 0.5
            });
          }
        } catch (err) {
          console.log(`Could not fetch member ${memberId}:`, err.message);
        }
      }
      
      memberDetails.sort((a, b) => {
        if (a.role === 'Project Owner') return -1;
        if (b.role === 'Project Owner') return 1;
        return 0;
      });
      
      console.log('Fetched member details:', memberDetails);
      setProjectMembers(memberDetails);
      setProject(prev => ({ ...prev, members: memberDetails }));
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  const getProjectIcon = (language) => {
    const icons = {
      'JavaScript': '⚡',
      'TypeScript': '📘',
      'Python': '🐍',
      'Java': '☕',
      'C++': '⚙️',
      'C#': '🎮',
      'Go': '🐹',
      'Rust': '🦀',
      'Ruby': '💎',
      'PHP': '🐘',
      'Swift': '🦉',
      'Kotlin': '🟣',
      'React': '⚛️',
      'Vue': '💚',
      'Angular': '🔺',
      'Solidity': '⟠',
      'default': '📁'
    };
    return icons[language] || icons.default;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)} weeks ago`;
    return `${Math.floor(diffInHours / 720)} months ago`;
  };

  const handleSaveProject = async (updatedProject) => {
    await fetchProjectData();
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleMemberAdded = (newMember) => {
    fetchProjectData();
    
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const response = await apiService.removeProjectMember(project.id, memberId);
        
        if (response.success) {
          fetchProjectData();
          
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
      }
    }
  };

  if (loading && projectId) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-gray-400">⚡ Loading project...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <h2 className="text-red-500 mb-4">❌ {error}</h2>
          <Button variant="primary" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <div className="text-center py-10">
          <h2 className="text-red-500 mb-4">❌ Project not found</h2>
          <Button variant="primary" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Project Hero - Full Width */}
      <div className="project-hero">
        <div className="project-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: '100%' }}>
            <h1 className="project-title">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span>Created: {project.created}</span>
              <span>Last Updated: {project.lastUpdated}</span>
            </div>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            
            {isOwner && (
              <div className="project-actions">
                <Button
                  variant="warning"
                  icon={Edit3}
                  onClick={handleEditProject}
                >
                  Edit Project
                </Button>
                <DeleteProject
                  projectId={project.id}
                  projectName={project.name}
                  onDeleted={() => navigate('/home')}
                />
              </div>
            )}
            
            <LanguageTags />
          </div>
        </div>
                  {/* Squad Members Sidebar */}
        <div className="sidebar" style={{ marginBottom: '20px' }}>
            <h3 className="section-title">Squad Members</h3>
            {projectMembers.length > 0 ? (
              projectMembers.map((member, index) => (
                <div
                  key={index}
                  className="member-card"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', marginBottom: '10px', background: 'rgba(45, 55, 72, 0.3)', borderRadius: '8px', border: '1px solid #333', cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${member.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div className="member-avatar">
                      <span className="avatar-emoji">{member.avatar}</span>
                      {member.isOnline && <div className="online-indicator"></div>}
                      {member.role === 'Project Owner' && <span className="crown-indicator">👑</span>}
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-role">{member.role}</div>
                    </div>
                    <div className="member-status">
                      {member.isOnline ? '🟢' : '⚫'}
                    </div>
                  </div>
                  {isOwner && member.role !== 'Project Owner' && (
                    <button
                      className="btn-remove-member"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMember(member.id);
                      }}
                      title="Remove member"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No members yet</div>
            )}
            {isOwner && (
              <Button 
                variant="secondary"
                onClick={() => setIsAddMemberModalOpen(true)}
                className="w-full mt-3"
              >
                ➕ Add Member
              </Button>
            )}
        </div>
      </div>

      {/* Two Column Grid - Original Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '400px' }}>
        {/* Left Column */}
        <div>
          <Files projectId={project.id} project={project} onCommitCreated={fetchProjectData} />
        </div>
        
        {/* Right Column */}
        <div>
          
          <Messages />
          
          <div className="project-stats-bar">
            <div className="stat-group">
              <span className="stat-value">{project.stats.stars}</span>
              <span className="stat-label">Stars</span>
            </div>
            <div className="stat-group">
              <span className="stat-value">{project.stats.forks}</span>
              <span className="stat-label">Forks</span>
            </div>
            <div className="stat-group">
              <span className="stat-value">{project.stats.commits}</span>
              <span className="stat-label">Commits</span>
            </div>
            <div className="stat-group">
              <span className="stat-value">{project.stats.issues}</span>
              <span className="stat-label">Issues</span>
            </div>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          ✅ Project updated successfully!
        </div>
      )}

      <EditProject 
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        project={project}
        onSave={handleSaveProject}
      />
      
      <AddMemberToProject
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        projectId={project?.id}
        currentMembers={project?.members}
        onMemberAdded={handleMemberAdded}
      />
    </PageContainer>
  );
};

export default ProjectCard;
