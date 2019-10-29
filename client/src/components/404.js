import React from 'react';

export default function NoMatch({ location }) {
  return (
    <div>
      <h3>
        Error 404, No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}
