import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';

const TemplateManagementScreen = () => {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Standard Receipt',
      description: 'Basic receipt template for general use',
      isActive: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Professional Receipt',
      description: 'Formal receipt template for business transactions',
      isActive: true,
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'Simple Receipt',
      description: 'Minimal receipt template for quick transactions',
      isActive: false,
      createdAt: '2024-01-03',
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
  });

  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (templates.find(t => t.name === newTemplate.name)) {
      Alert.alert('Error', 'Template name already exists');
      return;
    }

    const templateToAdd = {
      ...newTemplate,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setTemplates([...templates, templateToAdd]);
    setNewTemplate({
      name: '',
      description: '',
    });
    setIsAddingTemplate(false);

    Alert.alert('Success', 'Template added successfully');
  };

  const handleEditTemplate = (templateId: string) => {
    const templateToEdit = templates.find(t => t.id === templateId);
    if (templateToEdit) {
      Alert.alert(
        'Edit Template',
        `Edit template: ${templateToEdit.name}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Edit',
            onPress: () => {
              Alert.alert('Edit Template', 'Edit functionality would be implemented here');
            },
          },
        ]
      );
    }
  };

  const handleRemoveTemplate = (templateId: string) => {
    const templateToRemove = templates.find(t => t.id === templateId);
    if (templateToRemove) {
      Alert.alert(
        'Remove Template',
        `Are you sure you want to remove ${templateToRemove.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              setTemplates(templates.filter(t => t.id !== templateId));
              Alert.alert('Success', 'Template removed successfully');
            },
          },
        ]
      );
    }
  };

  const handleToggleTemplateStatus = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Template Management</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Receipt Templates</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingTemplate(!isAddingTemplate)}
            >
              <Text style={styles.addButtonText}>
                {isAddingTemplate ? 'Cancel' : 'Add Template'}
              </Text>
            </TouchableOpacity>
          </View>

          {isAddingTemplate && (
            <View style={styles.addTemplateForm}>
              <TextInput
                style={styles.input}
                placeholder="Template Name"
                value={newTemplate.name}
                onChangeText={(text) => setNewTemplate({ ...newTemplate, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={newTemplate.description}
                onChangeText={(text) => setNewTemplate({ ...newTemplate, description: text })}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAddTemplate}>
                <Text style={styles.submitButtonText}>Add Template</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.templatesList}>
            {templates.map((template) => (
              <View key={template.id} style={styles.templateCard}>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>{template.description}</Text>
                  <View style={styles.templateDetails}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: template.isActive ? '#10b981' : '#6b7280' }
                    ]}>
                      <Text style={styles.statusText}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                    <Text style={styles.templateDate}>{template.createdAt}</Text>
                  </View>
                </View>
                
                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: template.isActive ? '#10b981' : '#6b7280' }]}
                    onPress={() => handleToggleTemplateStatus(template.id)}
                  >
                    <Text style={styles.statusButtonText}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTemplate(template.id)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveTemplate(template.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addTemplateForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  templatesList: {
    gap: 15,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateInfo: {
    marginBottom: 15,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  templateDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  templateDate: {
    fontSize: 12,
    color: '#999',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TemplateManagementScreen;
