// Fully updated SuperAdminEditor.js with all 4 sections
import React, { useEffect, useState } from 'react';
import './SuperAdminEditor.css';

function SuperAdminEditor() {
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState('');

    const [schools, setSchools] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [selectedTopicsForSchool, setSelectedTopicsForSchool] = useState([]);
    const [assignMessage, setAssignMessage] = useState('');

    const [newSchoolName, setNewSchoolName] = useState('');
    const [newSchoolLogo, setNewSchoolLogo] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [excelFile, setExcelFile] = useState(null);

    const [schoolCreationMsg, setSchoolCreationMsg] = useState('');
    const [curriculumAssignMsg, setCurriculumAssignMsg] = useState('');
    const [studentUploadMsg, setStudentUploadMsg] = useState('');
    const [sectionAssignMsg, setSectionAssignMsg] = useState('');

    const [selectedSectionClass, setSelectedSectionClass] = useState('');
    const [selectedSectionLetters, setSelectedSectionLetters] = useState([]);

    useEffect(() => {
        fetch('https://clarytix-backend.onrender.com/superadmin/all-topics')
            .then(res => res.json())
            .then(data => { if (data.success) setTopics(data.topics); });

        fetch('https://clarytix-backend.onrender.com/superadmin/all-schools')
            .then(res => res.json())
            .then(data => { if (data.success) setSchools(data.schools); });

        fetch('https://clarytix-backend.onrender.com/superadmin/subjects')
            .then(res => res.json())
            .then(data => setAllSubjects(data));
    }, []);

     useEffect(() => {
        if (selectedTopicId) {
            fetch(`https://clarytix-backend.onrender.com/superadmin/questions?topicId=${selectedTopicId}`)
                .then(res => res.json())
                .then(data => { if (data.success) setQuestions(data.questions); });
        }
    }, [selectedTopicId]);

    const handleChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleUpdate = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/update-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions })
        });
        const data = await res.json();
        setMessage(data.success ? 'Questions updated successfully!' : 'Update failed.');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleTopicCheckbox = (topicId) => {
        setSelectedTopicsForSchool(prev =>
            prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
        );
    };

    const handleAssignTopicsToSchool = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-topics-to-school', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                topicIds: selectedTopicsForSchool.map(Number)
            })
        });
        const data = await res.json();
        setAssignMessage(data.success ? 'Topics assigned successfully!' : 'Assignment failed.');
        setTimeout(() => setAssignMessage(''), 3000);
    };

    const handleSchoolCreation = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-school', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newSchoolName, logo_url: newSchoolLogo })
        });
        const data = await res.json();
        setSchoolCreationMsg(data.success ? 'School created successfully!' : 'School creation failed.');
        if (data.success) {
            setNewSchoolName('');
            setNewSchoolLogo('');
        }
        setTimeout(() => setSchoolCreationMsg(''), 3000);
    };

    const handleAssignCurriculum = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/assign-curriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                classList: [selectedClass],
                subjectIds: selectedSubjects.map(Number)
            })
        });
        const data = await res.json();
        setCurriculumAssignMsg(data.success ? 'Curriculum assigned successfully!' : 'Assignment failed.');
        if (data.success) {
            setSelectedClass('');
            setSelectedSubjects([]);
        }
        setTimeout(() => setCurriculumAssignMsg(''), 3000);
    };

    const handleExcelUpload = async () => {
        const formData = new FormData();
        formData.append('file', excelFile);
        formData.append('schoolId', selectedSchoolId);

        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/upload-students', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        setStudentUploadMsg(data.success ? 'Students uploaded successfully!' : 'Student upload failed.');
        if (data.success) setExcelFile(null);
        setTimeout(() => setStudentUploadMsg(''), 3000);
    };


    const handleSectionAssignment = async () => {
        const res = await fetch('https://clarytix-backend.onrender.com/superadmin/create-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                schoolId: Number(selectedSchoolId),
                className: selectedSectionClass,
                sectionNames: selectedSectionLetters
            })
        });
        const data = await res.json();
        setSectionAssignMsg(data.success ? 'Sections created successfully!' : 'Section creation failed.');
        if (data.success) {
            setSelectedSectionClass('');
            setSelectedSectionLetters([]);
        }
        setTimeout(() => setSectionAssignMsg(''), 3000);
    };

    return (
        <div className="SuperAdminEditor-container">
            {/* Section 1: School Creation */}
            <div className="sc-onboarding-section">
                <h2>Create School</h2>
                <input placeholder="School Name" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} />
                <input placeholder="School Logo URL" value={newSchoolLogo} onChange={e => setNewSchoolLogo(e.target.value)} />
                <button onClick={() => {
                    fetch('https://clarytix-backend.onrender.com/superadmin/create-school', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newSchoolName, logo_url: newSchoolLogo })
                    })
                        .then(res => res.json())
                        .then(data => {
                            setSchoolCreationMsg(data.success ? 'School created successfully!' : 'School creation failed.');
                            if (data.success) {
                                setNewSchoolName('');
                                setNewSchoolLogo('');
                            }
                            setTimeout(() => setSchoolCreationMsg(''), 3000);
                        });
                }}>Create School</button>
                {schoolCreationMsg && <div className="SuperAdminEditor-message">{schoolCreationMsg}</div>}
            </div>

            {/* Section 2: Assign Curriculum */}
            <div className="sc-onboarding-section">
                <h2>Assign Curriculum</h2>
                <label>Select School:</label>
                <select value={selectedSchoolId} onChange={e => setSelectedSchoolId(e.target.value)}>
                    <option value="">Select School</option>
                    {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>

                <label>Select Class:</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {Array.from({ length: 8 }, (_, i) => `Class ${i + 5}`).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <label>Select Subjects:</label>
                <select multiple value={selectedSubjects} onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setSelectedSubjects(selected);
                }}>
                    {allSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>

                <button onClick={() => {
                    fetch('https://clarytix-backend.onrender.com/superadmin/assign-curriculum', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            schoolId: Number(selectedSchoolId),
                            classList: [selectedClass],
                            subjectIds: selectedSubjects.map(Number)
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            setCurriculumAssignMsg(data.success ? 'Curriculum assigned successfully!' : 'Assignment failed.');
                            if (data.success) {
                                setSelectedClass('');
                                setSelectedSubjects([]);
                            }
                            setTimeout(() => setCurriculumAssignMsg(''), 3000);
                        });
                }}>Assign Subjects</button>
                {curriculumAssignMsg && <div className="SuperAdminEditor-message">{curriculumAssignMsg}</div>}
            </div>

            {/* Section 3: Section Creation */}
            <div className="sc-section-creator">
                <h2>Create Sections for Class</h2>
                <label>Select School:</label>
                <select value={selectedSchoolId} onChange={e => setSelectedSchoolId(e.target.value)}>
                    <option value="">Select School</option>
                    {schools.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>

                <label>Select Class:</label>
                <select value={selectedSectionClass} onChange={e => setSelectedSectionClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {Array.from({ length: 8 }, (_, i) => `Class ${i + 5}`).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <label>Select Sections (A–J):</label>
                <select multiple value={selectedSectionLetters} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSelectedSectionLetters(selected);
                }}>
                    {['A','B','C','D','E','F','G','H','I','J'].map(letter => (
                        <option key={letter} value={letter}>{letter}</option>
                    ))}
                </select>

                <button onClick={handleSectionAssignment}>Create Sections</button>
                {sectionAssignMsg && <div className="SuperAdminEditor-message">{sectionAssignMsg}</div>}
            </div>

            {/* Section 4: Upload Student Excel */}
            <div className="sc-onboarding-section">
                <h2>Upload Student Data (Excel)</h2>
                <input type="file" accept=".xlsx, .csv" onChange={e => setExcelFile(e.target.files[0])} />
                <button onClick={() => {
                    const formData = new FormData();
                    formData.append('file', excelFile);
                    formData.append('schoolId', selectedSchoolId);

                    fetch('https://clarytix-backend.onrender.com/superadmin/upload-students', {
                        method: 'POST',
                        body: formData
                    })
                        .then(res => res.json())
                        .then(data => {
                            setStudentUploadMsg(data.success ? 'Students uploaded successfully!' : 'Student upload failed.');
                            if (data.success) setExcelFile(null);
                            setTimeout(() => setStudentUploadMsg(''), 3000);
                        });
                }}>Upload Students</button>
                {studentUploadMsg && <div className="SuperAdminEditor-message">{studentUploadMsg}</div>}
            </div>
        </div>
    );
}

export default SuperAdminEditor;
