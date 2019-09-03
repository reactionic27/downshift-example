import React from 'react';
import ModuleAutoComplete from './module';
import InverterAutoComplete from './inverter';

class DownshiftExample extends React.Component {
  render() {
    return (
      <div>
        <ModuleAutoComplete />
        <InverterAutoComplete />
      </div>
    )
  }
}

export default DownshiftExample;
