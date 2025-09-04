import {useState, React} from 'react';
import Header from '../components/Header';
import ProfileInfo from '../components/ProfileInfo';
import ProfileStats from '../components/ProfileStats';
import LanguageTags from '../components/LanguageTags';
import ProjectsSection from '../components/ProjectsSection';
import ActivityFeed from '../components/ActivityFeed';
import '../styles.css';

const Profile = () => {
  const [user] = useState({
    username: "CodeLegend42",
    title: "Full-Stack Champion",
    bio: "Conquering bugs and building digital empires. 5+ years of battle-tested experience in the coding arena.",
    isOnline: true
  });
  const [stats] = useState({
    projects: 23,
    commits: 847,
    followers: 156,
    following: 89
  });
  const [languages] = useState([
    { name: "JavaScript", level: "expert" },
    { name: "React", level: "expert" },
    { name: "Python", level: "advanced" },
    { name: "Node.js", level: "advanced" },
    { name: "MongoDB", level: "intermediate" },
    { name: "Docker", level: "intermediate" },
    { name: "TypeScript", level: "advanced" }
  ]);
  const [projects] = useState([
    {
      name: "E-Commerce Beast",
      description: "Full-stack e-commerce platform with real-time inventory",
      stars: 42,
      forks: 18,
      lastUpdated: "2 hours ago",
      role: "owner"
    },
    {
      name: "AI Chat Companion",
      description: "React-based chat interface with AI integration",
      stars: 28,
      forks: 12,
      lastUpdated: "1 day ago",
      role: "owner"
    },
    {
      name: "Code Arena Platform",
      description: "Collaborative coding platform for teams",
      stars: 156,
      forks: 67,
      lastUpdated: "3 days ago",
      role: "member"
    },
    {
      name: "Data Visualization Suite",
      description: "Interactive charts and graphs library",
      stars: 89,
      forks: 34,
      lastUpdated: "1 week ago",
      role: "member"
    }
  ]);
  const [activities] = useState([
    {
      type: "commit",
      action: "Pushed 3 commits to E-Commerce Beast",
      timestamp: "2 hours ago"
    },
    {
      type: "comment",
      action: "Commented on issue #47 in Code Arena Platform",
      timestamp: "5 hours ago"
    },
    {
      type: "project",
      action: "Created new project: AI Chat Companion",
      timestamp: "1 day ago"
    },
    {
      type: "commit",
      action: "Merged pull request #23 in Data Visualization Suite",
      timestamp: "2 days ago"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileInfo user={user} isOwnProfile={true} />
            <ProjectsSection projects={projects} />
          </div>
          <div className="space-y-6">
            <ProfileStats stats={stats} />
            <LanguageTags languages={languages} />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;