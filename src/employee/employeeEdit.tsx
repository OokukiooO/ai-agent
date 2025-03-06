import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { EmployeeConfig } from './edit/employeeConfig';
import { MaterialUpload } from './edit/materialUpload';
import { WxAccount } from '../api/airflow';
import EffectTest from './edit/effectTest';
import { getWxAccountPromptApi } from '../api/airflow';

export const EmployeeEdit: React.FC = () => {
    const { wxid } = useParams<{ wxid: string }>();
    const location = useLocation();
    const wxAccount = location.state?.wxAccount as WxAccount;
    const [prompt, setPrompt] = useState('');

    // Fetch prompt when wxAccount changes
    useEffect(() => {
        const fetchPrompt = async () => {
            if (wxAccount) {
                try {
                    const response = await getWxAccountPromptApi(wxAccount.wxid, wxAccount.name);
                    if (response && response.value) {
                        setPrompt(response.value);
                    }
                } catch (error) {
                    console.error('Failed to fetch prompt:', error);
                }
            }
        };

        fetchPrompt();
    }, [wxAccount]);

    return (
        <div className="p-4">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">员工编辑 - {wxAccount?.name || wxid}</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    <MaterialUpload wxAccount={wxAccount} />
                </div>
                <div>
                    <EmployeeConfig wxAccount={wxAccount} prompt={prompt} setPrompt={setPrompt} />
                    <EffectTest wxAccount={wxAccount} prompt={prompt} />
                </div>
            </div>
        </div>
    );
};
