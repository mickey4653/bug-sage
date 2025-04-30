// Mock the Clerk authentication hooks
module.exports = {
  useUser: jest.fn().mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user',
      fullName: 'Test User',
      primaryEmailAddress: {
        emailAddress: 'test@example.com',
        id: 'email_123',
        verification: { status: 'verified' }
      },
      primaryEmailAddressId: 'email_123',
      primaryPhoneNumber: null,
      primaryPhoneNumberId: null,
      externalId: 'ext_123',
      imageUrl: '',
      username: 'testuser',
      publicMetadata: {},
      privateMetadata: {},
      unsafeMetadata: {},
      emailAddresses: [],
      phoneNumbers: [],
      web3Wallets: [],
      externalAccounts: [],
      samlAccounts: [],
      organizationMemberships: [],
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
      hasImage: false,
      twoFactorEnabled: false,
      passwordEnabled: true,
      totpEnabled: false,
      backupCodeEnabled: false,
      banned: false,
    },
  }),

  useAuth: jest.fn().mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user',
    sessionId: 'session_123',
    actor: null,
    orgId: 'org_123',
    orgRole: 'admin',
    orgSlug: 'test-org',
    has: jest.fn(),
    signOut: jest.fn(),
    getToken: jest.fn().mockResolvedValue('test-token'),
  }),

  ClerkProvider: ({ children }) => children,
  SignedIn: ({ children }) => children,
  SignedOut: () => null,
  
  // Add other clerk components as needed
}; 