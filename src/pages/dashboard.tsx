import React, { useEffect } from 'react';
import { Card, Col, Row, Select, DatePicker } from 'antd';
import type { TableProps, DatePickerProps } from 'antd';
import { config } from '../config';
import { Column } from '@ant-design/plots';

interface FieldSums {
  [key: string]: number;
}

interface DataItem {
  [key: string]: string | number | null;
}

const Dashboard: React.FC = () => {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [cabang, setCabang] = React.useState<string>('');
  const [site, setSite] = React.useState<string>('');
  const [bangunan, setBangunan] = React.useState<string>('all');
  const [optionsCabang, setOptionsCabang] = React.useState<any[]>([]);
  const [optionsSite, setOptionsSite] = React.useState<any[]>([]);
  const [optionsBangunan, setOptionsBangunan] = React.useState<any[]>([
    { value: 'all', label: 'All' },
    {
      value: 'office',
      label: 'Office',
    },
    {
      value: 'workshop',
      label: 'Workshop',
    },
    {
      value: 'warehouse',
      label: 'Warehouse',
    },
    {
      value: 'mess',
      label: 'Mess',
    },
  ]);
  const [chartConfigApar, setChartConfigApar] = React.useState<any>();
  const [chartConfigDetector, setChartConfigDetector] = React.useState<any>();
  const [chartOptions, setChartOptions] = React.useState<any>({});
  const [luasArea, setLuasArea] = React.useState<number>(0);
  const [luasAreaBangunan, setLuasAreaBangunan] = React.useState<number>(0);
  const [kepemilikanBangunan, setKepemilikanBangunan] =
    React.useState<string>('');
  const [luasOffice, setLuasOffice] = React.useState<number>(0);
  const [luasWorkshop, setLuasWorkshop] = React.useState<number>(0);
  const [luasWarehouse, setLuasWarehouse] = React.useState<number>(0);
  const [luasMess, setLuasMess] = React.useState<number>(0);
  const [statusKepemilikanTanah, setStatusKepemilikanTanah] =
    React.useState<number>(0);
  const [jmlManPower, setJmlManPower] = React.useState<number>(0);
  const [namaBMSM, setNamaBMSM] = React.useState<string>('');
  const [namaADH, setNamaADH] = React.useState<string>('');
  const [namaESROfficerLeader, setNamaESROfficerLeader] =
    React.useState<any>('');

  useEffect(() => {
    getDataCabang();
  }, []);

  const getDataCabang = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(`${config.apiUrl}/master-cabang/get`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include bearer token in the headers
        'Content-Type': 'application/json',
        'client-id': config.clientID,
        'client-secret': config.clientSecret,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          localStorage.removeItem('isLogin');
          localStorage.removeItem('name');
          localStorage.removeItem('rolename');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const cabangs = data.data.map((item: any) => item._id);
        const result = cabangs.map((item: any) => {
          return { value: item, label: item };
        });
        setOptionsCabang(result);

        getDataSite(result[0].value);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const getDataSite = (cabang: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(`${config.apiUrl}/master-site/get`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include bearer token in the headers
        'Content-Type': 'application/json',
        'client-id': config.clientID,
        'client-secret': config.clientSecret,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          localStorage.removeItem('isLogin');
          localStorage.removeItem('name');
          localStorage.removeItem('rolename');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        const sites = data.data.map((item: any) => item._id);
        const result = sites.map((item: any) => {
          return { value: item, label: item };
        });
        setOptionsSite(result);
        fetchData(cabang, result[0].value, bangunan, year, month);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const onChangeYear: DatePickerProps['onChange'] = (date, dateString) => {
    setYear(new Date(dateString as string).getFullYear());
    fetchData(
      cabang,
      site,
      bangunan,
      new Date(dateString as string).getFullYear(),
      month
    );
  };

  const onChangeMonth: DatePickerProps['onChange'] = (date, dateString) => {
    setMonth(new Date(dateString as string).getMonth() + 1);
    fetchData(
      cabang,
      site,
      bangunan,
      year,
      new Date(dateString as string).getMonth() + 1
    );
  };

  const handleChangeCabang = (value: any) => {
    setCabang(value);
    fetchData(
      value,
      site ? site : optionsSite[0].value,
      bangunan ? bangunan : optionsBangunan[0].value,
      year,
      month
    );
  };

  const handleChangeSite = (value: any) => {
    setSite(value);
    fetchData(
      cabang ? cabang : optionsCabang[0].value,
      value,
      bangunan ? bangunan : optionsBangunan[0].value,
      year,
      month
    );
  };

  const handleChangeBangunan = (value: any) => {
    setBangunan(value);
    fetchData(
      cabang ? cabang : optionsCabang[0].value,
      site ? site : optionsSite[0].value,
      value,
      year,
      month
    );
  };

  const calculateSumForFields = (
    array: DataItem[],
    fields: string[]
  ): FieldSums => {
    const sums: FieldSums = {};

    // Initialize sums object with 0 for each field
    fields.forEach((field) => (sums[field] = 0));

    // Iterate over each object in the array and accumulate the sums
    array.forEach((item) => {
      fields.forEach((field) => {
        // Parse the value to integer and add it to the corresponding sum
        sums[field] += !isNaN(parseInt(String(item[field]) || '0'))
          ? parseInt(String(item[field]) || '0')
          : 0;
      });
    });

    return sums;
  };

  const fetchData = (
    cabang: string,
    site: string,
    bangunan: string,
    year: number,
    month: number
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(
      `${config.apiUrl}/proteksi-kebakaran-dash/get?role=${localStorage.getItem(
        'rolename'
      )}&year=${year}&month=${month}&cabang=${cabang}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include bearer token in the headers
          'Content-Type': 'application/json',
          'client-id': config.clientID,
          'client-secret': config.clientSecret,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          localStorage.removeItem('isLogin');
          localStorage.removeItem('name');
          localStorage.removeItem('rolename');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setLuasArea(data.data[0]?.luas_tanah_keseluruhan);
        setJmlManPower(data.data[0]?.jumlah_karyawan);
        setStatusKepemilikanTanah(data.data[0]?.status_kepemilikan_area);
        setNamaBMSM(data.data[0]?.nama_BM_SM);
        setNamaADH(data.data[0]?.nama_ADH);
        setNamaESROfficerLeader(data.data[0]?.nama_ESR_Officer_Leader);

        setLuasOffice(data.office[0] ? data.office[0].luas_bangunan : 0);
        setLuasWorkshop(data.workshop[0] ? data.workshop[0].luas_bangunan : 0);
        setLuasWarehouse(
          data.warehouse[0] ? data.warehouse[0].luas_bangunan : 0
        );
        setLuasMess(data.mess[0] ? data.mess[0].luas_bangunan : 0);

        const fieldsToSum = [
          'push_button_tersedia',
          'push_button_kecukupan',
          'push_button_kesiapan',
          'heat_detector_tersedia',
          'heat_detector_kecukupan',
          'heat_detector_kesiapan',

          'smoke_detector_tersedia',
          'smoke_detector_kecukupan',
          'smoke_detector_kesiapan',

          'alarm_kebakaran_tersedia',
          'alarm_kebakaran_kecukupan',
          'alarm_kebakaran_kesiapan',

          'sprinkler_tersedia',
          'sprinkler_kecukupan',
          'sprinkler_kesiapan',

          'apar_AF11_tersedia',
          'apar_AF11_kecukupan',
          'apar_AF11_kesiapan',
          'apar_WATER_tersedia',
          'apar_WATER_kecukupan',
          'apar_WATER_kesiapan',
          'apar_Foam_AFFF_tersedia',
          'apar_Foam_AFFF_kecukupan',
          'apar_Foam_AFFF_kesiapan',

          'apar_Dry_Chemical_Powder_tersedia',
          'apar_Dry_Chemical_Powder_kecukupan',
          'apar_Dry_Chemical_Powder_kesiapan',

          'apar_CO2_tersedia',
          'apar_CO2_kecukupan',
          'apar_CO2_kesiapan',

          'volume_water_tank_tersedia',
          'volume_water_tank_kecukupan',
          'volume_water_tank_kesiapan',

          'hydrant_portable_tersedia',
          'hydrant_portable_kecukupan',
          'hydrant_portable_kesiapan',

          'jockey_pump_tersedia',
          'jockey_pump_kecukupan',
          'jockey_pump_kesiapan',

          'electric_pump_tersedia',
          'electric_pump_kecukupan',
          'electric_pump_kesiapan',

          'diesel_pump_tersedia',
          'diesel_pump_kecukupan',
          'diesel_pump_kesiapan',

          'hydrant_dlm_gedung_tersedia',
          'hydrant_dlm_gedung_kecukupan',
          'hydrant_dlm_gedung_kesiapan',

          'hydrant_pillar_tersedia',
          'hydrant_pillar_kecukupan',
          'hydrant_pillar_kesiapan',

          'hydrant_hoose_25_tersedia',
          'hydrant_hoose_25_kecukupan',
          'hydrant_hoose_25_kesiapan',

          'hydrant_hoose_15_tersedia',
          'hydrant_hoose_15_kecukupan',
          'hydrant_hoose_15_kesiapan',

          'nozle_25_tersedia',
          'nozle_25_kecukupan',
          'nozle_25_kesiapan',

          'nozle_15_tersedia',
          'nozle_15_kecukupan',
          'nozle_15_kesiapan',

          'kunci_hydrant_pillar_tersedia',
          'kunci_hydrant_pillar_kecukupan',
          'kunci_hydrant_pillar_kesiapan',
        ];

        // Calculate sums for each category
        const sumsOffice = calculateSumForFields(data.office, fieldsToSum);
        const sumsWorkshop = calculateSumForFields(data.workshop, fieldsToSum);
        const sumsWarehouse = calculateSumForFields(
          data.warehouse,
          fieldsToSum
        );
        const sumsMess = calculateSumForFields(data.mess, fieldsToSum);

        const configApar = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Dry Chemical',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Dry_Chemical_Powder_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Dry_Chemical_Powder_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Dry_Chemical_Powder_tersedia
                    : sumsMess.apar_Dry_Chemical_Powder_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'Co2',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_CO2_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_CO2_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_CO2_tersedia
                    : sumsMess.apar_CO2_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'AFF11',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_AF11_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_AF11_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_AF11_tersedia
                    : sumsMess.apar_AF11_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'AFFF',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Foam_AFFF_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Foam_AFFF_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Foam_AFFF_tersedia
                    : sumsMess.apar_Foam_AFFF_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Dry Chemical',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Dry_Chemical_Powder_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Dry_Chemical_Powder_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Dry_Chemical_Powder_kesiapan
                    : sumsMess.apar_Dry_Chemical_Powder_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'Co2',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_CO2_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_CO2_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_CO2_kesiapan
                    : sumsMess.apar_CO2_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'AFF11',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_AF11_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_AF11_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_AF11_kesiapan
                    : sumsMess.apar_AF11_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'AFFF',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Foam_AFFF_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Foam_AFFF_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Foam_AFFF_kesiapan
                    : sumsMess.apar_Foam_AFFF_kesiapan,
              },

              {
                status: 'Kecukupan',
                unit: 'Dry Chemical',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Dry_Chemical_Powder_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Dry_Chemical_Powder_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Dry_Chemical_Powder_kecukupan
                    : sumsMess.apar_Dry_Chemical_Powder_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'Co2',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_CO2_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_CO2_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_CO2_kecukupan
                    : sumsMess.apar_CO2_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'AFF11',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_AF11_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_AF11_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_AF11_kecukupan
                    : sumsMess.apar_AF11_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'AFFF',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.apar_Foam_AFFF_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.apar_Foam_AFFF_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.apar_Foam_AFFF_kecukupan
                    : sumsMess.apar_Foam_AFFF_kecukupan,
              },
            ],
          },
          xField: 'unit',
          yField: 'jumlah',
          colorField: 'status',
          group: true,
          style: {
            inset: 5,
          },
        };

        const configDetector = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Heat Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.heat_detector_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.heat_detector_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.heat_detector_tersedia
                    : sumsMess.heat_detector_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'Smoke Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.smoke_detector_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.smoke_detector_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.smoke_detector_tersedia
                    : sumsMess.smoke_detector_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'Push Button',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.push_button_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.push_button_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.push_button_tersedia
                    : sumsMess.push_button_tersedia,
              },
              {
                status: 'Ketersediaan',
                unit: 'Springkler',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.sprinkler_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.sprinkler_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.sprinkler_tersedia
                    : sumsMess.sprinkler_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Heat Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.heat_detector_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.heat_detector_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.heat_detector_kesiapan
                    : sumsMess.heat_detector_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'Smoke Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.smoke_detector_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.smoke_detector_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.smoke_detector_kesiapan
                    : sumsMess.smoke_detector_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'Push Button',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.push_button_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.push_button_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.push_button_kesiapan
                    : sumsMess.push_button_kesiapan,
              },
              {
                status: 'Kesiapan',
                unit: 'Springkler',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.sprinkler_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.sprinkler_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.sprinkler_kesiapan
                    : sumsMess.sprinkler_kesiapan,
              },

              {
                status: 'Kecukupan',
                unit: 'Heat Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.heat_detector_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.heat_detector_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.heat_detector_kecukupan
                    : sumsMess.heat_detector_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'Smoke Detector',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.smoke_detector_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.smoke_detector_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.smoke_detector_kecukupan
                    : sumsMess.smoke_detector_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'Push Button',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.push_button_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.push_button_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.push_button_kecukupan
                    : sumsMess.push_button_kecukupan,
              },
              {
                status: 'Kecukupan',
                unit: 'Springkler',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.sprinkler_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.sprinkler_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.sprinkler_kecukupan
                    : sumsMess.sprinkler_kecukupan,
              },
            ],
          },
          xField: 'unit',
          yField: 'jumlah',
          colorField: 'status',
          group: true,
          style: {
            inset: 5,
          },
        };
        setChartConfigApar(configApar);
        setChartConfigDetector(configDetector);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    fetch(
      `${
        config.apiUrl
      }/proteksi-kebakaran-dashboard-area/get?role=${localStorage.getItem(
        'rolename'
      )}&year=${year}&month=${month}&cabang=${cabang}&bangunan=${bangunan}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include bearer token in the headers
          'Content-Type': 'application/json',
          'client-id': config.clientID,
          'client-secret': config.clientSecret,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 401) {
          localStorage.removeItem('isLogin');
          localStorage.removeItem('name');
          localStorage.removeItem('rolename');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setLuasAreaBangunan(data.data[0]?.luas_bangunan);
        setKepemilikanBangunan(data.data[0]?.status_kepemilikan_area);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const cardStyle = {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adjust shadow properties as needed
    borderRadius: '8px', // Optional: Add border radius for rounded corners
    height: 440,
  };
  return (
    <>
      <Select
        defaultValue={
          optionsCabang[0] ? optionsCabang[0].value : 'Please Select'
        }
        style={{ width: 150, margin: 16 }}
        onChange={handleChangeCabang}
        options={optionsCabang}
      />
      <Select
        defaultValue={optionsSite[0] ? optionsSite[0].value : 'Please Select'}
        style={{ width: 150, margin: 16 }}
        onChange={handleChangeSite}
        options={optionsSite}
      />
      <Select
        defaultValue={'all'}
        style={{ width: 150, margin: 16 }}
        onChange={handleChangeBangunan}
        options={optionsBangunan}
      />
      <DatePicker
        onChange={onChangeMonth}
        picker="month"
        style={{ margin: 16 }}
      />
      <DatePicker
        onChange={onChangeYear}
        picker="year"
        style={{ margin: 16 }}
      />
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={8}>
          <p style={{ textAlign: 'left' }}>Nama BM/SM: {namaBMSM}</p>
        </Col>
        <Col span={8}>
          <p style={{ textAlign: 'left' }}>Nama ADH: {namaADH}</p>
        </Col>
        <Col span={8}>
          <p style={{ textAlign: 'left' }}>
            Nama ESR Officer/Leader: {namaESROfficerLeader}
          </p>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={8}>
          <Card style={cardStyle}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'max-content auto',
                rowGap: '5px',
              }}
            >
              <p style={{ textAlign: 'left' }}>Luas Area</p>
              <p style={{ textAlign: 'left' }}>: {luasArea}</p>

              {bangunan === 'office' && (
                <>
                  <p style={{ textAlign: 'left' }}>Luas Office</p>
                  <p style={{ textAlign: 'left' }}>: {luasAreaBangunan}</p>
                  <p style={{ textAlign: 'left' }}>Status kepemilikan</p>
                  <p style={{ textAlign: 'left' }}>: {kepemilikanBangunan}</p>
                </>
              )}
              {bangunan === 'workshop' && (
                <>
                  <p style={{ textAlign: 'left' }}>Luas Workshop</p>
                  <p style={{ textAlign: 'left' }}>: {luasAreaBangunan}</p>
                  <p style={{ textAlign: 'left' }}>Status kepemilikan</p>
                  <p style={{ textAlign: 'left' }}>: {kepemilikanBangunan}</p>
                </>
              )}

              {bangunan === 'warehouse' && (
                <>
                  <p style={{ textAlign: 'left' }}>Luas Warehouse</p>
                  <p style={{ textAlign: 'left' }}>: {luasAreaBangunan}</p>
                  <p style={{ textAlign: 'left' }}>Status kepemilikan</p>
                  <p style={{ textAlign: 'left' }}>: {kepemilikanBangunan}</p>
                </>
              )}
              {bangunan === 'mess' && (
                <>
                  <p style={{ textAlign: 'left' }}>Luas Mess</p>
                  <p style={{ textAlign: 'left' }}>: {luasAreaBangunan}</p>
                  <p style={{ textAlign: 'left' }}>Status kepemilikan</p>
                  <p style={{ textAlign: 'left' }}>: {kepemilikanBangunan}</p>
                </>
              )}
              {bangunan === 'all' && (
                <>
                  <p style={{ textAlign: 'left' }}>Luas Office</p>
                  <p style={{ textAlign: 'left' }}>: {luasOffice}</p>
                  <p style={{ textAlign: 'left' }}>Luas Workshop</p>
                  <p style={{ textAlign: 'left' }}>: {luasWorkshop}</p>
                  <p style={{ textAlign: 'left' }}>Luas Warehouse</p>
                  <p style={{ textAlign: 'left' }}>: {luasWarehouse}</p>
                  <p style={{ textAlign: 'left' }}>Luas Mess</p>
                  <p style={{ textAlign: 'left' }}>: {luasMess}</p>
                  <p style={{ textAlign: 'left' }}>Status kepemilikan Tanah</p>
                  <p style={{ textAlign: 'left' }}>
                    : {statusKepemilikanTanah}
                  </p>
                </>
              )}

              <p style={{ textAlign: 'left' }}>Jumlah Man Power</p>
              <p style={{ textAlign: 'left' }}>: {jmlManPower}</p>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle}>
            <Column {...chartConfigApar} height={400} />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle}>
            <Column {...chartConfigDetector} height={400} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={12}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={12}>
          <Card style={cardStyle}></Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}></Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
