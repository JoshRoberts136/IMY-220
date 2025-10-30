import React, { useState } from 'react';
import { Lock, Unlock, Download } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';
import '../styles.css';

const CheckoutManager = ({ project, isMember, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState('');
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const currentUser = apiService.getUser();
  
  const isCheckedOut = !!project.checkedOutBy;
  const isCheckedOutByMe = project.checkedOutBy === currentUser?.id;
  const canCheckout = isMember && !isCheckedOut;
  const canCheckin = isMember && isCheckedOutByMe;

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleCheckout = async () => {
    if (!canCheckout) return;

    try {
      setLoading(true);
      const response = await apiService.checkoutProject(project.id);
      
      if (response.success) {
        showMessage('Project checked out successfully!', 'success');
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        showMessage(response.message || 'Failed to checkout project', 'error');
      }
    } catch (error) {
      showMessage(error.message || 'Failed to checkout project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (e) => {
    e.preventDefault();

    if (!checkinMessage.trim()) {
      showMessage('Please provide a check-in message', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.checkinProject(project.id, {
        message: checkinMessage.trim(),
        version: project.version || '1.0.0'
      });
      
      if (response.success) {
        setCheckinMessage('');
        setShowCheckinForm(false);
        if (onStatusChange) {
          await onStatusChange();
        }
        showMessage('Project checked in successfully!', 'success');
      } else {
        showMessage(response.message || 'Failed to checkin project', 'error');
      }
    } catch (error) {
      showMessage(error.message || 'Failed to checkin project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await apiService.request(`/projects/${project.id}/files`);
      
      if (response.success && response.files && response.files.length > 0) {
        for (const file of response.files) {
          const a = document.createElement('a');
          a.href = file.path;
          a.download = file.originalName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        showMessage(`Downloaded ${response.files.length} file(s)`, 'success');
      } else {
        showMessage('No files to download', 'error');
      }
    } catch (error) {
      showMessage('Failed to download files', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        {isCheckedOut ? <Lock size={20} color="var(--apex-orange)" /> : <Unlock size={20} color="#4ade80" />}
        Project Status
      </div>

      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '8px',
          background: message.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `2px solid ${message.type === 'success' ? '#4ade80' : '#ef4444'}`,
          color: message.type === 'success' ? '#4ade80' : '#ef4444',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {message.text}
        </div>
      )}

      <div style={{
        padding: '16px',
        background: isCheckedOut ? 'rgba(139, 0, 0, 0.1)' : 'rgba(74, 222, 128, 0.1)',
        border: `2px solid ${isCheckedOut ? 'var(--apex-orange)' : '#4ade80'}`,
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {isCheckedOut ? (
            <>
              <Lock size={24} color="var(--apex-orange)" />
              <div>
                <div style={{ color: 'var(--apex-orange)', fontWeight: '700', fontSize: '16px' }}>
                  🔒 Checked Out
                </div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                  {isCheckedOutByMe ? 'You have this project checked out' : 'Checked out by another member'}
                </div>
              </div>
            </>
          ) : (
            <>
              <Unlock size={24} color="#4ade80" />
              <div>
                <div style={{ color: '#4ade80', fontWeight: '700', fontSize: '16px' }}>
                  ✅ Available
                </div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                  Ready to be checked out by members
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {canCheckout && (
          <Button
            variant="primary"
            icon={Lock}
            onClick={handleCheckout}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Checking out...' : 'Check Out Project'}
          </Button>
        )}

        {canCheckin && !showCheckinForm && (
          <Button
            variant="success"
            icon={Unlock}
            onClick={() => setShowCheckinForm(true)}
            disabled={loading}
            className="w-full"
          >
            Check In Project
          </Button>
        )}

        {canCheckin && showCheckinForm && (
          <form onSubmit={handleCheckin} style={{
            padding: '16px',
            background: 'rgba(20, 20, 20, 0.5)',
            border: '2px solid var(--apex-orange)',
            borderRadius: '8px'
          }}>
            <label style={{
              display: 'block',
              color: '#ccc',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Check-in Message *
            </label>
            <textarea
              value={checkinMessage}
              onChange={(e) => setCheckinMessage(e.target.value)}
              placeholder="Describe the changes you made..."
              rows="4"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(10, 10, 10, 0.5)',
                border: '2px solid #333',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Rajdhani, sans-serif',
                resize: 'vertical',
                marginBottom: '12px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--apex-orange)'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="submit"
                variant="success"
                icon={Unlock}
                disabled={loading || !checkinMessage.trim()}
                className="flex-1"
              >
                {loading ? 'Checking in...' : 'Check In'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCheckinForm(false);
                  setCheckinMessage('');
                }}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isMember && !isCheckedOutByMe && (
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleDownload}
            disabled={loading}
            className="w-full"
          >
            Download Files
          </Button>
        )}

        {!isMember && (
          <div style={{
            padding: '12px',
            textAlign: 'center',
            color: '#888',
            background: 'rgba(20, 20, 20, 0.3)',
            borderRadius: '8px',
            border: '1px solid #333',
            fontSize: '14px'
          }}>
            Only project members can check out/in
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutManager;
