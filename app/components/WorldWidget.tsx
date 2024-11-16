import React from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { decodeAbiParameters } from "viem";

const WorldWidget = () => {
  const { address } = useAccount();

  const onSuccess = (data: unknown) => {
    console.log("Verification successful:", data);

    const unpackedProof = decodeAbiParameters(
      [{ type: "uint256[8]" }],
      data.proof,
    )[0];

    console.log("unpacked proof:", unpackedProof);
    // const app_id = process.env.APP_ID
    // const action = process.env.ACTION_ID
    console.log("unpacked proof", unpackedProof);
    // const verifyRes = (await verifyCloudProof(proof, app_id, action)) as IVerifyResponse
    console.log("Verification successful!");
  };

  return (
    <div>
      <IDKitWidget
        app_id={"app_a1836fb8049c3f0382dc11f0e667d1b3"}
        action={"verify"}
        signal={address}
        verification_level={VerificationLevel.Orb}
        onSuccess={onSuccess}
      >
        {({ open }) => (
          <button
            className="border p-2 rounded-lg hover:bg-gray-300"
            onClick={open}
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default WorldWidget;
