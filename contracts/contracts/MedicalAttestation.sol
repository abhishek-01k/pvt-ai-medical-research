// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedicalAttestation is ISPHook, AccessControl {
    
    bytes32 public constant MEDICAL_PROFESSIONAL = keccak256("MEDICAL_PROFESSIONAL");
    bytes32 public constant RESEARCHER = keccak256("RESEARCHER");
    
    struct MedicalRecord {
        bytes32 patientId;
        uint256 timestamp;
        bytes32 diagnosisHash;
        bool isVerified;
    }
    
    mapping(bytes32 => MedicalRecord) public records;
    
    event MedicalRecordCreated(bytes32 indexed attestationId, bytes32 indexed patientId);
    event MedicalRecordVerified(bytes32 indexed attestationId);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function beforeAttestation(
        address attestor,
        bytes32 schemaId,
        bytes calldata data
    ) external override returns (bool) {
        require(hasRole(MEDICAL_PROFESSIONAL, attestor), "Not authorized");
        
        // Decode medical data from attestation
        (bytes32 patientId, bytes32 diagnosisHash) = abi.decode(data, (bytes32, bytes32));
        
        // Create new medical record
        records[schemaId] = MedicalRecord({
            patientId: patientId,
            timestamp: block.timestamp,
            diagnosisHash: diagnosisHash,
            isVerified: false
        });
        
        emit MedicalRecordCreated(schemaId, patientId);
        return true;
    }
    
    function afterAttestation(
        bytes32 attestationId,
        bytes32 schemaId
    ) external override {
        MedicalRecord storage record = records[schemaId];
        record.isVerified = true;
        emit MedicalRecordVerified(attestationId);
    }
}