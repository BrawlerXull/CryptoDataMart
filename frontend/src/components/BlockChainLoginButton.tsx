import { useSelector } from 'react-redux';
import useWalletLogin from '../hooks/useWalletLogin';
import { RootState } from '../redux/store'; 

const BlockchainLoginButton = () => {
  const { connectWallet, disconnectWalletHandler } = useWalletLogin();
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  return (
    <>
      {!isConnected && (
        <button
          onClick={connectWallet}
          className="rounded-md text-background bg-primary hover:bg-border hover:text-primary"
        >
          Connect MetaMask
        </button>
      )}
      {isConnected && (
        <>
          <button
            onClick={disconnectWalletHandler}
            className="rounded-md text-background bg-primary hover:bg-border hover:text-primary"
          >
            Disconnect
          </button>
        </>
      )}
    </>
  );
};

export default BlockchainLoginButton;
