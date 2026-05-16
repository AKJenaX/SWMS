import React, { useCallback, useEffect, useState } from 'react';
import { complaintService } from '../api/dashboardServices';
import { DashboardPage, EmptyState, ErrorState, FilterBar, LoadingState, Panel, StatCard, StatGrid } from '../components/DashboardKit';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Resolved', value: 'resolved' },
];

function ComplaintsManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState('open');
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const data = await complaintService.getComplaints(filter !== 'all' ? filter : null);
      setComplaints(data || []);
      setSelectedComplaint((current) => current || data?.[0] || null);
    } catch (err) {
      setError(err.message || 'Unable to load complaints.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleStatusChange = async () => {
    if (!selectedComplaint || !newStatus) return;
    try {
      await complaintService.updateComplaintStatus(selectedComplaint.id, newStatus, newComment);
      setNewStatus('');
      setNewComment('');
      setSelectedComplaint(null);
      await loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!selectedComplaint || !newComment.trim()) return;
    try {
      await complaintService.addComment(selectedComplaint.id, newComment);
      setNewComment('');
      await loadComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardPage
      title="Complaints"
      subtitle="Citizen complaint workflow, notes, and status transitions"
      actions={<FilterBar options={filters} value={filter} onChange={(next) => { setSelectedComplaint(null); setFilter(next); }} />}
    >
      {loading ? (
        <LoadingState label="Loading complaints..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadComplaints} />
      ) : (
        <>
          <StatGrid>
            <StatCard label="Visible Complaints" value={complaints.length} helper="Current filter" />
            <StatCard label="Open" value={complaints.filter((c) => c.status === 'open').length} helper="Needs triage" tone="critical" />
            <StatCard label="In Review" value={complaints.filter((c) => c.status === 'in_review').length} helper="Being handled" tone="warning" />
            <StatCard label="Resolved" value={complaints.filter((c) => c.status === 'resolved').length} helper="Awaiting closure" />
          </StatGrid>

          <div className="dashboard-grid-3">
            <Panel title="Complaint Queue">
              {!complaints.length ? (
                <EmptyState title="No complaints found" message="Complaints matching this filter will appear here." />
              ) : (
                <div className="item-list">
                  {complaints.map((complaint) => (
                    <button
                      type="button"
                      key={complaint.id}
                      className={`list-item ${selectedComplaint?.id === complaint.id ? 'active' : ''}`}
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <strong>{complaint.subject}</strong>
                      <span className="text-muted">#{complaint.id} · {complaint.status} · {new Date(complaint.created_at).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title={selectedComplaint?.subject || 'Complaint Detail'} subtitle={selectedComplaint ? `ID: ${selectedComplaint.id}` : 'Select a complaint'}>
              {!selectedComplaint ? (
                <EmptyState title="No complaint selected" message="Choose a complaint to inspect details and update status." />
              ) : (
                <>
                  <div className="field-grid">
                    <div className="field-card"><span>Status</span><strong>{selectedComplaint.status}</strong></div>
                    <div className="field-card"><span>Priority</span><strong>{selectedComplaint.priority}</strong></div>
                    <div className="field-card"><span>Submitted By</span><strong>{selectedComplaint.submitter_name}</strong></div>
                    <div className="field-card"><span>Date</span><strong>{new Date(selectedComplaint.created_at).toLocaleDateString()}</strong></div>
                  </div>
                  <div className="field-card" style={{ marginTop: 14 }}>
                    <span>Description</span>
                    <strong>{selectedComplaint.description}</strong>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label className="input-label">Comment / Resolution Notes</label>
                    <textarea className="input-field" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment or resolution note" />
                    <div className="dashboard-actions" style={{ marginTop: 10 }}>
                      <button className="btn btn-primary" type="button" onClick={handleAddComment}>Add Comment</button>
                      <select className="select-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        <option value="">Change Status</option>
                        <option value="in_review">In Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button className="btn btn-accent" type="button" disabled={!newStatus} onClick={handleStatusChange}>Update</button>
                    </div>
                  </div>

                  <Panel title={`Comments (${selectedComplaint.comments?.length || 0})`} className="nested-panel">
                    {selectedComplaint.comments?.length ? (
                      <div className="item-list">
                        {selectedComplaint.comments.map((comment, index) => (
                          <div className="list-item" key={`${comment.created_at}-${index}`}>
                            <strong>{comment.author}</strong>
                            <span className="text-muted">{new Date(comment.created_at).toLocaleString()} · {comment.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState title="No comments yet" message="Comments and updates will be shown here." />
                    )}
                  </Panel>
                </>
              )}
            </Panel>
          </div>
        </>
      )}
    </DashboardPage>
  );
}

export default ComplaintsManagement;
