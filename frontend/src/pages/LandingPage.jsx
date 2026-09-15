import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Loan Advisor</h1>
      <p style={{ color: '#555', marginBottom: '30px' }}>
        Check your loan approval chances and get personalized advice before you apply
      </p>
      <button
        onClick={() => navigate('/form')}
        style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}
      >
        Check My Loan Eligibility
      </button>
      <button
        onClick={() => navigate('/analyst')}
        style={{ padding: '12px 24px', fontSize: '16px', backgroundColor: 'white', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', cursor: 'pointer' }}
      >
        Analyst Dashboard
      </button>
    </div>
  );
}

export default LandingPage;