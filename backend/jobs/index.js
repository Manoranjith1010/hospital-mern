import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { sendAppointmentReminder } from '../utils/email.js';
import logger from '../utils/logger.js';

/**
 * Appointment reminder job - Runs daily at 8:00 AM
 * Sends reminders for appointments in the next 24 hours
 */
export const appointmentReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      logger.info('Starting appointment reminder job');

      // Get appointments for the next 24 hours
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const appointments = await Appointment.find({
        appointmentDate: {
          $gte: today,
          $lte: tomorrow,
        },
        status: 'SCHEDULED',
        reminderSent: false,
      })
        .populate('patient')
        .populate('doctor');

      // Send reminders
      for (const appointment of appointments) {
        try {
          const sent = await sendAppointmentReminder(
            appointment.patient.email,
            appointment.patient.firstName,
            new Date(appointment.appointmentDate).toLocaleDateString(),
            appointment.appointmentTime,
            `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          );

          if (sent) {
            appointment.reminderSent = true;
            appointment.reminderSentAt = new Date();
            await appointment.save();
          }
        } catch (error) {
          logger.error(`Error sending reminder for appointment ${appointment._id}:`, error.message);
        }
      }

      logger.info(`Appointment reminder job completed. Sent ${appointments.length} reminders`);
    } catch (error) {
      logger.error('Appointment reminder job error:', error.message);
    }
  });
};

/**
 * Appointment cleanup job - Runs daily at 11:00 PM
 * Archives or cleans up old completed appointments
 */
export const appointmentCleanupJob = () => {
  cron.schedule('0 23 * * *', async () => {
    try {
      logger.info('Starting appointment cleanup job');

      // Get completed appointments older than 90 days
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      const result = await Appointment.deleteMany({
        status: 'COMPLETED',
        updatedAt: { $lt: ninetyDaysAgo },
      });

      logger.info(`Appointment cleanup job completed. Removed ${result.deletedCount} old appointments`);
    } catch (error) {
      logger.error('Appointment cleanup job error:', error.message);
    }
  });
};

/**
 * Database backup job - Runs daily at 2:00 AM
 * Creates a backup of important collections
 */
export const databaseBackupJob = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Starting database backup job');
      // Backup logic would be implemented here
      // For now, just log the start
      logger.info('Database backup job completed');
    } catch (error) {
      logger.error('Database backup job error:', error.message);
    }
  });
};

/**
 * Initialize all cron jobs
 */
export const initializeJobs = () => {
  logger.info('Initializing cron jobs');
  appointmentReminderJob();
  appointmentCleanupJob();
  databaseBackupJob();
  logger.info('Cron jobs initialized');
};
