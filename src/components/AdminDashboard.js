import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import LogoutButton from './LogoutButton';

function AdminDashboard() {
    const navigate = useNavigate();
    const schoolLogo = localStorage.getItem('schoolLogoUrl');
    const schoolId = localStorage.getItem('schoolId');

    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    useEffect(() => {
        const fetchSubjects = async () => {
            const response = await fetch(`https://clarytix-backend.onrender.com/admin/subjects?schoolId=${schoolId}`);
            const data = await response.json();
            if (data.success) {
                setSubjects(data.subjects);
            }
        };
        fetchSubjects();
    }, [schoolId]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (selectedClass && selectedSubjectId) {
                const response = await fetch(`https://clarytix-backend.onrender.com/admin/topics?schoolId=${schoolId}&className=${selectedClass}&subjectId=${selectedSubjectId}`);
                const data = await response.json();
                if (data.success) {
                    setTopics(data.topics);
                }
            } else {
                setTopics([]);
            }
        };
        fetchTopics();
    }, [selectedClass, selectedSubjectId, schoolId]);

    const handleTrackClick = () => {
        if (selectedTopicId) {
            navigate(`/admin/performance/${selectedTopicId}`);
        }
    };

    const isDisabled = !(selectedClass && selectedSubjectId && selectedTopicId);

    return (
        <div className="admin-dashboard-container">
            <img src={schoolLogo} alt="School Logo" className="school-logo-full" />
            <h2 className="admin-welcome">Welcome Admin</h2>

            <section className="performance-section">
                <h3 className="section-header">Track Performance Topic Wise</h3>

                <div className="filters-row">
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="dropdown">
                        <option value="">Class</option>
                        {Array.from({ length: 8 }, (_, i) => {
                            const className = `Class ${i + 5}`;
                            return <option key={className} value={className}>{className}</option>;
                        })}
                    </select>

                    <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="dropdown">
                        <option value="">Subject</option>
                        {subjects.map((subj) => (
                            <option key={subj.id} value={subj.id}>{subj.name}</option>
                        ))}
                    </select>

                    <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} className="dropdown">
                        <option value="">Select Topic</option>
                        {topics.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>

                    <button
                        className="track-btn"
                        onClick={handleTrackClick}
                        disabled={isDisabled}
                    >
                        Track Performance
                    </button>
                </div>
            </section>

            <div className="logout-container">
                <LogoutButton />
            </div>
        </div>
    );
}

export default AdminDashboard;
