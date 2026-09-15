import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    no_of_dependents: '',
    education: '',
    self_employed: '',
    income_annum: '',
    loan_amount: '',
    loan_term: '',
    cibil_score: '',
    residential_assets_value: '',
    commercial_assets_value: '',
    luxury_assets_value: '',
    bank_asset_value: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/results', { state: { formData } });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Loan Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Number of Dependents</label><br />
          <input type="number" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Education</label><br />
          <select name="education" value={formData.education} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select</option>
            <option value="1">Graduate</option>
            <option value="0">Not Graduate</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Self Employed</label><br />
          <select name="self_employed" value={formData.self_employed} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Select</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Annual Income (₹)</label><br />
          <input type="number" name="income_annum" value={formData.income_annum} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Loan Amount Requested (₹)</label><br />
          <input type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Loan Term (years)</label><br />
          <input type="number" name="loan_term" value={formData.loan_term} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>CIBIL Score</label><br />
          <input type="number" name="cibil_score" value={formData.cibil_score} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Residential Assets Value (₹)</label><br />
          <input type="number" name="residential_assets_value" value={formData.residential_assets_value} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Commercial Assets Value (₹)</label><br />
          <input type="number" name="commercial_assets_value" value={formData.commercial_assets_value} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Luxury Assets Value (₹)</label><br />
          <input type="number" name="luxury_assets_value" value={formData.luxury_assets_value} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Bank Asset Value (₹)</label><br />
          <input type="number" name="bank_asset_value" value={formData.bank_asset_value} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="submit" style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
          Check My Eligibility
        </button>
      </form>
    </div>
  );
}

export default FormPage;