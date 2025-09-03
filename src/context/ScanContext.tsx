import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { submitScan, ApiClientError } from '../api';
import type { ProcessScanRequest, ProcessScanResult } from '../api/types';

interface ScanContextType {
  data: ProcessScanResult | null;
  loading: boolean;
  error: string | null;
  processScan: (request: ProcessScanRequest) => Promise<void>;
  reset: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

interface ScanProviderProps {
  children: ReactNode;
}

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [data, setData] = useState<ProcessScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Historial eliminado

  const processScan = useCallback(async (request: ProcessScanRequest) => {
    if (!request.codigo?.trim()) {
      setError('El código es requerido');
      return;
    }

    if (!request.ubicacion?.trim()) {
      setError('La ubicación es requerida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await submitScan(request);

      setData(result);
    } catch (error) {
      const errorMessage =
        error instanceof ApiClientError
          ? error.message
          : 'Error desconocido al procesar el escaneo';

      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // clearHistory eliminado

  const value: ScanContextType = {
    data,
    loading,
    error,
    processScan,
    reset,
  };

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
};

export const useScanContext = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScanContext must be used within ScanProvider');
  }
  return context;
};
