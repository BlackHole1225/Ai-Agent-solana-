import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Modal from '@/components/ui/Modal';
import { IWalletInfo } from '../types/index';
import { apiClient } from '../lib/api';


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
            const walletInfo = await apiClient.pregenerateWallet(email);
            onWalletGenerated(walletInfo);

            toast({
                title: 'Success',
                description: 'Wallet pregenerated successfully!',
            });
            console.log('Wallet pregenerated:', walletInfo);
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
           {!walletInfo?.address ?  (<><Input
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
                    <p className="font-mono">{walletInfo.address}</p>
                    <p 
                        onClick={() => {
                            navigator.clipboard.writeText(walletInfo.address.toString());
                            setIsCopied(true); // Set copied state to true
                            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
                        }} 
                        className="cursor-pointer ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        title="Copy Address"
                    >
                        {isCopied ? '✅' : '📋'} {/* Change icon based on copy status */}
                    </p>
                    </div>
                  
                    <p className="mt-2">Type: <span className="font-mono">{walletInfo.type}</span></p>
                </div>
            )
            }
        </Modal>
    );
};

export default GenerateWalletModal; 