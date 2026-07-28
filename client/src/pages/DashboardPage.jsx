import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Container, Card, CardBody, Grid, Section } from '../components';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard page
 */
export const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Patients', value: '1,234', icon: '👥' },
    { label: 'Appointments Today', value: '23', icon: '📅' },
    { label: 'Available Doctors', value: '45', icon: '👨‍⚕️' },
    { label: 'Pending Reports', value: '12', icon: '📄' },
  ];

  return (
    <MainLayout>
      <Container>
        <Section title={`Welcome back, ${user?.firstName}!`} subtitle="Here's what's happening today">
          <Grid cols={2}>
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardBody className="flex items-center gap-4">
                  <div className="text-4xl">{stat.icon}</div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Section>

        <Section title="Quick Actions" className="mt-12">
          <Grid cols={3} gap={3}>
            {user?.role === 'ADMIN' && (
              <>
                <Card>
                  <CardBody className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-900">Manage Patients</h3>
                    <p className="text-sm text-gray-600 mt-2">View and manage patient records</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">👨‍⚕️</div>
                    <h3 className="font-semibold text-gray-900">Manage Doctors</h3>
                    <p className="text-sm text-gray-600 mt-2">Manage doctor profiles and schedules</p>
                  </CardBody>
                </Card>
              </>
            )}
            {user?.role === 'PATIENT' && (
              <>
                <Card>
                  <CardBody className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="font-semibold text-gray-900">Find Doctors</h3>
                    <p className="text-sm text-gray-600 mt-2">Search for specialists</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3">📅</div>
                    <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                    <p className="text-sm text-gray-600 mt-2">Schedule your next visit</p>
                  </CardBody>
                </Card>
              </>
            )}
          </Grid>
        </Section>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
