import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Container, Card, CardBody, Table, TableHead, TableBody, TableRow, TableCell, Spinner, Button } from '../components';
import { useNotification } from '../hooks/useNotification';
import { doctorAPI } from '../api/services';
import { formatCurrency } from '../utils';

/**
 * Doctors listing page
 */
export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const { notify } = useNotification();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const params = specialization ? { specialization } : {};
        const response = await doctorAPI.getAll(params);
        setDoctors(response.data.data || []);
      } catch (error) {
        notify(error.message || 'Failed to fetch doctors', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialization, notify]);

  const specializations = ['CARDIOLOGY', 'NEUROLOGY', 'ORTHOPEDICS', 'DERMATOLOGY', 'PEDIATRICS'];

  if (loading) {
    return (
      <MainLayout>
        <Container className="flex justify-center py-12">
          <Spinner size="lg" />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Doctors</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSpecialization('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !specialization
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSpecialization(spec)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  specialization === spec
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id}>
              <CardBody>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {doctor.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-gray-700">Experience:</span> {doctor.yearsOfExperience} years
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Fee:</span> {formatCurrency(doctor.consultationFee)}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Rating:</span> ⭐ {doctor.rating}/5
                  </p>
                </div>

                <Button variant="primary" className="w-full mt-4">
                  Book Appointment
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {doctors.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600">No doctors found</p>
            </CardBody>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
};

export default DoctorsPage;
