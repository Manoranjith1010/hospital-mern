import { asyncHandler } from '../middleware/errorHandler.js';
import medicalRecordService from '../services/medicalRecordService.js';
import { getPaginationParams } from '../utils/helpers.js';

/**
 * Medical Record controller
 */

/**
 * @desc Get all medical records
 * @route GET /api/medical-records
 * @access Private/Admin
 */
export const getAllRecords = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const result = await medicalRecordService.getAllRecords({
    limit,
    skip,
    sortBy: req.query.sortBy || '-recordDate',
    patientId: req.query.patientId,
    recordType: req.query.recordType,
  });

  res.status(200).json({
    success: true,
    data: result.records,
    pagination: result.pagination,
  });
});

/**
 * @desc Get record by ID
 * @route GET /api/medical-records/:id
 * @access Private
 */
export const getRecordById = asyncHandler(async (req, res) => {
  const record = await medicalRecordService.getRecordById(req.params.id);

  res.status(200).json({
    success: true,
    data: record,
  });
});

/**
 * @desc Create medical record
 * @route POST /api/medical-records
 * @access Private/Doctor
 */
export const createRecord = asyncHandler(async (req, res) => {
  const { patientId, doctorId, recordType, title, description, findings, diagnosis, treatment, medications } = req.body;

  // Validate required fields
  if (!patientId || !doctorId || !recordType || !title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  const recordData = {
    patient: patientId,
    doctor: doctorId,
    recordType,
    title,
    description,
    findings,
    diagnosis,
    treatment,
    medications: medications || [],
  };

  const record = await medicalRecordService.createRecord(recordData);

  res.status(201).json({
    success: true,
    message: 'Medical record created successfully',
    data: record,
  });
});

/**
 * @desc Update medical record
 * @route PUT /api/medical-records/:id
 * @access Private/Doctor
 */
export const updateRecord = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.patient;
  delete updateData.doctor;

  const record = await medicalRecordService.updateRecord(req.params.id, updateData);

  res.status(200).json({
    success: true,
    message: 'Medical record updated successfully',
    data: record,
  });
});

/**
 * @desc Get patient medical records
 * @route GET /api/medical-records/patient/:patientId
 * @access Private
 */
export const getPatientRecords = asyncHandler(async (req, res) => {
  const records = await medicalRecordService.getPatientRecords(req.params.patientId);

  res.status(200).json({
    success: true,
    data: records,
  });
});

/**
 * @desc Delete medical record
 * @route DELETE /api/medical-records/:id
 * @access Private/Admin/Doctor
 */
export const deleteRecord = asyncHandler(async (req, res) => {
  const result = await medicalRecordService.deleteRecord(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export default {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  getPatientRecords,
  deleteRecord,
};
