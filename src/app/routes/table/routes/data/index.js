import React from 'react';
import CardBox from 'components/CardBox/index';
import IntlMessages from 'util/IntlMessages';
import DataTable from './Components/DataTable';
import CustomTable from './Components/CustomTable';
import CustomizedTable from './Components/CustomizedTable';

const DataTables = () => {
  return (
    <div className="row animated slideInUpTiny animation-duration-3">
      <CardBox styleName="col-12" cardStyle=" p-0" heading={<IntlMessages id="table.sortingTable"/>}
               headerOutside>
        <DataTable/>
      </CardBox>
      <CardBox styleName="col-12" cardStyle=" p-0" heading={<IntlMessages id="table.customTable"/>}
               headerOutside>
        <CustomTable/>
      </CardBox>
      <CardBox styleName="col-12" cardStyle="mb-0 p-0" heading={<IntlMessages id="table.customizedTable"/>}
               headerOutside>
        <CustomizedTable/>
      </CardBox>
    </div>

  );
};

export default DataTables;

