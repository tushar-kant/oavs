import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, CardBody, CardHeader } from 'reactstrap';
import FilterDropdown from './FilterDropdown';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import Loading from './Loading'; // Import the Loading component


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SlabWiseStudentPercentage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Individual filter states
  const [vidyalayaNames, setVidyalayaNames] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [sessionNames, setSessionNames] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [examNames, setExamNames] = useState([]);

  const [selectedVidyalayas, setSelectedVidyalayas] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/results/slab-wise-student-percent');
        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        setData(result);

        // Extract unique values for filters
        setVidyalayaNames([...new Set(result.map(item => item.vidyalaya_name).filter(Boolean))]);
        setClassNames([...new Set(result.map(item => item.class_name).filter(Boolean))]);
        setSessionNames([...new Set(result.map(item => item.session_name).filter(Boolean))]);
        setDistricts([...new Set(result.map(item => item.district).filter(Boolean))]);
        setExamNames([...new Set(result.map(item => item.exam_name).filter(Boolean))]);

        // Set all filter values as selected initially
        setSelectedVidyalayas([...new Set(result.map(item => item.vidyalaya_name).filter(Boolean))]);
        setSelectedClasses([...new Set(result.map(item => item.class_name).filter(Boolean))]);
        setSelectedSessions([...new Set(result.map(item => item.session_name).filter(Boolean))]);
        setSelectedDistricts([...new Set(result.map(item => item.district).filter(Boolean))]);
        setSelectedExams([...new Set(result.map(item => item.exam_name).filter(Boolean))]);
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
      (!selectedVidyalayas.length || selectedVidyalayas.includes(item.vidyalaya_name)) &&
      (!selectedClasses.length || selectedClasses.includes(item.class_name)) &&
      (!selectedSessions.length || selectedSessions.includes(item.session_name)) &&
      (!selectedDistricts.length || selectedDistricts.includes(item.district)) &&
      (!selectedExams.length || selectedExams.includes(item.exam_name))
    );
  });

  // Helper function to calculate averages for duplicate values
  const calculateAverage = (data, key) => {
    const groupedData = {};

    // Group by key (vidyalaya_name or slab)
    data.forEach(item => {
      if (!groupedData[item[key]]) {
        groupedData[item[key]] = { total: 0, count: 0 };
      }
      groupedData[item[key]].total += item.student_per;
      groupedData[item[key]].count += 1;
    });

    // Calculate the average for each group
    return Object.keys(groupedData).map(group => ({
      [key]: group,
      student_per: groupedData[group].total / groupedData[group].count,
    }));
  };

  // Prepare data for the two bar charts
  const averagedVidyalayaData = calculateAverage(filteredData, 'vidyalaya_name');
  const averagedSlabData = calculateAverage(filteredData, 'slab');

  const vidyalayaChartData = {
    labels: averagedVidyalayaData.map(item => item.vidyalaya_name),
    datasets: [
      {
        label: 'Student Percentage',
        data: averagedVidyalayaData.map(item => item.student_per),
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
      },
    ],
  };

  const slabChartData = {
    labels: averagedSlabData.map(item => item.slab),
    datasets: [
      {
        label: 'Student Percentage',
        data: averagedSlabData.map(item => item.student_per),
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
      },
    ],
  };

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="container border"><Header />
  
      <div className="row">
        <div className="col-8">
          <h1 className="my-4">OAVS(Slab Wise student percentage)</h1>
        </div>
        <div className="col-4 text-center pt-4">
        <h4 className="text-left mb-0">Total Records: {filteredData.length}</h4>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-end mb-4">

          <FilterDropdown
            title="Vidyalaya Name"
            options={vidyalayaNames}
            selectedOptions={selectedVidyalayas}
            onOptionChange={setSelectedVidyalayas}
            className="ms-3"

          />
      
          <FilterDropdown
            title="Class Name"
            options={classNames}
            selectedOptions={selectedClasses}
            onOptionChange={setSelectedClasses}
            className="ms-3"

          />
   
          <FilterDropdown
            title="Session Name"
            options={sessionNames}
            selectedOptions={selectedSessions}
            onOptionChange={setSelectedSessions}
            className="ms-3"

          />
    
          <FilterDropdown
            title="District"
            options={districts}
            selectedOptions={selectedDistricts}
            onOptionChange={setSelectedDistricts}
            className="ms-3"

          />
   
          <FilterDropdown
            title="Exam Name"
            options={examNames}
            selectedOptions={selectedExams}
            onOptionChange={setSelectedExams}
            className="ms-3"

          />
      </div>



      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <CardHeader style={{ backgroundColor: '#449954', color: 'white' }}>
              Student Percentage by Vidyalaya</CardHeader>
            <CardBody>
              <Bar data={vidyalayaChartData} options={{ responsive: true, scales: { x: { beginAtZero: true } } }} />
            </CardBody>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <CardHeader style={{ backgroundColor: '#696851', color: 'white' }}>
              Student Percentage by Slab</CardHeader>
            <CardBody>
              <Bar data={slabChartData} options={{ responsive: true, scales: { x: { beginAtZero: true } } }} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SlabWiseStudentPercentage;
