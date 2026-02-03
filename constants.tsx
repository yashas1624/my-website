
import React from 'react';

export const SYSTEM_ARCHITECTURE = {
  mobile: "Flutter or React Native for cross-platform efficiency. Deep integration with ARKit/ARCore for 3D depth estimation.",
  backend: "Node.js (TypeScript) on AWS Lambda/Fargate for scalability. FastAPI for Python-based AI model serving.",
  aiPipeline: "Step 1: Frame Selection (360° video). Step 2: SAM (Segment Anything Model) for dish extraction. Step 3: Depth Estimation (MiDaS/DPT) + Reference Object. Step 4: Multi-modal LLM for refined nutrition mapping.",
  dataStorage: "PostgreSQL for user profiles, MongoDB for unstructured recipe logs, S3 for training image store."
};

export const MVP_ROADMAP = [
  { phase: "MVP (Month 1-3)", focus: "Image-based recognition, basic macro calculation, Indian food library (1000+ items)." },
  { phase: "Phase 2 (Month 4-8)", focus: "360° video volume estimation, oil/sheen detection, integration with wearable health data." },
  { phase: "Phase 3 (Medical)", focus: "Clinical validation trials, doctor dashboard, direct medical record integration (FHIR)." }
];

export const ICONS = {
  Scan: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 0h-2m-6 0H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-3z" />
    </svg>
  ),
  Stats: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Design: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
};
