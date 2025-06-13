import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSubjectForStudent, setSelectedSubjectForStudent] = useState('');
    const [studentSubjects, setStudentSubjects] = useState([]);

    const schoolId = localStorage.getItem('schoolId');
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const navigate = useNavigate();

    // Fetch subjects when class is selected (topic wise)
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSubjects(data.subjects);
                    else setSubjects([]);
                    setSelectedSubject('');
                    setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, schoolId]);

    // Fetch topics when subject is selected (topic wise)
    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/admin/topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setTopics(data.topics);
                    else setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass, selectedSubject, schoolId]);

    // Fetch students when class is selected (student wise)
    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/admin/students?schoolId=${schoolId}&class=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setStudents(data.students);
                    else setStudents([]);
                    setSelectedStudentId('');
                    setSelectedSubjectForStudent('');
                    setStudentSubjects([]);
                });
        }
    }, [selectedClass]);

    // Fetch subjects for student-wise view
    useEffect(() => {
        if (selectedClass && selectedStudentId) {
            fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}&className=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setStudentSubjects(data.subjects);
                    else setStudentSubjects([]);
                });
        }
    }, [selectedClass, selectedStudentId]);

    const handleTrackTopicWise = () => {
        navigate(`/admin/performance/${selectedTopicId}`);
    };

    const handleTrackStudentWise = () => {
        navigate(`/admin/student-performance/${selectedStudentId}/${selectedSubjectForStudent}`);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-full" />

                <div className="card">
                    <h3 className="card-title">Track Performance Topic Wise</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
                            <option value="">Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedTopicId} onChange={e => setSelectedTopicId(e.target.value)} disabled={!selectedSubject}>
                            <option value="">Topic</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>

                        <button className="track-btn" disabled={!selectedTopicId} onClick={handleTrackTopicWise}>Track Performance</button>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Track Performance Student Wise</h3>
                    <div className="dropdown-row">
                        <select className="dropdown" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {Array.from({ length: 8 }, (_, i) => (
                                <option key={i + 5} value={`Class ${i + 5}`}>Class {i + 5}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} disabled={!selectedClass}>
                            <option value="">Student</option>
                            {students.map(stu => (
                                <option key={stu.user_id} value={stu.user_id}>{stu.username}</option>
                            ))}
                        </select>

                        <select className="dropdown" value={selectedSubjectForStudent} onChange={e => setSelectedSubjectForStudent(e.target.value)} disabled={!selectedStudentId}>
                            <option value="">Subject</option>
                            {studentSubjects.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>

                        <button className="track-btn" disabled={!selectedSubjectForStudent} onClick={handleTrackStudentWise}>Track Performance</button>
                    </div>
                </div>

                <div className="logout-container">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
