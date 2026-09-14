import { useState, useCallback } from 'react';

// 示例：获取模拟数据
interface MockRecord {
  id: string;
  name: string;
  value: number;
  trend: number;
}

const mockData: MockRecord[] = [
  { id: '1', name: '一月', value: 1200, trend: 12 },
  { id: '2', name: '二月', value: 1800, trend: 8 },
  { id: '3', name: '三月', value: 1400, trend: -5 },
  { id: '4', name: '四月', value: 2200, trend: 15 },
  { id: '5', name: '五月', value: 1600, trend: 3 },
  { id: '6', name: '六月', value: 2400, trend: 20 },
];

export function useRecordData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<MockRecord[]>(mockData);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRecord(mockData);
    } catch {
      setError('加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  return { record, loading, error, refetch };
}
