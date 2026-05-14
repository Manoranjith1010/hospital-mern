import nodemailer from 'nodemailer';
import config from '../config/env.js';
import logger from './logger.js';

/**
 * Email service for sending notifications
 */
let transporter = null;

const initializeTransporter = () => {
  if (!config.email.host || !config.email.user) {
    logger.warn('Email configuration not available - email features disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  return transporter;
};

/**
 * Send appointment reminder
 */
export const sendAppointmentReminder = async (email, patientName, appointmentDate, appointmentTime, doctorName) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }
    if (!transporter) {
      logger.warn('Cannot send email - transporter not configured');
      return false;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Appointment Reminder',
      html: `
        <h2>Hello ${patientName},</h2>
        <p>This is a reminder for your upcoming appointment.</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p>Please arrive 15 minutes early.</p>
        <p>If you need to cancel, please do so at least 24 hours in advance.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Appointment reminder sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending appointment reminder:', error.message);
    return false;
  }
};

/**
 * Send appointment confirmation
 */
export const sendAppointmentConfirmation = async (email, patientName, appointmentDate, appointmentTime, doctorName) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }
    if (!transporter) {
      logger.warn('Cannot send email - transporter not configured');
      return false;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Appointment Confirmed',
      html: `
        <h2>Hello ${patientName},</h2>
        <p>Your appointment has been successfully confirmed.</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p>You will receive a reminder 24 hours before the appointment.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Appointment confirmation sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending appointment confirmation:', error.message);
    return false;
  }
};

/**
 * Send cancellation notification
 */
export const sendCancellationNotification = async (email, patientName, appointmentDate) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }
    if (!transporter) {
      logger.warn('Cannot send email - transporter not configured');
      return false;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Appointment Cancelled',
      html: `
        <h2>Hello ${patientName},</h2>
        <p>Your appointment scheduled for ${appointmentDate} has been cancelled.</p>
        <p>Please contact us to reschedule.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Cancellation notification sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending cancellation notification:', error.message);
    return false;
  }
};

/**
 * Send test result notification
 */
export const sendTestResultNotification = async (email, patientName, testName) => {
  try {
    if (!transporter) {
      initializeTransporter();
    }
    if (!transporter) {
      logger.warn('Cannot send email - transporter not configured');
      return false;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Test Results Available',
      html: `
        <h2>Hello ${patientName},</h2>
        <p>Your ${testName} results are now available.</p>
        <p>Please log in to your account to view the results.</p>
        <p>If you have any questions, please contact your doctor.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Test result notification sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Error sending test result notification:', error.message);
    return false;
  }
};

export default {
  sendAppointmentReminder,
  sendAppointmentConfirmation,
  sendCancellationNotification,
  sendTestResultNotification,
};
