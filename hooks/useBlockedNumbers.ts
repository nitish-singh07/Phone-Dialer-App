import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { blockNumber, unblockNumber } from "../store/slices/blockingSlice";
import { getDeviceBlockedContacts } from "../utils/blockingUtils";
import { BlockedContact } from "../types";

export const useBlockedNumbers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const blockedNumbers = useSelector(
    (state: RootState) => state.blocking.blockedNumbers
  );

  useEffect(() => {
    const loadBlockedNumbers = async () => {
      try {
        setLoading(true);
        const blocked = await getDeviceBlockedContacts();
        blocked.forEach((contact) => dispatch(blockNumber(contact)));
      } catch (err) {
        setError("Failed to load blocked numbers");
      } finally {
        setLoading(false);
      }
    };

    loadBlockedNumbers();
  }, []);

  const blockContact = (contact: BlockedContact) => {
    dispatch(blockNumber(contact));
  };

  const unblockContact = (phoneNumber: string) => {
    dispatch(unblockNumber(phoneNumber));
  };

  return {
    blockedNumbers,
    loading,
    error,
    blockContact,
    unblockContact,
  };
};
