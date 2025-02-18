import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Modal from '@/components/ui/Modal';
import { IWalletInfo } from '../types';


interface GenerateWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWalletGenerated: (walletInfo: IWalletInfo) => void;
    walletInfo?: IWalletInfo;
}

const GenerateWalletModal: React.FC<GenerateWalletModalProps> = ({ isOpen, onClose, onWalletGenerated, walletInfo }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false); 
    const { toast } = useToast();

    const handlePregenerateWallet = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://in-app-wallet.thirdweb.com/api/v1/pregenerate', {
                strategy: 'email',
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-ecosystem-id':'',
                    'x-ecosystem-partner-id':'',
                    'x-client-id':import.meta.env.VITE_THIRDWEB_CLIENT_ID,
                    'x-secret-key':  import.meta.env.VITE_SECRET_KEY,
                }
            });

            const walletInfo = response.data;
            onWalletGenerated(walletInfo);

            toast({
                title: 'Success',
                description: 'Wallet pregenerated successfully!',
            });
            console.log('Wallet pregenerated:', response.data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error pregenerating wallet.',
            });
            console.error('Error pregenerating wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={!walletInfo ?"Generate Wallet":"Pregenerated Wallet"}>
           {!walletInfo ?  (<><Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mb-4"
            />
            <Button
                onClick={handlePregenerateWallet}
                disabled={loading}
                variant="default"
                className="w-full"
            >
                {loading ? 'Generating...' : 'Generate Wallet'}
            </Button>
            <Toaster />
            </>
        ):
            (
                <div className="text-gray-800 dark:text-gray-200">
                    <div className="flex gap-1">
                    <p className="font-mono">{walletInfo.wallet.address}</p>
                    <p 
                        onClick={() => {
                            navigator.clipboard.writeText(walletInfo.wallet.address);
                            setIsCopied(true); // Set copied state to true
                            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
                        }} 
                        className="cursor-pointer ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        title="Copy Address"
                    >
                        {isCopied ? '✅' : '📋'} {/* Change icon based on copy status */}
                    </p>
                    </div>
                  
                    <p className="mt-2">Type: <span className="font-mono">{walletInfo.wallet.type}</span></p>
                </div>
            )
            }
        </Modal>
    );
};

export default GenerateWalletModal; 