import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Layout from '../components/Layout';
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
const TemplateManagementScreen: React.FC = () => {
  const [templates, setTemplates] = useState(mockReceiptTemplates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [filterOrg, setFilterOrg] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    organization: '',
    isActive: true,
    templateType: 'standard',
  });

  /**
   * Filters templates based on selected organization and status
   * @returns Filtered list of templates
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
      Alert.alert('Error', 'Please fill in all required fields');
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
    Alert.alert('Success', 'Template added successfully!');
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
    Alert.alert('Success', 'Template updated successfully!');
  };

  /**
   * Handles removing a template from the system
   * Shows confirmation dialog before removal
   */
  const handleRemoveTemplate = (template: any) => {
    Alert.alert(
      'Remove Template',
      `Are you sure you want to remove "${template.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedTemplates = templates.filter(t => t.id !== template.id);
            setTemplates(updatedTemplates);
            Alert.alert('Success', 'Template removed successfully!');
          },
        },
      ]
    );
  };

  /**
   * Opens the edit modal for a specific template
   * @param template - Template to edit
   */
  const openEditModal = (template: any) => {
    setSelectedTemplate({ ...template });
    setShowEditModal(true);
  };

  /**
   * Gets the template type display with color coding
   * @param type - Template type
   * @returns Formatted type display
   */
  const getTypeDisplay = (type: string) => {
    const colors = {
      standard: '#10b981',
      custom: '#f59e0b',
      premium: '#ef4444',
    };
    
    return (
      <View style={[styles.typeBadge, { backgroundColor: colors[type as keyof typeof colors] }]}>
        <Text style={styles.typeBadgeText}>{type}</Text>
      </View>
    );
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <Layout title="Template Management" showBackButton={true}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>Add New Template</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Organization:</Text>
              <View style={styles.filterButtons}>
                {['all', ...mockOrganizations.map(org => org.name)].map(org => (
                  <TouchableOpacity
                    key={org}
                    style={[
                      styles.filterButton,
                      filterOrg === org && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterOrg(org)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterOrg === org && styles.filterButtonTextActive
                    ]}>
                      {org === 'all' ? 'All' : org}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter by Status:</Text>
              <View style={styles.filterButtons}>
                {['all', 'active', 'inactive'].map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      filterStatus === status && styles.filterButtonActive
                    ]}
                    onPress={() => setFilterStatus(status)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterStatus === status && styles.filterButtonTextActive
                    ]}>
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Templates List */}
          <View style={styles.templatesContainer}>
            <Text style={styles.sectionTitle}>
              Templates ({filteredTemplates.length})
            </Text>
            
            {filteredTemplates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => openEditModal(template)}
              >
                <View style={styles.templateInfo}>
                  <View style={styles.templateHeader}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    {getTypeDisplay(template.templateType)}
                  </View>
                  
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  <Text style={styles.templateOrg}>{template.organization}</Text>
                  
                  <View style={styles.templateStatus}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: template.isActive ? '#10b981' : '#ef4444' }
                    ]}>
                      <Text style={styles.statusText}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(template)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveTemplate(template)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
            {filteredTemplates.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No templates found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your filters or add a new template
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Template Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Template</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Template Name"
              value={newTemplate.name}
              onChangeText={(text) => setNewTemplate({...newTemplate, name: text})}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={newTemplate.description}
              onChangeText={(text) => setNewTemplate({...newTemplate, description: text})}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Organization:</Text>
              <View style={styles.modalSelect}>
                {mockOrganizations.map(org => (
                  <TouchableOpacity
                    key={org.name}
                    style={[
                      styles.selectOption,
                      newTemplate.organization === org.name && styles.selectOptionActive
                    ]}
                    onPress={() => setNewTemplate({...newTemplate, organization: org.name})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      newTemplate.organization === org.name && styles.selectOptionTextActive
                    ]}>
                      {org.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Template Type:</Text>
              <View style={styles.modalSelect}>
                {['standard', 'custom', 'premium'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.selectOption,
                      newTemplate.templateType === type && styles.selectOptionActive
                    ]}
                    onPress={() => setNewTemplate({...newTemplate, templateType: type})}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      newTemplate.templateType === type && styles.selectOptionTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalButtonSave}
                onPress={handleAddTemplate}
              >
                <Text style={styles.modalButtonTextSave}>Add Template</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Template</Text>
            
            {selectedTemplate && (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Template Name"
                  value={selectedTemplate.name}
                  onChangeText={(text) => setSelectedTemplate({...selectedTemplate, name: text})}
                />
                
                <TextInput
                  style={styles.modalInput}
                  placeholder="Description"
                  value={selectedTemplate.description}
                  onChangeText={(text) => setSelectedTemplate({...selectedTemplate, description: text})}
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Organization:</Text>
                  <View style={styles.modalSelect}>
                    {mockOrganizations.map(org => (
                      <TouchableOpacity
                        key={org.name}
                        style={[
                          styles.selectOption,
                          selectedTemplate.organization === org.name && styles.selectOptionActive
                        ]}
                        onPress={() => setSelectedTemplate({...selectedTemplate, organization: org.name})}
                      >
                        <Text style={[
                          styles.selectOptionText,
                          selectedTemplate.organization === org.name && styles.selectOptionTextActive
                        ]}>
                          {org.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Template Type:</Text>
                  <View style={styles.modalSelect}>
                    {['standard', 'custom', 'premium'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.selectOption,
                          selectedTemplate.templateType === type && styles.selectOptionActive
                        ]}
                        onPress={() => setSelectedTemplate({...selectedTemplate, templateType: type})}
                      >
                        <Text style={[
                          styles.selectOptionText,
                          selectedTemplate.templateType === type && styles.selectOptionTextActive
                        ]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusToggle,
                      { backgroundColor: selectedTemplate.isActive ? '#10b981' : '#ef4444' }
                    ]}
                    onPress={() => setSelectedTemplate({...selectedTemplate, isActive: !selectedTemplate.isActive})}
                  >
                    <Text style={styles.statusToggleText}>
                      {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonCancel}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalButtonSave}
                    onPress={handleEditTemplate}
                  >
                    <Text style={styles.modalButtonTextSave}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

/**
 * Styles for the TemplateManagementScreen component
 * Uses a clean, professional design with consistent spacing and colors
 */
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
  },
  
  // Content area
  content: {
    padding: 16,
  },
  
  // Header section
  header: {
    marginBottom: 20,
  },
  
  // Add button
  addButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Add button text
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Filters container
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Filter row
  filterRow: {
    marginBottom: 12,
  },
  
  // Filter label
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Filter buttons container
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Filter button
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active filter button
  filterButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Filter button text
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active filter button text
  filterButtonTextActive: {
    color: 'white',
  },
  
  // Templates container
  templatesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  
  // Template card
  templateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  
  // Template info
  templateInfo: {
    flex: 1,
  },
  
  // Template header
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // Template name
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  // Type badge
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Type badge text
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // Template description
  templateDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  
  // Template organization
  templateOrg: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  
  // Template status
  templateStatus: {
    marginTop: 4,
  },
  
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  // Status text
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  
  // Template actions
  templateActions: {
    flexDirection: 'row',
  },
  
  // Edit button
  editButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  
  // Edit button text
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Remove button
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  // Remove button text
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Empty state
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  
  // Empty state text
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  
  // Empty state subtitle
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal content
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  
  // Modal title
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Modal input
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  
  // Modal row
  modalRow: {
    marginBottom: 16,
  },
  
  // Modal label
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  // Modal select
  modalSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // Select option
  selectOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // Active select option
  selectOptionActive: {
    backgroundColor: '#1e3a8a',
  },
  
  // Select option text
  selectOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Active select option text
  selectOptionTextActive: {
    color: 'white',
  },
  
  // Status toggle
  statusToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  
  // Status toggle text
  statusToggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  // Modal button cancel
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  
  // Modal button save
  modalButtonSave: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  
  // Modal button text cancel
  modalButtonTextCancel: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Modal button text save
  modalButtonTextSave: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateManagementScreen;
