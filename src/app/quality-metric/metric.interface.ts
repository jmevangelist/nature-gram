export interface Metric{
    metric: MetricType;
    label: string;
    voted?: string;
    agree: number;
    disagree: number;
}

export type MetricType = 'wild'| 'evidence'| 'recent' | 'location' | 'date' ;