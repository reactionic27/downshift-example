import React from 'react';
import ModuleAutoComplete from './module';
import InverterAutoComplete from './inverter';

class DownshiftExample extends React.Component {
  render() {
    return (
      <div>
        <ModuleAutoComplete {...this.props} />
        <InverterAutoComplete {...this.props} />
      </div>
    )
  }
}

export default DownshiftExample;
