import * as React from 'react';
import {
  TreeGridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  Sort,
  Reorder,
  Inject,
} from '@syncfusion/ej2-react-treegrid';
// import './treegrid-overview.css';
import { RatingComponent } from '@syncfusion/ej2-react-inputs';

const Sync = () => {
  const gridTemplate = (props) => {
    var flagIconLocation = props.parentItem
      ? props.parentItem.name
      : props.name;
    return (
      <div style={{ display: 'inline' }}>
        <div style={{ display: 'inline-block' }}>
          <img
            className='e-image'
            src={'src/treegrid/images/' + flagIconLocation + '.png'}
            alt={flagIconLocation}
          ></img>
        </div>
        <div style={{ display: 'inline-block', paddingLeft: '6px' }}>
          {props.name}
        </div>
      </div>
    );
  };

  const treegridTemplate = (props) => {
    if (props.gdp < 2) {
      return (
        <div className='statustemp e-lowgdp'>
          <span className='statustxt e-lowgdp'>{props.gdp} %</span>
        </div>
      );
    } else {
      return (
        <div className='statustemp'>
          <span className='statustxt'>{props.gdp} %</span>
        </div>
      );
    }
  };

  const treeratingTemplate = (props) => {
    return (
      <div>
        <RatingComponent
          value={props.rating}
          cssClass={'custom-rating'}
          readOnly={true}
        />
      </div>
    );
  };

  const treeunemployTemplate = (props) => {
    return (
      <div id='myProgress' className='pbar'>
        {props.unemployment <= 4 ? (
          <div
            id='myBar'
            className='bar progressdisable'
            style={{ width: props.unemployment * 10 + '%' }}
          >
            <div id='pbarlabel' className='barlabel'>
              {props.unemployment + '%'}
            </div>
          </div>
        ) : (
          <div
            id='myBar'
            className='bar'
            style={{ width: props.unemployment * 10 + '%' }}
          >
            <div id='pbarlabel' className='barlabel'>
              {props.unemployment + '%'}
            </div>
          </div>
        )}
      </div>
    );
  };

  const treelocationTemplate = (props) => {
    var locationsrc = 'src/treegrid/images/Map.png';
    return (
      <div id='coordinates'>
        <img src={locationsrc} className='e-image' alt={props.coordinates} />
        <a target='_blank' href='https://www.google.com/maps/place/'>
          {props.coordinates}
        </a>
      </div>
    );
  };

  const treeareaTemplate = (props) => {
    return (
      <span>
        {props.area} km<sup>2</sup>
      </span>
    );
  };

  const treezoneTemplate = (props) => {
    let classValue = '';
    if (props.timezone.indexOf('-') !== -1) {
      classValue = 'negativeTimeZone';
    }
    return (
      <div>
        <img
          src='src/treegrid/images/__Normal.png'
          style={{ filter: 'brightness(150%)' }}
          className={classValue}
        ></img>
        <span style={{ paddingLeft: '7px' }}>{props.timezone}</span>)
      </div>
    );
  };

  const populationValue = (field, data) => {
    return data[field] / 1000000;
  };
  let flagtemplate = gridTemplate;
  let gdptemplate = treegridTemplate;
  let ratingtemplate = treeratingTemplate;
  let unemploymentTemplate = treeunemployTemplate;
  let locationtemplate = treelocationTemplate;
  let areatemplate = treeareaTemplate;
  let timezonetemplate = treezoneTemplate;

  const provinceFilter = {
    type: 'Excel',
    itemTemplate: flagtemplate,
  };
  const staticData = [
    {
      id: '1',
      name: 'United States',
      population: 331000000,
      gdp: 21.5,
      rating: 5,
      unemployment: 3.5,
      coordinates: '37.0902° N, 95.7129° W',
      area: 9833520,
      timezone: 'UTC-5',
      states: [
        {
          id: '1.1',
          name: 'California',
          population: 39510000,
          gdp: 2.5,
          rating: 4,
          unemployment: 4.5,
          coordinates: '36.7783° N, 119.4179° W',
          area: 423970,
          timezone: 'UTC-8',
        },
        // Add more states as needed
      ],
    },
    {
      id: '2',
      name: 'Canada',
      population: 38000000,
      gdp: 1.6,
      rating: 3,
      unemployment: 5.5,
      coordinates: '60.0° N, 95.0° W',
      area: 9984670,
      timezone: 'UTC-5',
      states: [
        {
          id: '2.1',
          name: 'Alberta',
          population: 4400000,
          gdp: 1.2,
          rating: 2,
          unemployment: 6.5,
          coordinates: '53.9333° N, 116.5762° W',
          area: 661848,
          timezone: 'UTC-7',
        },
        // Add more states as needed
      ],
    },
    // Add more countries as needed
  ];
  return (
    <div className='control-pane'>
      <div className='control-section'>
        <TreeGridComponent
          dataSource={staticData}
          childMapping='states'
          height='400'
          allowReordering={true}
          allowFiltering={true}
          allowSorting={true}
          filterSettings={{ type: 'Menu', hierarchyMode: 'Parent' }}
        >
          <ColumnsDirective>
            <ColumnDirective
              field='name'
              headerText='Province'
              width='195'
              template={flagtemplate}
              filter={provinceFilter}
            ></ColumnDirective>
            <ColumnDirective
              field='population'
              headerText='Population (Million)'
              allowFiltering={false}
              valueAccessor={populationValue}
              textAlign='Right'
              width='200'
            ></ColumnDirective>
            <ColumnDirective
              field='gdp'
              headerText='GDP Rate %'
              width='155'
              template={gdptemplate}
            />
            <ColumnDirective
              field='rating'
              headerText='Credit Rating'
              width='190'
              template={ratingtemplate}
            />
            <ColumnDirective
              field='unemployment'
              headerText='Unemployment Rate'
              width='200'
              allowFiltering={false}
              template={unemploymentTemplate}
            />
            <ColumnDirective
              field='coordinates'
              headerText='Coordinates'
              allowSorting={false}
              width='220'
              template={locationtemplate}
            />
            <ColumnDirective
              field='area'
              headerText='Area'
              width='140'
              template={areatemplate}
            />
            <ColumnDirective
              field='timezone'
              headerText='Time Zone'
              width='150'
              template={timezonetemplate}
            />
          </ColumnsDirective>
          <Inject services={[Filter, Sort, Reorder]} />
        </TreeGridComponent>
      </div>
    </div>
  );
};

export default Sync;
