// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {ISPHook} from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";

contract MedicalVisitHook is ISPHook, AccessControl {
  bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

  // Track patient visits
  mapping(address => uint256) public patientVisitCount;

  // Track attestation IDs for each patient
  mapping(address => mapping(uint256 => uint64))
    public patientVisitAttestations;

  event VisitRecorded(address indexed patient, uint64 attestationId);
  event RevocationProcessed(address indexed attester, uint64 attestationId);

  constructor() {}

  function didReceiveAttestation(
    address attester,
    uint64 schemaId,
    uint64 attestationId,
    bytes calldata extraData
  ) external payable override {
    // Ensure the attester has the DOCTOR_ROLE
    require(
      hasRole(DOCTOR_ROLE, attester),
      "Only doctors can create visit records"
    );

    // Retrieve attestation data from ISP
    Attestation memory attestation = ISP(_msgSender()).getAttestation(
      attestationId
    );

    // Decode patient address from extraData
    address patient = abi.decode(extraData, (address));

    // Record the visit
    uint256 visitIndex = patientVisitCount[patient];
    patientVisitAttestations[patient][visitIndex] = attestationId;
    patientVisitCount[patient]++;

    emit VisitRecorded(patient, attestationId);
  }

  /// @inheritdoc ISPHook
  function didReceiveAttestation(
    address attester,
    uint64 schemaId,
    uint64 attestationId,
    IERC20 resolverFeeERC20Token,
    uint256 resolverFeeERC20Amount,
    bytes calldata extraData
  ) external override {
    // Revert if this function is not intended to be used
    revert("Function not implemented");
  }

  /// @inheritdoc ISPHook
  function didReceiveRevocation(
    address attester,
    uint64 schemaId,
    uint64 attestationId,
    bytes calldata extraData
  ) external payable override {
    // Ensure the attester has the DOCTOR_ROLE
    require(
      hasRole(DOCTOR_ROLE, attester),
      "Only doctors can revoke visit records"
    );

    // Decode patient address from extraData
    address patient = abi.decode(extraData, (address));

    // Find and remove the attestation
    uint256 visitCount = patientVisitCount[patient];
    bool found = false;

    for (uint256 i = 0; i < visitCount; i++) {
      if (patientVisitAttestations[patient][i] == attestationId) {
        // Shift elements to remove the attestation
        for (uint256 j = i; j < visitCount - 1; j++) {
          patientVisitAttestations[patient][j] = patientVisitAttestations[
            patient
          ][j + 1];
        }
        delete patientVisitAttestations[patient][visitCount - 1];
        patientVisitCount[patient]--;
        found = true;
        break;
      }
    }

    require(found, "Attestation not found for the patient");
    emit RevocationProcessed(attester, attestationId);
  }

  /// @inheritdoc ISPHook
  function didReceiveRevocation(
    address attester,
    uint64 schemaId,
    uint64 attestationId,
    IERC20 resolverFeeERC20Token,
    uint256 resolverFeeERC20Amount,
    bytes calldata extraData
  ) external override {
    // Revert if this function is not intended to be used
    revert("Function not implemented");
  }

  // Get a patient's visit history
  function getPatientVisits(
    address patient
  ) external view returns (uint64[] memory) {
    uint256 count = patientVisitCount[patient];
    uint64[] memory visits = new uint64[](count);

    for (uint256 i = 0; i < count; i++) {
      visits[i] = patientVisitAttestations[patient][i];
    }

    return visits;
  }
}
