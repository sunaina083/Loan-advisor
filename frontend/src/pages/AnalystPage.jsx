import { useEffect, useState } from 'react';

function AnalystPage() {
  const [models, setModels] = useState([]);
  const [finalModel, setFinalModel] = useState('');
  const [importances, setImportances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/model-stats').then((res) => res.json()),
      fetch('http://127.0.0.1:8000/feature-importance').then((res) => res.json())
    ])
      .then(([statsData, importanceData]) => {
        setModels(statsData.models);
        setFinalModel(statsData.final_model);
        setImportances(importanceData.feature_importances);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '80px' }}>Loading analyst data...</div>;
  }

  const maxImportance = importances.length > 0 ? importances[0].importance : 1;

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '0 20px' }}>
      <h1>Analyst Dashboard</h1>
      <p style={{ color: '#555' }}>Technical view of model performance and decision factors</p>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Model Comparison</h3>
        <p style={{ fontSize: '14px', color: '#555' }}>Final model in use: <strong>{finalModel}</strong></p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Model</th>
              <th style={{ padding: '8px' }}>Accuracy</th>
              <th style={{ padding: '8px' }}>Precision</th>
              <th style={{ padding: '8px' }}>Recall</th>
              <th style={{ padding: '8px' }}>F1-Score</th>
              <th style={{ padding: '8px' }}>ROC-AUC</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: '1px solid #eee',
                  fontWeight: model.name === 'Random Forest' ? 'bold' : 'normal',
                  backgroundColor: model.name === 'Random Forest' ? '#e0f2e9' : 'transparent'
                }}
              >
                <td style={{ padding: '8px' }}>{model.name}</td>
                <td style={{ padding: '8px' }}>{(model.accuracy * 100).toFixed(2)}%</td>
                <td style={{ padding: '8px' }}>{(model.precision * 100).toFixed(2)}%</td>
                <td style={{ padding: '8px' }}>{(model.recall * 100).toFixed(2)}%</td>
                <td style={{ padding: '8px' }}>{(model.f1 * 100).toFixed(2)}%</td>
                <td style={{ padding: '8px' }}>{(model.roc_auc * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px' }}>
        <h3 style={{ marginTop: 0 }}>Global Feature Importance</h3>
        <p style={{ fontSize: '14px', color: '#555' }}>Which factors matter most across all applicants</p>
        {importances.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>{item.feature.replace(/_/g, ' ')}</span>
              <span>{(item.importance * 100).toFixed(2)}%</span>
            </div>
            <div style={{ backgroundColor: '#ddd', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(item.importance / maxImportance) * 100}%`,
                  backgroundColor: '#2563eb',
                  height: '100%'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalystPage;