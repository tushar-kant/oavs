import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import FilterDropdown from './FilterDropdown';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import Loading from './Loading';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [classes, setClasses] = useState([]);

  // Drill-down states
  const [clickedSubject, setClickedSubject] = useState(null);
  const [clickedExam, setClickedExam] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/results/exam-score-board');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
        setSessions([...new Set(result.map(item => item.session_name))]);
        setDistricts([...new Set(result.map(item => item.district))]);
        setInstitutes([...new Set(result.map(item => item.institute_name))]);
        setClasses([...new Set(result.map(item => item.class_name))]);

        // Set default selections to include all
        setSelectedSession([...new Set(result.map(item => item.session_name))]);
        setSelectedDistrict([...new Set(result.map(item => item.district))]);
        setSelectedInstitute([...new Set(result.map(item => item.institute_name))]);
        setSelectedClass([...new Set(result.map(item => item.class_name))]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => (
    (selectedSession.length ? selectedSession.includes(item.session_name) : true) &&
    (selectedDistrict.length ? selectedDistrict.includes(item.district) : true) &&
    (selectedInstitute.length ? selectedInstitute.includes(item.institute_name) : true) &&
    (selectedClass.length ? selectedClass.includes(item.class_name) : true)
  ));

  // Filter the data based on clicked subject or exam
  const drillDownFilteredData = filteredData.filter(item => {
    return (
      (!clickedSubject || item.subject_name === clickedSubject) &&
      (!clickedExam || item.exam_name === clickedExam)
    );
  });
  const calculateAverage = (data, key) => {
    const groupedData = {};
    data.forEach(item => {
      if (!groupedData[item[key]]) {
        groupedData[item[key]] = { total: 0, count: 0 };
      }
      groupedData[item[key]].total += item.score;
      groupedData[item[key]].count += 1;
    });
    return Object.keys(groupedData).map(group => ({
      [key]: group,
      score: groupedData[group].total / groupedData[group].count,
    }));
  };

  const averagedSubjectScores = calculateAverage(drillDownFilteredData, 'subject_name');
  const averagedExamScores = calculateAverage(drillDownFilteredData, 'exam_name');

  const subjectChartData = {
    labels: averagedSubjectScores.map(item => item.subject_name),
    datasets: [
      {
        label: 'Average Score',
        data: averagedSubjectScores.map(item => item.score),
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
      },
    ],
  };

  const examChartData = {
    labels: averagedExamScores.map(item => item.exam_name),
    datasets: [
      {
        label: 'Average Score',
        data: averagedExamScores.map(item => item.score),
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures charts are not constrained by aspect ratio
    scales: {
      y: { beginAtZero: true },
    },
  };
  const handleSubjectClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = subjectChartData.labels[clickedIndex];
      setClickedSubject(clickedLabel);
      setClickedExam(null); // Reset clicked exam when subject is clicked
    }
  };

  const handleExamClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = examChartData.labels[clickedIndex];
      setClickedExam(clickedLabel);
      setClickedSubject(null); // Reset clicked subject when exam is clicked
    }
  };

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container border">
      <Header />
      <div className="row">
        <div className="col-8">
          <h1 className="m-4">OAVS(Session wise Score)</h1>
        </div>
        <div className="col-4 text-center pt-4">
          <h4 className="text-left mb-0">Total Records: {drillDownFilteredData.length}</h4>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-end mb-4">

          <FilterDropdown
            title="Select Session"
            options={sessions}
            selectedOptions={selectedSession}
            onOptionChange={setSelectedSession}
          />
       
          <FilterDropdown
            title="Select District"
            options={districts}
            selectedOptions={selectedDistrict}
            onOptionChange={setSelectedDistrict}
          />
       
          <FilterDropdown
            title="Select Institute"
            options={institutes}
            selectedOptions={selectedInstitute}
            onOptionChange={setSelectedInstitute}
          />
       
          <FilterDropdown
            title="Select Class"
            options={classes}
            selectedOptions={selectedClass}
            onOptionChange={setSelectedClass}
          />
      </div>

      <Card className="mb-4">
        <CardHeader style={{ backgroundColor: '#567854', color: 'white' }}>
          <CardTitle tag="h4">Average Subject Scores</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ overflowX: 'auto', height: '300px' }}> {/* Adjust height */}
            <Bar data={subjectChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Ensures charts are not constrained by aspect ratio
                scales: {
                  y: { beginAtZero: true },
                },
                plugins: {
                  datalabels: {
                    anchor: 'end',
                    align: 'start',
                    color: 'black',
                    formatter: (value) => {
                      // Check if value is a number and not undefined
                      if (typeof value === 'number') {
                        return `${value.toFixed(2)}%`; // Show value as percentage
                      }
                      return ''; // Return an empty string or handle undefined values
                    },
                    rotation: 90, // Rotate the label to make it vertical

                  },
                },
                onClick: (event, elements) => handleSubjectClick(event, elements),

              }}
              height={200} /> {/* Set chart height */}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader style={{ backgroundColor: '#336114', color: 'white' }}>
          <CardTitle tag="h4">Average Exam Scores</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ overflowX: 'auto', height: '300px' }}> {/* Adjust height */}
            <Bar data={examChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Ensures charts are not constrained by aspect ratio
                scales: {
                  y: { beginAtZero: true },

                },
                plugins: {
                  datalabels: {
                    anchor: 'end',
                    align: 'start',
                    color: 'black',
                    formatter: (value) => {
                      // Check if value is a number and not undefined
                      if (typeof value === 'number') {
                        return `${value.toFixed(2)}%`; // Show value as percentage
                      }
                      return ''; // Return an empty string or handle undefined values
                    },
                    rotation: 90, // Rotate the label to make it vertical

                  },
                },
               
                onClick: (event, elements) => handleExamClick(event, elements),

              }}
              height={200} /> {/* Set chart height */}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ResultAnalysis;