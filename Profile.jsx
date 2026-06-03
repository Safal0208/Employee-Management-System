import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2>My Profile</h2>
      <table style={{ width: '100%', marginTop: '1rem' }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, width: '120px', padding: '0.75rem' }}>Name</td>
            <td style={{ padding: '0.75rem' }}>{user.name}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: '0.75rem' }}>Email</td>
            <td style={{ padding: '0.75rem' }}>{user.email}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600, padding: '0.75rem' }}>Role</td>
            <td style={{ padding: '0.75rem' }}>{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}