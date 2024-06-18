import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './machine.css';
import Header from '../header/header';
const HospitalEquipmentForm = () => {
  const navigate = useNavigate();

  // State variables
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [formData, setFormData] = useState({
    hospitalName: '',
    equipmentMake: '',
    equipmentModel: '',
    equipmentName: '',
    equipmentCode: '',
    purchaseDate: '',
    calibrationDate: '',
    calibratedAt: '',
    calibrationFactor: '',
    validDate: '',
    appointmentStatus: '',
    workingStatus: '',
    comments: '',
  });

  // Today's date for date inputs
  const today = new Date().toISOString().split('T')[0];

  // Fetch makes from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/main', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setMakes(data); // Assuming data is an array of makes
        } else {
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchData();
  }, []);

  // Handle change in equipment make dropdown
  const handleMakeChange = async (e) => {
    const selectedMake = e.target.value;
    setFormData({
      ...formData,
      equipmentMake: selectedMake,
      equipmentModel: '', // Reset equipment model when make changes
    });

    // Fetch models for the selected make
    try {
      const response = await fetch(`http://localhost:5000/models/${selectedMake}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data[0].model); // Assuming data.models is an array of models
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }

  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Response from server:', jsonResponse);
        navigate('/main');
      } else {
        console.error('Server error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    console.log(formData);
  };

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
    <Header />
    <div>
      <center><h2>Define Hospital Equipment</h2></center>
      <form onSubmit={handleSubmit}>
        <label htmlFor="hospital-name">Hospital Name</label>
        <input
        type="text"
          id="hospital-name"
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleChange}
          required
        />
          

        <label htmlFor="equipment-make">Equipment Make</label>
        <select
          id="equipment-make"
          name="equipmentMake"
          value={formData.equipmentMake}
          onChange={handleMakeChange}
          required
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make._id} value={make.make}>
              {make.make}
            </option>
          ))}
        </select>

        <label htmlFor="equipment-model">Equipment Model</label>
        <select
          id="equipment-model"
          name="equipmentModel"
          value={formData.equipmentModel}
          onChange={handleChange}
          required
        >
          <option value="">Select Model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>

        <label htmlFor="equipment-name">Equipment Name</label>
        <input
          type="text"
          id="equipment-name"
          name="equipmentName"
          value={formData.equipmentName}
          onChange={handleChange}
          maxLength="100"
          required
        />

        <label htmlFor="equipment-code">Equipment Code</label>
        <input
          type="text"
          id="equipment-code"
          name="equipmentCode"
          value={formData.equipmentCode}
          onChange={handleChange}
          maxLength="100"
          required
        />

        <label htmlFor="purchase-date">Purchase Date</label>
        <input
          type="date"
          id="purchase-date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          max={today}
          required
        />

        <label htmlFor="calibration-date">Calibration Date</label>
        <input
          type="date"
          id="calibration-date"
          name="calibrationDate"
          value={formData.calibrationDate}
          onChange={handleChange}
          min={formData.purchaseDate}
          required
        />

        <label htmlFor="calibrated-at">Calibrated At</label>
        <select
          id="calibrated-at"
          name="calibratedAt"
          value={formData.calibratedAt}
          onChange={handleChange}
          required
        >
          <option value="">Select Location</option>
          <option value="location1">Location 1</option>
          <option value="location2">Location 2</option>
        </select>

        <label htmlFor="calibration-factor">Calibration Factor</label>
        <input
          type="text"
          id="calibration-factor"
          name="calibrationFactor"
          value={formData.calibrationFactor}
          onChange={handleChange}
          maxLength="50"
          required
        />

        <label htmlFor="valid-date">Valid Date</label>
        <input
          type="date"
          id="valid-date"
          name="validDate"
          value={formData.validDate}
          onChange={handleChange}
          min={today}
          required
        />

        <label>Appointment Status</label>
        <div className="radio">
          <input
            type="radio"
            id="appointment-yes"
            name="appointmentStatus"
            value="Yes"
            checked={formData.appointmentStatus === 'Yes'}
            onChange={handleChange}
          />
          <label htmlFor="appointment-yes">Yes</label>

          <input
            type="radio"
            id="appointment-no"
            name="appointmentStatus"
            value="No"
            checked={formData.appointmentStatus === 'No'}
            onChange={handleChange}
          />
          <label htmlFor="appointment-no">No</label>
        </div>

        <label>Working Status</label>
        <div className="radio">
          <input
            type="radio"
            id="working"
            name="workingStatus"
            value="Working"
            checked={formData.workingStatus === 'Working'}
            onChange={handleChange}
          />
          <label htmlFor="working">Working</label>

          <input
            type="radio"
            id="not-working"
            name="workingStatus"
            value="Not Working"
            checked={formData.workingStatus === 'Not Working'}
            onChange={handleChange}
          />
          <label htmlFor="not-working">Not Working</label>
        </div>

        <label htmlFor="comments">Comments</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows="4"
        />
        <button type="submit" id="submit">Submit</button>
      </form>
    </div>
    </>
  );
};

export default HospitalEquipmentForm;
