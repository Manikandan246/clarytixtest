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
    const navigate = useNavigate();

    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = localStorage.getItem('schoolId');

    useEffect(() => {
        if (selectedClass) {
            fetch(`https://clarytix-backend.onrender.com/school-subjects?schoolId=${schoolId}&class=${selectedClass}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setSubjects(data.subjects);
                    else setSubjects([]);
                    setSelectedSubject('');
                    setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSubject) {
            fetch(`https://clarytix-backend.onrender.com/school-topics?schoolId=${schoolId}&class=${selectedClass}&subject=${selectedSubject}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setTopics(data.topics);
                    else setTopics([]);
                    setSelectedTopicId('');
                });
        }
    }, [selectedSubject]);

    const handleTrack = () => {
        navigate(`/admin/performance/${selectedTopicId}`);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-dashboard-container">
                <img src={schoolLogo} alt="School Logo" className="school-logo-full" />
                <h2 className="admin-welcome">Welcome Admin</h2>

                <div className="card">
                    <h3>Track Performance Topic Wise</h3>
                    <div className="dropdown-row">
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                            <option value="">Class</option>
                            {['Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'].map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>

                        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!subjects.length}>
                            <option value="">Subject</option>
                            {subjects.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>

                        <select value={selectedTopicId} onChange={e => setSelectedTopicId(e.target.value)} disabled={!topics.length}>
                            <option value="">Select Topic</option>
                            {topics.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                            ))}
                        </select>

                        <button
                            className="track-btn"
                            onClick={handleTrack}
                            disabled={!selectedClass || !selectedSubject || !selectedTopicId}
                        >
                            Track Performance
                        </button>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '30px' }}>
                    <h3>Track Performance Student Wise</h3>
                    <p>Coming soon...</p>
                </div>

                <div className="logout-container">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
