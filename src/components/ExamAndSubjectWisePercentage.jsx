import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import FilterDropdown from './FilterDropdown';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import Loading from './Loading'; // Import the Loading component
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ChartDataLabels);

const ExamAndSubjectWisePercentage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [sessionNames, setSessionNames] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [vidyalayaNames, setVidyalayaNames] = useState([]);
  const [classNames, setClassNames] = useState([]);

  const [selectedSession, setSelectedSession] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedVidyalaya, setSelectedVidyalaya] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);

  // Drill-down states
  const [clickedSubject, setClickedSubject] = useState(null);
  const [clickedExam, setClickedExam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/results/appeared-pass');
        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        setData(result);

        // Extract unique values for filters
        setSessionNames([...new Set(result.map(item => item.session_name).filter(Boolean))]);
        setDistricts([...new Set(result.map(item => item.district).filter(Boolean))]);
        setVidyalayaNames([...new Set(result.map(item => item.vidyalaya_name).filter(Boolean))]);
        setClassNames([...new Set(result.map(item => item.class_name).filter(Boolean))]);

        // Set all filter values as selected initially
        setSelectedSession([...new Set(result.map(item => item.session_name).filter(Boolean))]);
        setSelectedDistrict([...new Set(result.map(item => item.district).filter(Boolean))]);
        setSelectedVidyalaya([...new Set(result.map(item => item.vidyalaya_name).filter(Boolean))]);
        setSelectedClass([...new Set(result.map(item => item.class_name).filter(Boolean))]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    return (
      (!selectedSession.length || selectedSession.includes(item.session_name)) &&
      (!selectedDistrict.length || selectedDistrict.includes(item.district)) &&
      (!selectedVidyalaya.length || selectedVidyalaya.includes(item.vidyalaya_name)) &&
      (!selectedClass.length || selectedClass.includes(item.class_name))
    );
  });

  // Filter the data based on clicked subject or exam
  const drillDownFilteredData = filteredData.filter(item => {
    return (
      (!clickedSubject || item.subject_name === clickedSubject) &&
      (!clickedExam || item.exam_name === clickedExam)
    );
  });

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p className="text-danger text-center">Error: {error}</p>;

  // Helper function to calculate averages for duplicate values
  const calculateAverage = (data, key) => {
    const groupedData = {};
    data.forEach(item => {
      if (!groupedData[item[key]]) {
        groupedData[item[key]] = { total: 0, count: 0 };
      }
      groupedData[item[key]].total += item.pass_percent;
      groupedData[item[key]].count += 1;
    });
    return Object.keys(groupedData).map(group => ({
      [key]: group,
      pass_percent: groupedData[group].total / groupedData[group].count,
    }));
  };

  const averagedSubjectData = calculateAverage(drillDownFilteredData, 'subject_name');
  const averagedExamData = calculateAverage(drillDownFilteredData, 'exam_name');

  const subjectChartData = {
    labels: averagedSubjectData.map(item => item.subject_name),
    datasets: [
      {
        label: 'Pass Percentage',
        data: averagedSubjectData.map(item => item.pass_percent),
        backgroundColor: "orange", // Random color
      },
    ],
  };

  const examChartData = {
    labels: averagedExamData.map(item => item.exam_name),
    datasets: [
      {
        label: 'Pass Percentage',
        data: averagedExamData.map(item => item.pass_percent),
        backgroundColor: 'pink', // Random color
      },
    ],
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

  return (
    <div className="container border">
      <Header />

      <div className="row">
        <div className="col-8">
          <h1 className="my-4">OAVS (exam and subject wise pass %)</h1>
        </div>
        <div className="col-4 text-center pt-4">
          <h4 className="text-left mb-0">Total Records: {drillDownFilteredData.length}</h4>
        </div>
      </div>
      <hr />

      <div className="d-flex justify-content-end mb-4">
        <FilterDropdown
          title="Select Session"
          options={sessionNames}
          selectedOptions={selectedSession}
          onOptionChange={setSelectedSession}
        />
        <FilterDropdown
          title="Select District"
          options={districts}
          selectedOptions={selectedDistrict}
          onOptionChange={setSelectedDistrict}
          className="ms-3"
        />
        <FilterDropdown
          title="Select Vidyalaya"
          options={vidyalayaNames}
          selectedOptions={selectedVidyalaya}
          onOptionChange={setSelectedVidyalaya}
          className="ms-3"
        />
        <FilterDropdown
          title="Select Class"
          options={classNames}
          selectedOptions={selectedClass}
          onOptionChange={setSelectedClass}
          className="ms-3"
        />
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <CardHeader style={{ backgroundColor: '#335554', color: 'white' }}>
              Subject Wise Pass Percentage
            </CardHeader>
            <CardBody>
              <CardTitle tag="h5" className="text-center">Pass Percentage</CardTitle>
              <Bar
                data={subjectChartData}
                options={{
                  responsive: true,
                  indexAxis: 'y',
                  scales: { x: { beginAtZero: true } },
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

                    },
                  },
                 
                  onClick: (event, elements) => handleSubjectClick(event, elements),
                }}
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <CardHeader style={{ backgroundColor: '#556654', color: 'white' }}>
              Exam Wise Pass Percentage
            </CardHeader>
            <CardBody>
              <CardTitle tag="h5" className="text-center">Pass Percentage</CardTitle>
              <Bar
                data={examChartData}
                options={{
                  responsive: true,
                  indexAxis: 'y',
                  scales: { x: { beginAtZero: true } },
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

                    },
                  },
                
                  onClick: (event, elements) => handleExamClick(event, elements),
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExamAndSubjectWisePercentage;
