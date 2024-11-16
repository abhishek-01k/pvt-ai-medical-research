import React from "react";
import { useAccount } from "wagmi";
import {
  IDKitWidget,
  VerificationLevel,
} from "@worldcoin/idkit";
import { ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
const WorldcoinVerification = ({
  title,
  onSuccess,
}: {
  title: string;
  onSuccess: (data: any) => void;
}) => {
  const { address } = useAccount();

  const handleSuccess = (data: any) => {
    console.log("Verification successful:", data);
    onSuccess(data);
  };
  return (
    <IDKitWidget
      app_id={"app_staging_7461b9bbd3e873b76c098c984ab139ba"}
      action={"verify"}
      signal={address}
      verification_level={VerificationLevel.Orb}
      onSuccess={handleSuccess}
      onError={(err) => {
        console.log("Err", err);
      }}
    >
      {({ open }) => (
        <Button
          variant='outline'
          className="border p-2 rounded-lg hover:bg-gray-300"
          onClick={open}
        >
          <ThumbsUp size={18} className="mr-2" />
          {title}
        </Button>
      )}
    </IDKitWidget>
  );
};

export default WorldcoinVerification;
