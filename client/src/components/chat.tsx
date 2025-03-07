import { Button } from "@/components/ui/button";
import {
    ChatBubble,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { client, getErc20Contract, getDevErc20Contract } from "@/lib/thirdwebClient";
import { cn, moment } from "@/lib/utils";
import type { IAttachment } from "@/types";
import type { Content, UUID } from "@elizaos/core";
import { animated, useTransition, type AnimatedProps } from "@react-spring/web";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AIWriter from "react-aiwriter";
import { getBalance, transfer } from "thirdweb/extensions/erc20";
import { ConnectButton, useConnect, useSendAndConfirmTransaction, useSendTransaction } from "thirdweb/react";
import { AudioRecorder } from "./audio-recorder";
import CopyButton from "./copy-button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ChatTtsButton from "./ui/chat/chat-tts-button";
import { useAutoScroll } from "./ui/chat/hooks/useAutoScroll";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { mainnet, sepolia, base, polygon, baseSepolia } from "thirdweb/chains";
import { inAppWallet, preAuthenticate } from "thirdweb/wallets";
import GenerateWalletModal from "./GenerateWalletModal";


import type { IWalletInfo } from "@/types/index";
import { prepareTransaction, toWei } from "thirdweb";

type ExtraContentFields = {
    user: string;
    createdAt: number;
    isLoading?: boolean;
    content?: {
        tokenAddress: string;
        tokenSymbol: string;
        amount: string;
        recipient: string;
        walletAddress: string;
    }
};

type ContentWithUser = Content & ExtraContentFields;

type AnimatedDivProps = AnimatedProps<{ style: React.CSSProperties }> & {
    children?: React.ReactNode;
};
const wallets = [
    inAppWallet({
        auth: { options: ["email", "passkey", "google"] },
    }),
];
export default function Page({ agentId }: { agentId: UUID }) {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletInfo, setWalletInfo] = useState<IWalletInfo>({
        address: '',
        type: ''
    });
    const { connect } = useConnect();
    const closeModal = () => setIsModalOpen(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const { mutate: sendTransaction, error, data: txData, isPending: txPending } = useSendAndConfirmTransaction();

    if (error) console.error(error);
    if (txData) console.log(txData);

    const queryClient = useQueryClient();

    const getMessageVariant = (role: string) =>
        role !== "user" ? "received" : "sent";

    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
        smooth: true,
    });

    const [, setForceRender] = useState(false);

    useEffect(() => {
        if (txData?.status === "success") {
            console.log('successfully', txData.transactionHash);
            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[] = []) => [
                    ...old.filter((msg) => !msg.isLoading),
                    {
                        text: `Token transfer was successful.\n Transaction Hash: ${txData.transactionHash}`,
                        createdAt: Date.now(),
                    }
                ]
            );
            setForceRender(prev => !prev);
        }
    }, [txData]);

    useEffect(() => {
        scrollToBottom();
    }, [queryClient.getQueryData(["messages", agentId])]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (e.nativeEvent.isComposing) return;
            handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;

        const attachments: IAttachment[] | undefined = selectedFile
            ? [
                {
                    url: URL.createObjectURL(selectedFile),
                    contentType: selectedFile.type,
                    title: selectedFile.name,
                },
            ]
            : undefined;

        const newMessages = [
            {
                text: input,
                user: "user",
                createdAt: Date.now(),
                attachments,
            },
            {
                text: input,
                user: "system",
                isLoading: true,
                createdAt: Date.now(),
            },
        ];

        queryClient.setQueryData(
            ["messages", agentId],
            (old: ContentWithUser[] = []) => [...old, ...newMessages]
        );

        sendMessageMutation.mutate({
            message: input,
            selectedFile: selectedFile ? selectedFile : null,
        });

        setSelectedFile(null);
        setInput("");
        formRef.current?.reset();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const sendMessageMutation = useMutation({
        mutationKey: ["send_message", agentId],
        mutationFn: ({
            message,
            selectedFile,
        }: {
            message: string;
            selectedFile?: File | null;
        }) => apiClient.sendMessage(agentId, message, selectedFile),
        onSuccess: async (newMessages: ContentWithUser[]) => {
            console.log(newMessages)
            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[] = []) => [
                    ...old.filter((msg) => !msg.isLoading),
                    ...newMessages.map((msg) => ({
                        ...msg,
                        createdAt: Date.now(),
                    })),
                ]
            );

            console.log("newMessages:", newMessages);
            if (newMessages.length > 1 && newMessages[1]?.content) {
                const content = newMessages[1].content;
                const action = newMessages[0].action;
                console.log("content", content);
                await handleAction(action, content);
            }
        },
        onError: (e) => {
            console.error(e)
            toast({
                variant: "destructive",
                title: "Unable to send message",
                description: e.message,
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file?.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    const messages =
        queryClient.getQueryData<ContentWithUser[]>(["messages", agentId]) ||
        [];

    const transitions = useTransition(messages, {
        keys: (message) =>
            `${message.createdAt}-${message.user}-${message.text}`,
        from: { opacity: 0, transform: "translateY(50px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(10px)" },
    });

    const CustomAnimatedDiv = animated.div as React.FC<AnimatedDivProps>;

    const handleWalletGenerated = (walletInfo: IWalletInfo) => {
        setWalletInfo(walletInfo);
    };

    const handleAction = async (action: any, content: any) => {
        switch (action) {
            case "GET_BALANCE":
                const balanceContract = getDevErc20Contract(content.tokenAddress);
                const balance = await getBalance({ contract: balanceContract, address: content.walletAddress });
                const formattedBalance = Number(balance.value) / 1e6;
                queryClient.setQueryData(
                    ["messages", agentId],
                    (old: ContentWithUser[]) => [
                        ...old,
                        {
                            text: `Balance retrieved: ${formattedBalance.toFixed(2)} USDC`,
                            createdAt: Date.now(),
                        }
                    ]
                );
                return;
            case "TRANSFER_TOKEN":
                const TransferContract = getErc20Contract(content.tokenAddress);
                const transaction = transfer({
                    contract: TransferContract,
                    to: content.recipient,
                    amount: content.amount,
                });
                sendTransaction(transaction);
                return;
            case "BUY_TOKEN":
                handleFiatTransaction(
                    content.amount,
                    content.recipient,
                );
                return;
            case "CREATE_PREWALLET":
                try {
                    const walletInfo = await apiClient.pregenerateWallet(content.emailAddress);
                    setWalletInfo(walletInfo);
                    await preAuthenticate({
                        client,
                        strategy: "email",
                        email: content.emailAddress, // ex: user@example.com
                    });
                    queryClient.setQueryData(
                        ["messages", agentId],
                        (old: ContentWithUser[]) => [
                            ...old,
                            {
                                text: `Email verification code was sent your email (${content.emailAddress}).\nPlease check your email and send verification code by message like 'verification code is 000000' for login.
                                `,
                                createdAt: Date.now(),
                            }
                        ]
                    );
                } catch (error) {
                    console.error('Error creating prewallet:', error);
                }
                return;
            case "VERIFY_EMAIL":
                handleLogin(content.email, content.verificationCode)
                return;
        }
    };
    const handleLogin = async (
        email: string,
        verificationCode: string,
    ) => {
        // verify email and connect
        try {
            await connect(async () => {
                const wallet = inAppWallet();
                await wallet.connect({
                    client,
                    strategy: "email",
                    email,
                    verificationCode,
                });
                return wallet;
            });

            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[]) => [
                    ...old,
                    {
                        text: `Successfully logged in by ${email}`,
                        createdAt: Date.now(),
                    }
                ]
            );
        } catch {
            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[]) => [
                    ...old,
                    {
                        text: `Failed`,
                        createdAt: Date.now(),
                    }
                ]
            );
        }
    };
    const payWithFiat = (response: any) => {
        console.log("fiatResponse:", response);
        const { status } = response;

        // const { response: { fiatAmount, cryptoAmount, fiatCurrency, cryptoCurrency, totalFee, feeBreakdown, network } } = response;

        // const feeDetails = feeBreakdown.map((fee: { name: string; value: number }) => `${fee.name}: ${fee.value}`).join(", ");
        // const successMessage = `Transaction completed. You bought ${cryptoAmount} ${cryptoCurrency} for ${fiatAmount} ${fiatCurrency} on ${network} network. Total fees: ${totalFee}. Fee breakdown: ${feeDetails}.`;

        // queryClient.setQueryData(
        //     ["messages", agentId],
        //     (old: ContentWithUser[] = []) => [
        //         ...old,
        //         {
        //             text: successMessage,
        //             createdAt: Date.now(),
        //         }
        //     ]
        // );

        // for kado
        const { source: { amount, transactionHash, token: { symbol } }, fromAddress, toAddress, quote: { fromCurrency: { amount: currencyAmount, currencySymbol } } } = status;
        const successMessage = `Transaction completed from ${fromAddress} to ${toAddress} for amount ${amount} ${symbol}(${currencyAmount} ${currencySymbol}). Transaction Hash: ${transactionHash}`;
        queryClient.setQueryData(
            ["messages", agentId],
            (old: ContentWithUser[] = []) => [
                ...old,
                {
                    text: successMessage,
                    createdAt: Date.now(),
                }
            ]
        );
        setForceRender(prev => !prev);
    };

    const { mutate: sendTransactionFiat } = useSendTransaction({
        payModal: {
            metadata: {
                name: "Buy Crypto",
            },
            buyWithFiat: {
                testMode: true,
                preferredProvider: "TRANSAK",
            },
            onPurchaseSuccess: payWithFiat,
        },
    });

    // const handleFiatTransaction = async (tokenAmount: string, recipient: string, tokenSymbol: string, fiatType: "KADO" | "COINBASE" | "STRIPE" | "TRANSAK" | undefined) => {
    const handleFiatTransaction = async (tokenAmount: string, recipient: string) => {
        try {
            const transaction = prepareTransaction({
                to: recipient,
                value: toWei(tokenAmount),
                chain: mainnet,
                client: client,
            });
            sendTransactionFiat(transaction);
        } catch (error) {
            console.error("Fiat transaction error:", error);
        }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">

            <div className="flex justify-end">
                {/* <Button onClick={openModal}>
                    {walletInfo?.address ? `Wallet: ${walletInfo?.address.slice(0, 6)}...${walletInfo?.address.slice(-4)}` : "Generate Wallet"}
                </Button> */}
                <ConnectButton
                    connectButton={{
                        className: 'p-1 w-48 h-12',
                        style: {
                            height: "36px",
                            width: "120px",
                            minWidth: "120px"
                        }
                    }}
                    detailsModal={{
                        payOptions: {
                            buyWithFiat: {
                                testMode: true,
                                preferredProvider: "COINBASE",
                            },
                            onPurchaseSuccess: payWithFiat,
                        },
                        onClose: (screen: string) => {
                            console.log({ screen });
                        }
                    }}
                    wallets={wallets}
                    client={client}
                    chains={[mainnet, sepolia, base, polygon, baseSepolia]}


                />


            </div>
            <div className="flex-1 overflow-y-auto">
                <ChatMessageList
                    scrollRef={scrollRef}
                    isAtBottom={isAtBottom}
                    scrollToBottom={scrollToBottom}
                    disableAutoScroll={disableAutoScroll}
                >
                    {transitions((style, message: ContentWithUser) => {
                        const variant = getMessageVariant(message?.user);
                        return (
                            <CustomAnimatedDiv
                                style={{
                                    ...style,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    padding: "1rem",
                                }}
                            >
                                <ChatBubble
                                    variant={variant}
                                    className="flex flex-row items-center gap-2"
                                >
                                    {message?.user !== "user" ? (
                                        <Avatar className="size-8 p-1 border rounded-full select-none">
                                            <AvatarImage src="/elizaos-icon.png" />
                                        </Avatar>
                                    ) : null}
                                    <div className="flex flex-col">
                                        <ChatBubbleMessage
                                            isLoading={message?.isLoading}
                                        >
                                            {message?.user !== "user" ? (
                                                <AIWriter>
                                                    {message?.text}
                                                </AIWriter>
                                            ) : (
                                                message?.text
                                            )}
                                            {/* Attachments */}
                                            <div>
                                                {message?.attachments?.map(
                                                    (attachment: IAttachment) => (
                                                        <div
                                                            className="flex flex-col gap-1 mt-2"
                                                            key={`${attachment.url}-${attachment.title}`}
                                                        >
                                                            <img
                                                                alt="attachment"
                                                                src={attachment.url}
                                                                width="100%"
                                                                height="100%"
                                                                className="w-64 rounded-md"
                                                            />
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span />
                                                                <span />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ChatBubbleMessage>
                                        <div className="flex items-center gap-4 justify-between w-full mt-1">
                                            {message?.text?.length &&
                                                !message?.isLoading ? (
                                                <div className="flex items-center gap-1">
                                                    <CopyButton
                                                        text={message?.text}
                                                    />
                                                    <ChatTtsButton
                                                        agentId={agentId}
                                                        text={message?.text}
                                                    />
                                                </div>
                                            ) : null}
                                            <div
                                                className={cn([
                                                    message?.isLoading
                                                        ? "mt-2"
                                                        : "",
                                                    "flex items-center justify-between gap-4 select-none",
                                                ])}
                                            >
                                                {message?.source ? (
                                                    <Badge variant="outline">
                                                        {message.source}
                                                    </Badge>
                                                ) : null}
                                                {message?.action ? (
                                                    <Badge variant="outline">
                                                        {message.action}
                                                    </Badge>
                                                ) : null}
                                                {message?.createdAt ? (
                                                    <ChatBubbleTimestamp
                                                        timestamp={moment(
                                                            message?.createdAt
                                                        ).format("LT")}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </ChatBubble>
                            </CustomAnimatedDiv>
                        );
                    })}
                </ChatMessageList>
            </div>
            <div className="px-4 pb-4">
                <form
                    ref={formRef}
                    onSubmit={handleSendMessage}
                    className="relative rounded-md border bg-card"
                >
                    {selectedFile ? (
                        <div className="p-3 flex">
                            <div className="relative rounded-md border p-2">
                                <Button
                                    onClick={() => setSelectedFile(null)}
                                    className="absolute -right-2 -top-2 size-[22px] ring-2 ring-background"
                                    variant="outline"
                                    size="icon"
                                >
                                    <X />
                                </Button>
                                <img
                                    alt="Selected file"
                                    src={URL.createObjectURL(selectedFile)}
                                    height="100%"
                                    width="100%"
                                    className="aspect-square object-contain w-16"
                                />
                            </div>
                        </div>
                    ) : null}
                    <ChatInput
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        value={input}
                        onChange={({ target }) => setInput(target.value)}
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none rounded-md bg-card border-0 p-3 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center p-3 pt-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        <Paperclip className="size-4" />
                                        <span className="sr-only">
                                            Attach file
                                        </span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Attach file</p>
                            </TooltipContent>
                        </Tooltip>
                        <AudioRecorder
                            agentId={agentId}
                            onChange={(newInput: string) => setInput(newInput)}
                        />
                        <Button
                            disabled={!input || sendMessageMutation?.isPending || txPending}
                            type="submit"
                            size="sm"
                            className="ml-auto gap-1.5 h-[30px]"
                        >
                            {sendMessageMutation?.isPending
                                ? "..."
                                : "Send Message"}
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </form>
            </div>
            <GenerateWalletModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onWalletGenerated={handleWalletGenerated}
                walletInfo={walletInfo}
            />
        </div>
    );
}
