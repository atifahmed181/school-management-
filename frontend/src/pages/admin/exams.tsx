import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { examAPI, subjectAPI, classAPI } from '../../services/api';
import { Exam, Subject, Class } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ExamsPage: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    classId: '',
    examDate: '',
    startTime: '',
    endTime: '',
    totalMarks: '',
    passingMarks: '',
    examType: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, subjectsRes, classesRes] = await Promise.all([
        examAPI.getAll(),
        subjectAPI.getAll(),
        classAPI.getAll(),
      ]);
      setExams(examsRes.data);
      setSubjects(subjectsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const examData = {
        ...formData,
        subjectId: parseInt(formData.subjectId),
        classId: parseInt(formData.classId),
        totalMarks: parseInt(formData.totalMarks),
        passingMarks: parseInt(formData.passingMarks),
      };

      if (editingExam) {
        await examAPI.update(editingExam.id, examData);
      } else {
        await examAPI.create(examData);
      }

      setShowModal(false);
      setEditingExam(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      subjectId: exam.subjectId.toString(),
      classId: exam.classId.toString(),
      examDate: exam.examDate,
      startTime: exam.startTime,
      endTime: exam.endTime,
      totalMarks: exam.totalMarks.toString(),
      passingMarks: exam.passingMarks.toString(),
      examType: exam.examType,
      description: exam.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (exam: Exam) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await examAPI.delete(exam.id);
        fetchData();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subjectId: '',
      classId: '',
      examDate: '',
      startTime: '',
      endTime: '',
      totalMarks: '',
      passingMarks: '',
      examType: '',
      description: '',
    });
  };

  const columns = [
    { key: 'name', header: 'Exam Name' },
    { 
      key: 'subjectId', 
      header: 'Subject',
      render: (exam: Exam) => {
        const subject = subjects.find(s => s.id === exam.subjectId);
        return subject?.name || '-';
      }
    },
    { 
      key: 'classId', 
      header: 'Class',
      render: (exam: Exam) => {
        const classItem = classes.find(c => c.id === exam.classId);
        return classItem?.name || '-';
      }
    },
    { key: 'examDate', header: 'Date' },
    { key: 'startTime', header: 'Start Time' },
    { key: 'endTime', header: 'End Time' },
    { key: 'totalMarks', header: 'Total Marks' },
    { key: 'examType', header: 'Type' },
    {
      key: 'actions',
      header: 'Actions',
      render: (exam: Exam) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => router.push(`/admin/exams/${exam.id}/results`)}
          >
            Results
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(exam)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(exam)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const examTypeOptions = [
    { value: 'mid_term', label: 'Mid Term' },
    { value: 'final', label: 'Final' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'assignment', label: 'Assignment' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
        <Button onClick={() => setShowModal(true)}>
          Add New Exam
        </Button>
      </div>

      <Table
        data={exams}
        columns={columns}
        loading={loading}
        emptyMessage="No exams found"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExam(null);
          resetForm();
        }}
        title={editingExam ? 'Edit Exam' : 'Add New Exam'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Exam Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
              fullWidth
            />
            
            <Select
              label="Subject"
              options={subjects.map(s => ({ value: s.id, label: s.name }))}
              value={formData.subjectId}
              onChange={(value) => setFormData({ ...formData, subjectId: value })}
              placeholder="Select subject"
              required
              fullWidth
            />

            <Select
              label="Class"
              options={classes.map(c => ({ value: c.id, label: c.name }))}
              value={formData.classId}
              onChange={(value) => setFormData({ ...formData, classId: value })}
              placeholder="Select class"
              required
              fullWidth
            />

            <Input
              label="Exam Date"
              type="date"
              value={formData.examDate}
              onChange={(value) => setFormData({ ...formData, examDate: value })}
              required
              fullWidth
            />

            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(value) => setFormData({ ...formData, startTime: value })}
              required
              fullWidth
            />

            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(value) => setFormData({ ...formData, endTime: value })}
              required
              fullWidth
            />

            <Input
              label="Total Marks"
              type="number"
              value={formData.totalMarks}
              onChange={(value) => setFormData({ ...formData, totalMarks: value })}
              required
              fullWidth
            />

            <Input
              label="Passing Marks"
              type="number"
              value={formData.passingMarks}
              onChange={(value) => setFormData({ ...formData, passingMarks: value })}
              required
              fullWidth
            />

            <Select
              label="Exam Type"
              options={examTypeOptions}
              value={formData.examType}
              onChange={(value) => setFormData({ ...formData, examType: value })}
              placeholder="Select exam type"
              required
              fullWidth
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            fullWidth
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingExam(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingExam ? 'Update Exam' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamsPage; 