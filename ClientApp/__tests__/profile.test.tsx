import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '../services/axiosInstance';
import ProfilePage from '@/app/(tabs)/profile/index';
import { calculateAge } from '@/app/(tabs)/profile/index';
import { Provider } from 'react-redux';
import { store } from '@/state/store';

//TODO the Endpoint must be set to dynamic value /users/* or something else...


// Initialize axios-mock-adapter
const mock = new axiosMockAdapter(axiosInstance);

describe('ProfilePage Component', () => {

  const mockUserData = {
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Test Bio',
    email: "test@email.com",
    username: "userNameDefault",
    profile: "",
    dateOfBirth: '1995-08-13',
    phoneNumber: 555555555,
    ranking: 10,
    preferences: {
      notifications: true,
      language: "en"
    },
    dateCreated: new Date('2024-08-13'),
    updatedAt: new Date('2024-08-13'),
  };

  const expectedAge = calculateAge(mockUserData.dateOfBirth);

  afterEach(() => {
    mock.reset();
  });

  describe('Initial Loading State', () => {
    it('displays loading indicator initially', async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );

      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
    });
  });

  describe('User Profile Data Rendering', () => {
    it('renders user profile data with first and last name', async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('firstName')).toHaveTextContent('Placeholder Placeholder');
      });
    });

    it('displays age correctly based on date of birth', async () => {
      mock.onGet('/users/2').reply(200, mockUserData);

      render(<ProfilePage />);
      // Wait for loading to complete before proceeding
      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
      await waitFor(() => fireEvent.press(screen.getByTestId('About'))); // Navigate to About tab

      await waitFor(() => { expect(screen.getByTestId('Age')).toHaveTextContent(`Age: ${expectedAge}`); });
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      mock.onGet('/users/2').reply(200, mockUserData);
      render(
        <Provider store={store}>
          <ProfilePage />
        </Provider>
      );
      await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());
    });

    it('displays Activity, Stats, and About tabs', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('Activity')).toBeTruthy();
        expect(screen.getByTestId('Stats')).toBeTruthy();
        expect(screen.getByTestId('About')).toBeTruthy();
      });
    });

    it('navigates to the About tab and displays user information', async () => {
      await waitFor(() => fireEvent.press(screen.getByTestId('About')));

      await waitFor(() => {
        expect(screen.getByTestId('Bio')).toHaveTextContent('This is a short default bio description');
        expect(screen.getByTestId('email')).toHaveTextContent('default_email@example.com');
        expect(screen.getByTestId('phone')).toHaveTextContent('555555555');
      });
    });
  });
});
