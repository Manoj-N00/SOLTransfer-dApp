import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

const SendSolForm = () => {
    const [txSig, setTxSig] = useState('');
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const link = () => `https://explorer.solana.com/tx/${txSig}?cluster=devnet`;

    const sendSol = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!connection || !publicKey) {
            alert("Please connect your wallet.");
            return;
        }

        const form = event.currentTarget;
        const amount = parseFloat((form.amount as unknown as HTMLInputElement).value);
        const recipientAddress = (form.recipient as unknown as HTMLInputElement).value;

        try {
            const transaction = new web3.Transaction();
            const recipientPubKey = new web3.PublicKey(recipientAddress);

            const sendSolInstruction = web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPubKey,
                lamports: LAMPORTS_PER_SOL * amount,
            });

            transaction.add(sendSolInstruction);

            sendTransaction(transaction, connection)
                .then((sig) => {
                    setTxSig(sig);
                })
                .catch((error) => {
                    console.error("Transaction failed:", error);
                    alert("Transaction failed. Please try again.");
                });
        } catch (error) {
            console.error("Error in sendSol:", error);
            alert("Invalid recipient address or amount.");
        }
    };

    return (
        <div className='bg-white'>
            <div>
                {publicKey ? (
                    <form
                        onSubmit={sendSol}
                        className='flex flex-col justify-center items-center mt-24 mx-auto max-w-md'
                    >
                        <div className="mb-6">
                            <label
                                htmlFor="amount"
                                className='block mb-2 text-lg font-medium text-gray-800'
                            >
                                Amount (in SOL) to Send:
                            </label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                placeholder="e.g. 0.1"
                                required
                                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#512da8]'
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="recipient"
                                className='block mb-2 text-lg font-medium text-gray-800'
                            >
                                Send SOL to:
                            </label>
                            <input
                                type="text"
                                id="recipient"
                                name="recipient"
                                placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
                                required
                                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#512da8]'
                            />
                        </div>

                        <button
                            type="submit"
                            className='bg-black text-white px-4 py-2 rounded-lg hover:bg-[#512da8] transition duration-300 ease-in-out'
                        >
                            Send
                        </button>
                    </form>
                ) : (
                    <div className='flex justify-center items-center text-gray-800 font-bold text-xl mt-60'>
                        <p>Connect Your Wallet</p>
                    </div>
                )}
                {txSig && (
                    <div className='flex justify-center items-center mt-4'>
                        <p className='text-gray-800 font-normal'>View your transaction on - </p>
                        <a
                            href={link()}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-gray-800 font-normal hover:text-[#512da8]'
                        >
                            Solana Explorer 🚀
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendSolForm;
