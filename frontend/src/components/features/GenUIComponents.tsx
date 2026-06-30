import React from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Circle, Clock } from 'lucide-react';

export interface GenUIProps {
    componentData: any;
}

// 1. KPI Card Component
export const KPICard: React.FC<{ props: any }> = ({ props }) => {
    const { title, value, trend, label } = props;
    
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-w-[200px] hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h4>
            <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
                {trend && (
                    <div className={`flex items-center text-sm font-semibold mb-1 ${
                        trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                        {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : trend < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : <Minus className="w-4 h-4 mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            {label && <p className="text-xs text-gray-400 mt-2">{label}</p>}
        </div>
    );
};

// 2. Data Table Component
export const DataTable: React.FC<{ props: any }> = ({ props }) => {
    const { title, columns = [], rows = [] } = props;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm my-4 w-full">
            {title && (
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                        <tr>
                            {columns.map((col: string, idx: number) => (
                                <th key={idx} className="px-4 py-3 font-medium">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any[], rIdx: number) => (
                            <tr key={rIdx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                {row.map((cell: any, cIdx: number) => (
                                    <td key={cIdx} className="px-4 py-3 text-gray-700">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 3. Progress Tracker Component
export const ProgressTracker: React.FC<{ props: any }> = ({ props }) => {
    const { title, steps = [], currentStep = 0 } = props;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm my-4 w-full">
            {title && <h3 className="font-semibold text-gray-800 text-sm mb-4">{title}</h3>}
            <div className="flex items-center justify-between relative mt-6">
                <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                <div 
                    className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentStep / (Math.max(1, steps.length - 1))) * 100)}%` }}
                ></div>
                
                {steps.map((step: any, idx: number) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    
                    return (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isCompleted ? 'bg-blue-100 text-blue-600' : 
                                isCurrent ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 
                                'bg-gray-100 text-gray-400'
                            }`}>
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                                 isCurrent ? <Circle className="w-3 h-3 fill-current" /> : 
                                 <Clock className="w-4 h-4" />}
                            </div>
                            <div className="text-center">
                                <span className={`text-xs font-semibold block ${isCurrent ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {step.label}
                                </span>
                                {step.description && (
                                    <span className="text-[10px] text-gray-400 hidden sm:block max-w-[80px] leading-tight">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Generic Renderer
export const DynamicGenUI: React.FC<{ component: any }> = ({ component }) => {
    switch (component.type) {
        case 'KPICard':
            return <KPICard props={component.props} />;
        case 'DataTable':
            return <DataTable props={component.props} />;
        case 'ProgressTracker':
            return <ProgressTracker props={component.props} />;
        default:
            return (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                    Unknown Component Type: {component.type}
                </div>
            );
    }
};
