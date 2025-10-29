import React, { useState } from 'react';
import { Lock, Unlock, Download } from 'lucide-react';
import Button from './Button';
import apiService from '../utils/apiService';
import '../styles.css';

const CheckoutManager = ({ project, isMember, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState('');
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const currentUser = apiService.getUser();
  
  const isCheckedOut = !!project.checkedOutBy;
  const isCheckedOutByMe = project.checkedOutBy === currentUser?.id;
  const canCheckout = isMember && !isCheckedOut;
  const canCheckin = isMember && isCheckedOutByMe;

  const handleCheckout = async () => {
    if (!canCheckout) return;

    if (!window.confirm('Check out this project? This will lock it from other members until you check it back in.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.checkoutProject(project.id);
      
      if (response.success) {
        alert('Project checked out successfully! You can now make changes.');
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        alert(response.message || 'Failed to checkout project');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert(error.message || 'Failed to checkout project');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (e) => {
    e.preventDefault();

    if (!checkinMessage.trim()) {
      alert('Please provide a check-in message describing your changes');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.checkinProject(project.id, {
        message: checkinMessage.trim(),
        version: project.version || '1.0.0'
      });
      
      if (response.success) {
        alert('Project checked in successfully!');
        setCheckinMessage('');
        setShowCheckinForm(false);
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        alert(response.message || 'Failed to checkin project');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.message || 'Failed to checkin project');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here');
  };

  return (
    <div className="content-section">
      <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        {isCheckedOut ? <Lock size={20} color="var(--apex-orange)" /> : <Unlock size={20} color="#4ade80" />}
        Project Status
      </div>

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
