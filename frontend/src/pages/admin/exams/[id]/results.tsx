import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { examAPI, studentAPI } from '@/services/api';
import { Exam, ExamResult, Student } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const ExamResultsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const examId = parseInt(id as string);

  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    obtainedMarks: '',
    grade: '',
    remarks: '',
  });

  useEffect(() => {
    if (examId) {
      fetchData();
    }
  }, [examId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examRes, resultsRes, studentsRes] = await Promise.all([
        examAPI.getById(examId),
        examAPI.getResults(examId),
        studentAPI.getAll(),
      ]);
      setExam(examRes.data);
      setResults(resultsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultData = {
        ...formData,
        studentId: parseInt(formData.studentId),
        obtainedMarks: parseInt(formData.obtainedMarks),
      };

      if (editingResult) {
        // Update existing result
        await examAPI.update(examId, resultData);
      } else {
        // Add new result
        await examAPI.addResult(examId, resultData);
      }

      setShowModal(false);
      setEditingResult(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleEdit = (result: ExamResult) => {
    setEditingResult(result);
    setFormData({
      studentId: result.studentId.toString(),
      obtainedMarks: result.obtainedMarks.toString(),
      grade: result.grade || '',
      remarks: result.remarks || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (result: ExamResult) => {
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        // Note: You might need to add a delete endpoint for results
        // await examAPI.deleteResult(examId, result.id);
        fetchData();
      } catch (error) {
        console.error('Error deleting result:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      obtainedMarks: '',
      grade: '',
      remarks: '',
    });
  };

  const getGrade = (obtainedMarks: number, totalMarks: number) => {
    const percentage = (obtainedMarks / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const columns = [
    { 
      key: 'studentId', 
      header: 'Student',
      render: (result: ExamResult) => {
        const student = students.find(s => s.id === result.studentId);
        return student ? `${student.firstName} ${student.lastName}` : '-';
      }
    },
    { key: 'obtainedMarks', header: 'Obtained Marks' },
    { 
      key: 'grade', 
      header: 'Grade',
      render: (result: ExamResult) => {
        const grade = result.grade || getGrade(result.obtainedMarks, exam?.totalMarks || 100);
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-800' :
            grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-800' :
            grade === 'C+' || grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {grade}
          </span>
        );
      }
    },
    { key: 'remarks', header: 'Remarks' },
    {
      key: 'actions',
      header: 'Actions',
      render: (result: ExamResult) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(result)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(result)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.back()} className="mb-4">
          ← Back to Exams
        </Button>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Date:</span> {new Date(exam.examDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Time:</span> {exam.startTime} - {exam.endTime}
            </div>
            <div>
              <span className="font-medium">Total Marks:</span> {exam.totalMarks}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
        <Button onClick={() => setShowModal(true)}>
          Add Result
        </Button>
      </div>

      <Table
        data={results}
        columns={columns}
        loading={loading}
        emptyMessage="No results found for this exam"
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingResult(null);
          resetForm();
        }}
        title={editingResult ? 'Edit Result' : 'Add Result'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Student"
            options={students.map(s => ({ 
              value: s.id, 
              label: `${s.firstName} ${s.lastName} (${s.studentId})` 
            }))}
            value={formData.studentId}
            onChange={(value) => setFormData({ ...formData, studentId: value })}
            placeholder="Select student"
            required
            fullWidth
          />

          <Input
            label="Obtained Marks"
            type="number"
            value={formData.obtainedMarks}
            onChange={(value) => setFormData({ ...formData, obtainedMarks: value })}
            required
            fullWidth
          />

          <Input
            label="Grade"
            value={formData.grade}
            onChange={(value) => setFormData({ ...formData, grade: value })}
            placeholder="Auto-calculated if left empty"
            fullWidth
          />

          <Input
            label="Remarks"
            value={formData.remarks}
            onChange={(value) => setFormData({ ...formData, remarks: value })}
            fullWidth
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingResult(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResult ? 'Update Result' : 'Add Result'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamResultsPage; 