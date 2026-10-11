import React from 'react';

const CorporateManager = ({ theme, setTheme }) => {
  return (
    <div className="p-4 text-start">
      <div className="mb-4">
        <label className="form-label fw-bold small text-uppercase text-primary">Hakkımızda Genel Metni</label>
        <textarea className="form-control bg-light" rows="5" value={theme.satisfactionText || ""} onChange={(e) => setTheme({ ...theme, satisfactionText: e.target.value })} />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold small text-uppercase text-primary">Misyonumuz</label>
          <textarea className="form-control bg-light" rows="6" value={theme.mission || ""} onChange={(e) => setTheme({ ...theme, mission: e.target.value })} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-bold small text-uppercase text-primary">Vizyonumuz</label>
          <textarea className="form-control bg-light" rows="6" value={theme.vision || ""} onChange={(e) => setTheme({ ...theme, vision: e.target.value })} />
        </div>
      </div>
    </div>
  );
};

export default CorporateManager;