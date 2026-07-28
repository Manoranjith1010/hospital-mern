import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Container, Card, CardBody, Button, Badge, Spinner } from '../components';
import { useNotification } from '../hooks/useNotification';
import { appointmentAPI } from '../api/services';
import { formatDate, formatTime, getStatusColor } from '../utils';

/**
 * Appointments page
 */
export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { notify } = useNotification();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? { status: filter } : {};
        const response = await appointmentAPI.getAll(params);
        setAppointments(response.data.data || []);
      } catch (error) {
        notify(error.message || 'Failed to fetch appointments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filter, notify]);

  const handleCancel = async (appointmentId) => {
    try {
      await appointmentAPI.cancel(appointmentId, 'Cancelled by patient');
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: 'CANCELLED' } : apt
        )
      );
      notify('Appointment cancelled successfully', 'success');
    } catch (error) {
      notify(error.message || 'Failed to cancel appointment', 'error');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Container className="flex justify-center py-12">
          <Spinner size="lg" />
        </Container>
      </MainLayout>
    );
  }

  const statuses = ['all', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];

  return (
    <MainLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments</h1>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <Badge variant={appointment.status === 'COMPLETED' ? 'success' : appointment.status === 'CANCELLED' ? 'danger' : 'primary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{appointment.doctor?.specialization}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        📅 {formatDate(appointment.appointmentDate, 'MMM dd, yyyy')} at {formatTime(appointment.appointmentTime)}
                      </p>
                      <p>📝 {appointment.reason}</p>
                    </div>
                  </div>

                  {appointment.status === 'SCHEDULED' && (
                    <div className="flex gap-2 ml-4">
                      <Button variant="secondary" size="sm">
                        Reschedule
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(appointment._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">No appointments found</p>
              <Button variant="primary" className="mt-4">
                Book New Appointment
              </Button>
            </CardBody>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
};

export default AppointmentsPage;
