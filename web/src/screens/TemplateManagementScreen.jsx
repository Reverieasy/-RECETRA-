import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useInlineNotification } from '../components/InlineNotificationSystem';
import { mockReceiptTemplates, mockOrganizations } from '../data/mockData';

/**
 * Template Management Screen Component
 * Allows administrators to manage receipt templates and assign them to organizations
 * 
 * Features:
 * - View all receipt templates
 * - Add new templates
 * - Edit template details
 * - Remove templates from organizations
 * - Assign templates to organizations
 * - Template status management
 */
const TemplateManagementScreen = () => {
  const { showSuccess, showError, showWarning } = useInlineNotification();
  const [templates, setTemplates] = useState(mockReceiptTemplates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filterOrg, setFilterOrg] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    organization: '',
    isActive: true,
    templateType: 'standard',
  });
  const [addTemplateErrorModal, setAddTemplateErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [templateToRemove, setTemplateToRemove] = useState(null);

  /**
   * Filters templates based on selected organization and status
   * @returns {Array} Filtered list of templates
   */
  const getFilteredTemplates = () => {
    return templates.filter(template => {
      const orgMatch = filterOrg === 'all' || template.organization === filterOrg;
      const statusMatch = filterStatus === 'all' || 
        (filterStatus === 'active' && template.isActive) ||
        (filterStatus === 'inactive' && !template.isActive);
      return orgMatch && statusMatch;
    });
  };

  /**
   * Handles adding a new template
   * Validates input and adds template to the list
   */
  const handleAddTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.organization.trim()) {
      setAddTemplateErrorModal(true);
      return;
    }

    const template = {
      id: `template_${Date.now()}`,
      ...newTemplate,
      createdAt: new Date().toISOString(),
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      description: '',
      organization: '',
      isActive: true,
      templateType: 'standard',
    });
    setShowAddModal(false);
    showSuccess('Template added successfully!', 'Success');
  };

  /**
   * Handles editing an existing template
   * Updates template information in the list
   */
  const handleEditTemplate = () => {
    if (!selectedTemplate) return;

    const updatedTemplates = templates.map(template =>
      template.id === selectedTemplate.id ? { ...template, ...selectedTemplate } : template
    );
    setTemplates(updatedTemplates);
    setShowEditModal(false);
    setSelectedTemplate(null);
    showSuccess('Template updated successfully!', 'Success');
  };

  /**
   * Handles removing a template from the system
   * Shows confirmation dialog before removal
   */
  const handleRemoveTemplate = (template) => {
    setTemplateToRemove(template);
    setShowConfirmModal(true);
  };

  /**
   * Confirms template removal
   */
  const confirmRemoveTemplate = () => {
    if (templateToRemove) {
      const updatedTemplates = templates.filter(t => t.id !== templateToRemove.id);
      setTemplates(updatedTemplates);
      showSuccess('Template removed successfully!', 'Success');
    }
    setShowConfirmModal(false);
    setTemplateToRemove(null);
  };

  /**
   * Cancels template removal
   */
  const cancelRemoveTemplate = () => {
    setShowConfirmModal(false);
    setTemplateToRemove(null);
  };

  /**
   * Opens the edit modal for a specific template
   * @param {Object} template - Template to edit
   */
  const openEditModal = (template) => {
    setSelectedTemplate({ ...template });
    setShowEditModal(true);
  };

  /**
   * Gets the template type display with color coding
   * @param {string} type - Template type
   * @returns {JSX.Element} Formatted type display
   */
  const getTypeDisplay = (type) => {
    const colors = {
      standard: '#10b981',
      custom: '#f59e0b',
      premium: '#ef4444',
    };
    
    return (
      <div style={{...styles.typeBadge, backgroundColor: colors[type] || '#6b7280'}}>
        <span style={styles.typeBadgeText}>{type}</span>
      </div>
    );
  };

  /**
   * Handles input changes for forms
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   * @param {Object} target - Target object to update (newTemplate or selectedTemplate)
   */
  const handleInputChange = (field, value, target = 'new') => {
    if (target === 'new') {
      setNewTemplate(prev => ({ ...prev, [field]: value }));
    } else {
      setSelectedTemplate(prev => ({ ...prev, [field]: value }));
    }
  };

  const filteredTemplates = getFilteredTemplates();

  /**
   * Add Template Modal Component
   */
  const AddTemplateModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Add New Template</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowAddModal(false)}
          >
            X
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Template Name *</label>
            <input
              type="text"
              style={styles.input}
              value={newTemplate.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={newTemplate.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter template description"
              rows="3"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Organization *</label>
            <select
              style={styles.select}
              value={newTemplate.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
            >
              <option value="">Select organization</option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Template Type</label>
            <select
              style={styles.select}
              value={newTemplate.templateType}
              onChange={(e) => handleInputChange('templateType', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isActive"
              checked={newTemplate.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" style={styles.checkboxLabel}>Active Template</label>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelButton}
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            style={styles.saveButton}
            onClick={handleAddTemplate}
          >
            Add Template
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Edit Template Modal Component
   */
  const EditTemplateModal = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Edit Template</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowEditModal(false)}
          >
            X
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Template Name *</label>
            <input
              type="text"
              style={styles.input}
              value={selectedTemplate?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value, 'edit')}
              placeholder="Enter template name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={selectedTemplate?.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value, 'edit')}
              placeholder="Enter template description"
              rows="3"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Organization *</label>
            <select
              style={styles.select}
              value={selectedTemplate?.organization || ''}
              onChange={(e) => handleInputChange('organization', e.target.value, 'edit')}
            >
              <option value="">Select organization</option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="editIsActive"
              checked={selectedTemplate?.isActive || false}
              onChange={(e) => handleInputChange('isActive', e.target.checked, 'edit')}
            />
            <label htmlFor="editIsActive" style={styles.checkboxLabel}>Active Template</label>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            style={styles.cancelButton}
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            style={styles.saveButton}
            onClick={handleEditTemplate}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Template Management" showBackButton={true}>
      <div className="innerContainer">
        <div style={styles.container}>
          <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Template Management</h2>
            <p style={styles.subtitle}>Manage receipt templates for all organizations</p>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <div style={styles.filters}>
              <select
                style={styles.filterSelect}
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
              >
                <option value="all">All Organizations</option>
                {mockOrganizations.map((org) => (
                  <option key={org.id} value={org.name}>
                    {org.name}
                  </option>
                ))}
              </select>

              <select
                style={styles.filterSelect}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <button
              style={styles.addButton}
              onClick={() => setShowAddModal(true)}
            >
              + Add Template
            </button>
          </div>

          {/* Templates List */}
          <div style={styles.templatesContainer}>
            <h3 style={styles.sectionTitle}>
              Templates ({filteredTemplates.length})
            </h3>
            
            {filteredTemplates.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No templates found</p>
                <p style={styles.emptyStateSubtext}>
                  {filterOrg !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Add your first template to get started'
                  }
                </p>
              </div>
            ) : (
              <div style={styles.templatesList}>
                {filteredTemplates.map((template) => (
                  <div key={template.id} style={styles.templateCard}>
                    <div style={styles.templateHeader}>
                      <div style={styles.templateInfo}>
                        <h4 style={styles.templateName}>{template.name}</h4>
                        <p style={styles.templateOrg}>{template.organization}</p>
                      </div>
                      <div style={styles.templateBadges}>
                        {getTypeDisplay('standard')}
                        <div style={{
                          ...styles.statusBadge, 
                          backgroundColor: template.isActive ? '#10b981' : '#ef4444'
                        }}>
                          <span style={styles.statusText}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.templateBody}>
                      <p style={styles.templateDescription}>
                        {template.description || 'No description provided'}
                      </p>
                      <p style={styles.templateDate}>
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={styles.templateActions}>
                      <button
                        style={styles.editButton}
                        onClick={() => openEditModal(template)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveTemplate(template)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Modals */}
        {showAddModal && <AddTemplateModal />}
        {showEditModal && <EditTemplateModal />}
        
        {/* Confirmation Modal for Template Removal */}
        {showConfirmModal && templateToRemove && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Confirm Template Removal</h3>
                <button 
                  style={styles.closeButton}
                  onClick={cancelRemoveTemplate}
                >
                  X
                </button>
              </div>
              
              <div style={styles.modalBody}>
                <div style={styles.confirmMessage}>
                  <p style={styles.confirmText}>
                    Are you sure you want to remove <strong>"{templateToRemove.name}"</strong>?
                  </p>
                  <p style={styles.confirmSubtext}>
                    This action cannot be undone. The template will be permanently removed from the system.
                  </p>
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                <button
                  style={styles.cancelButton}
                  onClick={cancelRemoveTemplate}
                >
                  Cancel
                </button>
                <button
                  style={styles.removeConfirmButton}
                  onClick={confirmRemoveTemplate}
                >
                  Remove Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal for Add Template Required Fields */}
        {addTemplateErrorModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff', borderRadius: 12, padding: '32px 24px', minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative'
            }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#1e3a8a', marginBottom: 12 }}>Missing Required Fields</div>
              <div style={{ color: '#555', marginBottom: 24 }}>Please fill in all required fields before adding a new template.</div>
              <button
                onClick={() => setAddTemplateErrorModal(false)}
                style={{
                  background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 500, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(211,47,47,0.08)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

/**
 * Styles for the TemplateManagementScreen component
 */
const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  
  filterSelect: {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  
  addButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  templatesContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '20px',
    margin: '0 0 20px 0',
  },
  
  templatesList: {
    display: 'grid',
    gap: '16px',
  },
  
  templateCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  
  templateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  
  templateInfo: {
    flex: 1,
  },
  
  templateName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  },
  
  templateOrg: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  
  templateBadges: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  
  typeBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  typeBadgeText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  templateBody: {
    marginBottom: '16px',
  },
  
  templateDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  },
  
  templateDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  
  templateActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  
  editButton: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  removeButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  
  emptyStateText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  
  modalBody: {
    padding: '20px',
  },
  
  inputGroup: {
    marginBottom: '20px',
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  
  input: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  
  textarea: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  
  select: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
  },
  
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  checkboxLabel: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  
  modalFooter: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    justifyContent: 'flex-end',
  },
  
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  
  saveButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Confirmation modal styles
  confirmMessage: {
    textAlign: 'center',
    padding: '20px 0',
  },

  confirmText: {
    fontSize: '16px',
    color: '#374151',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },

  confirmSubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  removeConfirmButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '10px',
  },
};

export default TemplateManagementScreen;