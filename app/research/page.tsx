import React from 'react';
import { WelcomeContent } from '../components/WelcomeContent';
import { Login } from '../components/Login';
import { MedicalResearch } from '../components/MedicalResearch';
import { ComputeOutput } from '../components/ComputeOutput';

const ResearchPage = () => {
    return (
        <div className="w-full flex flex-col items-center font-mono text-sm">
            <WelcomeContent />
            <Login />
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-1 gap-4 justify-items-center">
                    <MedicalResearch />
                    <ComputeOutput />
                </div>
            </div>
        </div>
    );
};

export default ResearchPage;