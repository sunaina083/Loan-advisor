import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ResultsPage() {
  const location = useLocation();
  const formData = location.state?.formData;

  const [result, setResult] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [factors, setFactors] = useState(null);
  const [loading, setLoading] = useState(true);

  const [whatIfCibil, setWhatIfCibil] = useState(null);
  const [whatIfResult, setWhatIfResult] = useState(null);

  useEffect(() => {
    if (!formData) return;

    const totalAssets =
      Number(formData.residential_assets_value) +
      Number(formData.commercial_assets_value) +
      Number(formData.luxury_assets_value) +
      Number(formData.bank_asset_value);

    const debtToIncome = Number(formData.loan_amount) / Number(formData.income_annum);

    const predictPayload = {
      no_of_dependents: Number(formData.no_of_dependents),
      education: Number(formData.education),
      self_employed: Number(formData.self_employed),
      income_annum: Number(formData.income_annum),
      loan_amount: Number(formData.loan_amount),
      loan_term: Number(formData.loan_term),
      cibil_score: Number(formData.cibil_score),
      residential_assets_value: Number(formData.residential_assets_value),
      commercial_assets_value: Number(formData.commercial_assets_value),
      luxury_assets_value: Number(formData.luxury_assets_value),
      bank_asset_value: Number(formData.bank_asset_value),
      total_assets_value: totalAssets,
      debt_to_income_ratio: debtToIncome
    };

    const eligibilityPayload = {
      no_of_dependents: Number(formData.no_of_dependents),
      education: Number(formData.education),
      self_employed: Number(formData.self_employed),
      income_annum: Number(formData.income_annum),
      loan_term: Number(formData.loan_term),
      cibil_score: Number(formData.cibil_score),
      residential_assets_value: Number(formData.residential_assets_value),
      commercial_assets_value: Number(formData.commercial_assets_value),
      luxury_assets_value: Number(formData.luxury_assets_value),
      bank_asset_value: Number(formData.bank_asset_value),
      total_assets_value: totalAssets
    };

    Promise.all([
      fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictPayload)
      }).then((res) => res.json()),

      fetch('http://127.0.0.1:8000/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eligibilityPayload)
      }).then((res) => res.json()),

      fetch('http://127.0.0.1:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictPayload)
      }).then((res) => res.json())
    ])
      .then(([predictData, eligibilityData, explainData]) => {
        setResult(predictData);
        setEligibility(eligibilityData);
        setFactors(explainData.top_factors);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [formData]);

  const handleWhatIf = (newCibilScore) => {
    setWhatIfCibil(newCibilScore);

    const totalAssets =
      Number(formData.residential_assets_value) +
      Number(formData.commercial_assets_value) +
      Number(formData.luxury_assets_value) +
      Number(formData.bank_asset_value);

    const debtToIncome = Number(formData.loan_amount) / Number(formData.income_annum);

    const applicationData = {
      no_of_dependents: Number(formData.no_of_dependents),
      education: Number(formData.education),
      self_employed: Number(formData.self_employed),
      income_annum: Number(formData.income_annum),
      loan_amount: Number(formData.loan_amount),
      loan_term: Number(formData.loan_term),
      cibil_score: Number(formData.cibil_score),
      residential_assets_value: Number(formData.residential_assets_value),
      commercial_assets_value: Number(formData.commercial_assets_value),
      luxury_assets_value: Number(formData.luxury_assets_value),
      bank_asset_value: Number(formData.bank_asset_value),
      total_assets_value: totalAssets,
      debt_to_income_ratio: debtToIncome
    };

    fetch('http://127.0.0.1:8000/whatif', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application: applicationData,
        feature_to_change: 'cibil_score',
        new_value: newCibilScore
      })
    })
      .then((res) => res.json())
      .then((data) => setWhatIfResult(data))
      .catch((err) => console.error('What-if error:', err));
  };

  if (!formData) {
    return <div style={{ textAlign: 'center', marginTop: '80px' }}>No application data found. Please fill the form first.</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '80px' }}>Analyzing your application...</div>;
  }

  return (
    <div style={{ maxWidth: '550px', margin: '60px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Your Result</h1>

      {result && (
        <div style={{ textAlign: 'center', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ color: result.prediction === 'Approved' ? 'green' : 'red', margin: '0 0 10px' }}>
            {result.prediction}
          </h2>
          <p style={{ margin: 0 }}>Approval Probability: {(result.approval_probability * 100).toFixed(1)}%</p>
        </div>
      )}

      {eligibility && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Eligible Loan Amount</h3>
          <p>₹{eligibility.eligible_range_low.toLocaleString('en-IN')} – ₹{eligibility.eligible_range_high.toLocaleString('en-IN')}</p>
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>What-If Simulator</h3>
          <p style={{ fontSize: '14px', color: '#555' }}>Drag to see how your odds change</p>
          <label>CIBIL Score: {whatIfCibil ?? formData.cibil_score}</label>
          <input
            type="range"
            min="300"
            max="900"
            value={whatIfCibil ?? formData.cibil_score}
            onChange={(e) => handleWhatIf(Number(e.target.value))}
            style={{ width: '100%', margin: '10px 0' }}
          />
          {whatIfResult && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <h3 style={{ color: whatIfResult.prediction === 'Approved' ? 'green' : 'red', margin: 0 }}>
                {whatIfResult.prediction}
              </h3>
              <p style={{ margin: '5px 0 0' }}>New Approval Probability: {(whatIfResult.approval_probability * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      )}

      {factors && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0 }}>Top Factors Affecting Your Result</h3>
          {factors.map((factor, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: index < factors.length - 1 ? '1px solid #ddd' : 'none' }}>
              <span>{factor.feature.replace(/_/g, ' ')}</span>
              <span style={{ color: factor.impact > 0 ? 'green' : 'red' }}>
                {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;