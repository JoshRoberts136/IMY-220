import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FileManager from './FileManager';
import Files from './Files';
import EditProject from './EditProject';
import AddMemberToProject from './AddMemberToProject';
import TransferOwnership from './TransferOwnership';
import CheckoutManager from './CheckoutManager';
import ProjectChatroom from './ProjectChatroom';
import PageContainer from './PageContainer';
import apiService from '../utils/apiService';
import '../styles.css';
import { Edit3, Crown } from 'lucide-react';
import Button from './Button';

const ProjectCard = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isTransferOwnershipOpen, setIsTransferOwnershipOpen] = useState(false);
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
        const isAdmin = currentUser?.isAdmin || false;
        const isProjectOwner = response.ownedBy === currentUser?.id || isAdmin;
        const isProjectMember = response.members?.includes(currentUser?.id) || isAdmin;
        setIsOwner(isProjectOwner);
        setIsMember(isProjectMember);
        
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
          messages: response.messages || [],
          checkedOutBy: response.checkedOutBy || null,
          checkedOutAt: response.checkedOutAt || null,
          version: response.version || '1.0.0'
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
              isOwner: isOwner,
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

  const handleOwnershipTransferred = () => {
    fetchProjectData();
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleHashtagClick = (tag) => {
    navigate('/home', { state: { searchQuery: tag } });
  };

  const isImagePath = (avatar) => {
    return avatar && (avatar.startsWith('/') || avatar.startsWith('http'));
  };

  const renderMemberAvatar = (avatar) => {
    if (isImagePath(avatar)) {
      return (
        <img 
          src={avatar} 
          alt="Member avatar"
          className="w-full h-full object-cover rounded-full"
        />
      );
    } else {
      return <span className="avatar-emoji">{avatar || '👤'}</span>;
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

  const currentUser = apiService.getUser();
  const isAdmin = currentUser?.isAdmin || false;
  const canEdit = (isOwner && !project.checkedOutBy) || isAdmin;

  return (
    <PageContainer>
      <div className="project-hero">
        <div className="project-info" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ width: '100%' }}>
            <h1 className="project-title">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span>Created: {project.created}</span>
              <span>Last Updated: {project.lastUpdated}</span>
              <span>Version: {project.version}</span>
            </div>
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="tag"
                  onClick={() => handleHashtagClick(tag)}
                  style={{ cursor: 'pointer' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {isOwner && (
              <div className="project-actions">
                <Button
                  variant="warning"
                  icon={Edit3}
                  onClick={handleEditProject}
                  disabled={!isAdmin && !!project.checkedOutBy}
                  title={project.checkedOutBy && !isAdmin ? 'Cannot edit while project is checked out' : isAdmin ? 'Edit Project (Admin)' : 'Edit project'}
                >
                  {isAdmin ? 'Edit Project (Admin)' : 'Edit Project'}
                </Button>
                {!isAdmin && (
                  <Button
                    variant="secondary"
                    icon={Crown}
                    onClick={() => setIsTransferOwnershipOpen(true)}
                  >
                    Transfer Ownership
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
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
                  <div className="member-avatar" style={{ overflow: 'hidden' }}>
                    {renderMemberAvatar(member.avatar)}
                    {member.isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.name} {member.isOwner && <span className="crown-indicator">👑</span>}
                    </div>
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
          {isMember && !isAdmin && (
            <Button 
              variant="secondary"
              onClick={() => setIsAddMemberModalOpen(true)}
              className="w-full mt-3"
            >
              ➕ Add Friend
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <CheckoutManager 
          project={project} 
          isMember={isMember}
          onStatusChange={fetchProjectData}
        />
        <Files projectId={project.id} project={project} onCommitCreated={fetchProjectData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '400px' }}>
        <FileManager projectId={project.id} canEdit={isMember && project.checkedOutBy === apiService.getUser()?.id} />
        <ProjectChatroom projectId={project.id} isMember={isMember} />
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
        currentMembers={projectMembers}
        onMemberAdded={handleMemberAdded}
      />

      <TransferOwnership
        isOpen={isTransferOwnershipOpen}
        onClose={() => setIsTransferOwnershipOpen(false)}
        projectId={project?.id}
        projectName={project?.name}
        members={projectMembers}
        onTransferred={handleOwnershipTransferred}
      />
    </PageContainer>
  );
};

export default ProjectCard;
