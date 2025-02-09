import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addCallLog } from "../store/historySlice";
import { getDeviceCallLogs } from "../utils/historyUtils";
import { CallLogEntry } from "../types";

export const useCallHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const callLogs = useSelector((state: RootState) => state.history.logs);

  useEffect(() => {
    const loadCallHistory = async () => {
      try {
        setLoading(true);
        const logs = await getDeviceCallLogs();
        logs.forEach((log) => dispatch(addCallLog(log)));
      } catch (err) {
        setError("Failed to load call history");
      } finally {
        setLoading(false);
      }
    };

    loadCallHistory();
  }, []);

  const addNewCall = (call: CallLogEntry) => {
    dispatch(addCallLog(call));
  };

  return {
    callLogs,
    loading,
    error,
    addNewCall,
  };
};
