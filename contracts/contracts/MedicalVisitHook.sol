// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedicalVisitHook is ISPHook, AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    
    // Track patient visits
    mapping(address => uint256) public patientVisitCount;

    // track attestation ids for each patient
    // 0x1234 -> [attestationId1, attestationId2, attestationId3]
    mapping(address => mapping(uint256 => uint64)) public patientVisitAttestations;
    
    event VisitRecorded(address indexed patient, uint64 attestationId);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        bytes calldata extraData
    ) external payable override {
        require(hasRole(DOCTOR_ROLE, attester), "Only doctors can create visit records");
        


        Attestation memory attestation = ISP(_msgSender()).getAttestation(attestationId);
        
        // Decode patient address from extraData
        address patient = abi.decode(extraData, (address));
        
        // Record visit
        uint256 visitIndex = patientVisitCount[patient];
        patientVisitAttestations[patient][visitIndex] = attestationId;
        patientVisitCount[patient]++;
        
        emit VisitRecorded(patient, attestationId);
    }
    
    // Get patient's visit history
    function getPatientVisits(address patient) external view returns (uint64[] memory) {
        uint256 count = patientVisitCount[patient];
        uint64[] memory visits = new uint64[](count);
        
        for(uint256 i = 0; i < count; i++) {
            visits[i] = patientVisitAttestations[patient][i];
        }
        
        return visits;
    }
}