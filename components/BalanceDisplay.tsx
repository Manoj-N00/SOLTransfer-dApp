import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';

export const BalanceDisplay: FC = () => {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey } = useWallet(); // Corrected to `publicKey`

    useEffect(() => {
        if (!connection || !publicKey) {
            return;
        }

        // Fetch the initial balance
        const fetchBalance = async () => {
            const accountInfo = await connection.getAccountInfo(publicKey);
            if (accountInfo) {
                setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
            }
        };

        fetchBalance();

        // Subscribe to account changes
        const subscriptionId = connection.onAccountChange(
            publicKey,
            (updatedAccountInfo) => {
                setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
            },
            "confirmed"
        );

        // Cleanup subscription on component unmount
        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }, [connection, publicKey]);

    return (
        <p>
            {publicKey
                ? `Balance: ${balance.toFixed(2)} SOL`
                : "Connect your wallet to view balance."}
        </p>
    );
};

export default BalanceDisplay;
