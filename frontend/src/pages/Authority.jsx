import React from 'react';
import ResourcePage from '../components/ResourcePage';
import { authorityService } from '../api/authorityService';

function AuthorityPage() {
  return (
    <ResourcePage
      service={authorityService}
      icon="🏛️"
      subtitle="Regulatory oversight, control rooms, and supervisory structure"
      validate={(formData, { data }) => {
        if (!formData.Works_Under) return null;
        const exists = data.some((authority) => authority.Authority_ID === Number(formData.Works_Under));
        return exists ? null : `Supervisor ID ${formData.Works_Under} does not exist.`;
      }}
    />
  );
}

export default AuthorityPage;
