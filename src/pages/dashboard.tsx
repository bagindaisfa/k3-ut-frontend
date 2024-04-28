import React, { useEffect } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  DatePicker,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import type { TableProps, DatePickerProps } from 'antd';
import { config } from '../config';
import { Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Text } = Typography;

interface FieldSums {
  [key: string]: number;
}

interface DataItem {
  [key: string]: string | number | null;
}

const Dashboard: React.FC = () => {
  const [loadingPage, setLoadingPage] = React.useState<boolean>(false);
  const [defaultMonth, setDefaultMonth] = React.useState(dayjs().month() + 1); // Add 1 because dayjs().month() returns zero-based month index
  const [defaultYear, setDefaultYear] = React.useState(dayjs().year());
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
  const [chartConfigBox, setChartConfigBox] = React.useState<any>();
  const [chartConfigPilar, setChartConfigPilar] = React.useState<any>();
  const [chartConfigHoose15, setChartConfigHoose15] = React.useState<any>();
  const [chartConfigHoose25, setChartConfigHoose25] = React.useState<any>();
  const [chartConfigNozle25, setChartConfigNozle25] = React.useState<any>();
  const [chartConfigNozle15, setChartConfigNozle15] = React.useState<any>();

  const [hydrantPortableTersedia, setHydrantPortableTersedia] =
    React.useState<number>(0);
  const [dieselPumpTersedia, setDieselPumpTersedia] = React.useState<number>(0);
  const [jockeyPumpTersedia, setJockeyPumpTersedia] = React.useState<number>(0);
  const [electricPumpTersedia, setElectricPumpTersedia] =
    React.useState<number>(0);

  const [hydrantPortableKecukupan, setHydrantPortableKecukupan] =
    React.useState<number>(0);
  const [dieselPumpKecukupan, setDieselPumpKecukupan] =
    React.useState<number>(0);
  const [jockeyPumpKecukupan, setJockeyPumpKecukupan] =
    React.useState<number>(0);
  const [electricPumpKecukupan, setElectricPumpKecukupan] =
    React.useState<number>(0);

  const [hydrantPortableKesiapan, setHydrantPortableKesiapan] =
    React.useState<number>(0);
  const [dieselPumpKesiapan, setDieselPumpKesiapan] = React.useState<number>(0);
  const [jockeyPumpKesiapan, setJockeyPumpKesiapan] = React.useState<number>(0);
  const [electricPumpKesiapan, setElectricPumpKesiapan] =
    React.useState<number>(0);

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

  const [petugasPeranKecukupan, setPetugasPeranKecukupan] =
    React.useState<number>(0);
  const [petugasPeranKesiapan, setPetugasPeranKesiapan] =
    React.useState<number>(0);
  const [reguPenanggulanganKecukupan, setReguPenanggulanganKecukupan] =
    React.useState<number>(0);
  const [reguPenanggulanganKesiapan, setReguPenanggulanganKesiapan] =
    React.useState<number>(0);
  const [koordKebakaranKecukupan, setKoordKebakaranKecukupan] =
    React.useState<number>(0);
  const [koordKebakaranKesiapan, setKoordKebakaranKesiapan] =
    React.useState<number>(0);
  const [ahliK3KebakaranKecukupan, setAhliK3KebakaranKecukupan] =
    React.useState<number>(0);
  const [ahliK3KebakaranKesiapan, setAhliK3KebakaranKesiapan] =
    React.useState<number>(0);

  const [namaBMSM, setNamaBMSM] = React.useState<string>('');
  const [namaADH, setNamaADH] = React.useState<string>('');
  const [namaESROfficerLeader, setNamaESROfficerLeader] =
    React.useState<any>('');

  useEffect(() => {
    getDataCabang();
  }, []);

  const getDataCabang = () => {
    setLoadingPage(true);
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
          setLoadingPage(false);
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
        setLoadingPage(false);
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
          setLoadingPage(false);
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
        setLoadingPage(false);
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
          setLoadingPage(false);
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

        setPetugasPeranKesiapan(
          data.data[0]?.petugas_peran_kebakaran_jumlah_kesiapan
        );
        setReguPenanggulanganKesiapan(
          data.data[0]?.regu_penaggulangan_kebakaran_jumlah_kesiapan
        );
        setKoordKebakaranKesiapan(
          data.data[0]
            ?.koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan
        );
        setAhliK3KebakaranKesiapan(
          data.data[0]
            ?.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan
        );

        setPetugasPeranKecukupan(
          data.data[0]?.petugas_peran_kebakaran_jumlah_kecukupan
        );
        setReguPenanggulanganKecukupan(
          data.data[0]?.regu_penaggulangan_kebakaran_jumlah_kecukupan
        );
        setKoordKebakaranKecukupan(
          data.data[0]
            ?.koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan
        );
        setAhliK3KebakaranKecukupan(
          data.data[0]
            ?.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan
        );

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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Dry_Chemical_Powder_tersedia
                    : sumsOffice.apar_Dry_Chemical_Powder_tersedia +
                      sumsWorkshop.apar_Dry_Chemical_Powder_tersedia +
                      sumsWarehouse.apar_Dry_Chemical_Powder_tersedia +
                      sumsMess.apar_Dry_Chemical_Powder_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_CO2_tersedia
                    : sumsOffice.apar_CO2_tersedia +
                      sumsWorkshop.apar_CO2_tersedia +
                      sumsWarehouse.apar_CO2_tersedia +
                      sumsMess.apar_CO2_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_AF11_tersedia
                    : sumsOffice.apar_AF11_tersedia +
                      sumsWorkshop.apar_AF11_tersedia +
                      sumsWarehouse.apar_AF11_tersedia +
                      sumsMess.apar_AF11_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Foam_AFFF_tersedia
                    : sumsOffice.apar_Foam_AFFF_tersedia +
                      sumsWorkshop.apar_Foam_AFFF_tersedia +
                      sumsWarehouse.apar_Foam_AFFF_tersedia +
                      sumsMess.apar_Foam_AFFF_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Dry_Chemical_Powder_kesiapan
                    : sumsOffice.apar_Dry_Chemical_Powder_kesiapan +
                      sumsWorkshop.apar_Dry_Chemical_Powder_kesiapan +
                      sumsWarehouse.apar_Dry_Chemical_Powder_kesiapan +
                      sumsMess.apar_Dry_Chemical_Powder_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_CO2_kesiapan
                    : sumsOffice.apar_CO2_kesiapan +
                      sumsWorkshop.apar_CO2_kesiapan +
                      sumsWarehouse.apar_CO2_kesiapan +
                      sumsMess.apar_CO2_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_AF11_kesiapan
                    : sumsOffice.apar_AF11_kesiapan +
                      sumsWorkshop.apar_AF11_kesiapan +
                      sumsWarehouse.apar_AF11_kesiapan +
                      sumsMess.apar_AF11_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Foam_AFFF_kesiapan
                    : sumsOffice.apar_Foam_AFFF_kesiapan +
                      sumsWorkshop.apar_Foam_AFFF_kesiapan +
                      sumsWarehouse.apar_Foam_AFFF_kesiapan +
                      sumsMess.apar_Foam_AFFF_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Dry_Chemical_Powder_kecukupan
                    : sumsOffice.apar_Dry_Chemical_Powder_kecukupan +
                      sumsWorkshop.apar_Dry_Chemical_Powder_kecukupan +
                      sumsWarehouse.apar_Dry_Chemical_Powder_kecukupan +
                      sumsMess.apar_Dry_Chemical_Powder_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_CO2_kecukupan
                    : sumsOffice.apar_CO2_kecukupan +
                      sumsWorkshop.apar_CO2_kecukupan +
                      sumsWarehouse.apar_CO2_kecukupan +
                      sumsMess.apar_CO2_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_AF11_kecukupan
                    : sumsOffice.apar_AF11_kecukupan +
                      sumsWorkshop.apar_AF11_kecukupan +
                      sumsWarehouse.apar_AF11_kecukupan +
                      sumsMess.apar_AF11_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.apar_Foam_AFFF_kecukupan
                    : sumsOffice.apar_Foam_AFFF_kecukupan +
                      sumsWorkshop.apar_Foam_AFFF_kecukupan +
                      sumsWarehouse.apar_Foam_AFFF_kecukupan +
                      sumsMess.apar_Foam_AFFF_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.heat_detector_tersedia
                    : sumsOffice.heat_detector_tersedia +
                      sumsWorkshop.heat_detector_tersedia +
                      sumsWarehouse.heat_detector_tersedia +
                      sumsMess.heat_detector_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.smoke_detector_tersedia
                    : sumsOffice.smoke_detector_tersedia +
                      sumsWorkshop.smoke_detector_tersedia +
                      sumsWarehouse.smoke_detector_tersedia +
                      sumsMess.smoke_detector_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.push_button_tersedia
                    : sumsOffice.push_button_tersedia +
                      sumsWorkshop.push_button_tersedia +
                      sumsWarehouse.push_button_tersedia +
                      sumsMess.push_button_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.sprinkler_tersedia
                    : sumsOffice.sprinkler_tersedia +
                      sumsWorkshop.sprinkler_tersedia +
                      sumsWarehouse.sprinkler_tersedia +
                      sumsMess.sprinkler_tersedia,
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
                    : bangunan === 'mess'
                    ? sumsMess.heat_detector_kesiapan
                    : sumsOffice.heat_detector_kesiapan +
                      sumsWorkshop.heat_detector_kesiapan +
                      sumsWarehouse.heat_detector_kesiapan +
                      sumsMess.heat_detector_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.smoke_detector_kesiapan
                    : sumsOffice.smoke_detector_kesiapan +
                      sumsWorkshop.smoke_detector_kesiapan +
                      sumsWarehouse.smoke_detector_kesiapan +
                      sumsMess.smoke_detector_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.push_button_kesiapan
                    : sumsOffice.push_button_kesiapan +
                      sumsWorkshop.push_button_kesiapan +
                      sumsWarehouse.push_button_kesiapan +
                      sumsMess.push_button_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.sprinkler_kesiapan
                    : sumsOffice.sprinkler_kesiapan +
                      sumsWorkshop.sprinkler_kesiapan +
                      sumsWarehouse.sprinkler_kesiapan +
                      sumsMess.sprinkler_kesiapan,
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
                    : bangunan === 'mess'
                    ? sumsMess.heat_detector_kecukupan
                    : sumsOffice.heat_detector_kecukupan +
                      sumsWorkshop.heat_detector_kecukupan +
                      sumsWarehouse.heat_detector_kecukupan +
                      sumsMess.heat_detector_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.smoke_detector_kecukupan
                    : sumsOffice.smoke_detector_kecukupan +
                      sumsWorkshop.smoke_detector_kecukupan +
                      sumsWarehouse.smoke_detector_kecukupan +
                      sumsMess.smoke_detector_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.push_button_kecukupan
                    : sumsOffice.push_button_kecukupan +
                      sumsWorkshop.push_button_kecukupan +
                      sumsWarehouse.push_button_kecukupan +
                      sumsMess.push_button_kecukupan,
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
                    : bangunan === 'mess'
                    ? sumsMess.sprinkler_kecukupan
                    : sumsOffice.sprinkler_kecukupan +
                      sumsWorkshop.sprinkler_kecukupan +
                      sumsWarehouse.sprinkler_kecukupan +
                      sumsMess.sprinkler_kecukupan,
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

        const configBox = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Hydrant Gedung',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_dlm_gedung_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_dlm_gedung_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_dlm_gedung_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_dlm_gedung_tersedia
                    : sumsOffice.hydrant_dlm_gedung_tersedia +
                      sumsWorkshop.hydrant_dlm_gedung_tersedia +
                      sumsWarehouse.hydrant_dlm_gedung_tersedia +
                      sumsMess.hydrant_dlm_gedung_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Hydrant Gedung',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_dlm_gedung_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_dlm_gedung_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_dlm_gedung_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_dlm_gedung_kesiapan
                    : sumsOffice.hydrant_dlm_gedung_kesiapan +
                      sumsWorkshop.hydrant_dlm_gedung_kesiapan +
                      sumsWarehouse.hydrant_dlm_gedung_kesiapan +
                      sumsMess.hydrant_dlm_gedung_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Hydrant Gedung',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_dlm_gedung_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_dlm_gedung_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_dlm_gedung_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_dlm_gedung_kecukupan
                    : sumsOffice.hydrant_dlm_gedung_kecukupan +
                      sumsWorkshop.hydrant_dlm_gedung_kecukupan +
                      sumsWarehouse.hydrant_dlm_gedung_kecukupan +
                      sumsMess.hydrant_dlm_gedung_kecukupan,
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
        const configPilar = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Pilar',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_pillar_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_pillar_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_pillar_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_pillar_tersedia
                    : sumsOffice.hydrant_pillar_tersedia +
                      sumsWorkshop.hydrant_pillar_tersedia +
                      sumsWarehouse.hydrant_pillar_tersedia +
                      sumsMess.hydrant_pillar_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Pilar',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_pillar_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_pillar_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_pillar_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_pillar_kesiapan
                    : sumsOffice.hydrant_pillar_kesiapan +
                      sumsWorkshop.hydrant_pillar_kesiapan +
                      sumsWarehouse.hydrant_pillar_kesiapan +
                      sumsMess.hydrant_pillar_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Pilar',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_pillar_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_pillar_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_pillar_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_pillar_kecukupan
                    : sumsOffice.hydrant_pillar_kecukupan +
                      sumsWorkshop.hydrant_pillar_kecukupan +
                      sumsWarehouse.hydrant_pillar_kecukupan +
                      sumsMess.hydrant_pillar_kecukupan,
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

        const configHoose15 = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Hoose 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_15_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_15_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_15_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_15_tersedia
                    : sumsOffice.hydrant_hoose_15_tersedia +
                      sumsWorkshop.hydrant_hoose_15_tersedia +
                      sumsWarehouse.hydrant_hoose_15_tersedia +
                      sumsMess.hydrant_hoose_15_tersedia,
              },
              {
                status: 'Kesiapan',
                unit: 'Hoose 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_15_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_15_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_15_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_15_kesiapan
                    : sumsOffice.hydrant_hoose_15_kesiapan +
                      sumsWorkshop.hydrant_hoose_15_kesiapan +
                      sumsWarehouse.hydrant_hoose_15_kesiapan +
                      sumsMess.hydrant_hoose_15_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Hoose 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_15_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_15_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_15_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_15_kecukupan
                    : sumsOffice.hydrant_hoose_15_kecukupan +
                      sumsWorkshop.hydrant_hoose_15_kecukupan +
                      sumsWarehouse.hydrant_hoose_15_kecukupan +
                      sumsMess.hydrant_hoose_15_kecukupan,
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

        const configHoose25 = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Hoose 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_25_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_25_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_25_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_25_tersedia
                    : sumsOffice.hydrant_hoose_25_tersedia +
                      sumsWorkshop.hydrant_hoose_25_tersedia +
                      sumsWarehouse.hydrant_hoose_25_tersedia +
                      sumsMess.hydrant_hoose_25_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Hoose 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_25_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_25_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_25_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_25_kesiapan
                    : sumsOffice.hydrant_hoose_25_kesiapan +
                      sumsWorkshop.hydrant_hoose_25_kesiapan +
                      sumsWarehouse.hydrant_hoose_25_kesiapan +
                      sumsMess.hydrant_hoose_25_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Hoose 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.hydrant_hoose_25_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.hydrant_hoose_25_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.hydrant_hoose_25_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.hydrant_hoose_25_kecukupan
                    : sumsOffice.hydrant_hoose_25_kecukupan +
                      sumsWorkshop.hydrant_hoose_25_kecukupan +
                      sumsWarehouse.hydrant_hoose_25_kecukupan +
                      sumsMess.hydrant_hoose_25_kecukupan,
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

        const configNozle15 = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Nozle 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_15_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_15_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_15_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.nozle_15_tersedia
                    : sumsOffice.nozle_15_tersedia +
                      sumsWorkshop.nozle_15_tersedia +
                      sumsWarehouse.nozle_15_tersedia +
                      sumsMess.nozle_15_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Nozle 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_15_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_15_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_15_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.nozle_15_kesiapan
                    : sumsOffice.nozle_15_kesiapan +
                      sumsWorkshop.nozle_15_kesiapan +
                      sumsWarehouse.nozle_15_kesiapan +
                      sumsMess.nozle_15_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Nozle 1.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_15_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_15_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_15_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.nozle_15_kecukupan
                    : sumsOffice.nozle_15_kecukupan +
                      sumsWorkshop.nozle_15_kecukupan +
                      sumsWarehouse.nozle_15_kecukupan +
                      sumsMess.nozle_15_kecukupan,
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

        const configNozle25 = {
          data: {
            value: [
              {
                status: 'Ketersediaan',
                unit: 'Nozle 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_25_tersedia
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_25_tersedia
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_25_tersedia
                    : bangunan === 'mess'
                    ? sumsMess.nozle_25_tersedia
                    : sumsOffice.nozle_25_tersedia +
                      sumsWorkshop.nozle_25_tersedia +
                      sumsWarehouse.nozle_25_tersedia +
                      sumsMess.nozle_25_tersedia,
              },

              {
                status: 'Kesiapan',
                unit: 'Nozle 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_25_kesiapan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_25_kesiapan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_25_kesiapan
                    : bangunan === 'mess'
                    ? sumsMess.nozle_25_kesiapan
                    : sumsOffice.nozle_25_kesiapan +
                      sumsWorkshop.nozle_25_kesiapan +
                      sumsWarehouse.nozle_25_kesiapan +
                      sumsMess.nozle_25_kesiapan,
              },
              {
                status: 'Kecukupan',
                unit: 'Nozle 2.5 Inch',
                jumlah:
                  bangunan === 'office'
                    ? sumsOffice.nozle_25_kecukupan
                    : bangunan === 'workshop'
                    ? sumsWorkshop.nozle_25_kecukupan
                    : bangunan === 'warehouse'
                    ? sumsWarehouse.nozle_25_kecukupan
                    : bangunan === 'mess'
                    ? sumsMess.nozle_25_kecukupan
                    : sumsOffice.nozle_25_kecukupan +
                      sumsWorkshop.nozle_25_kecukupan +
                      sumsWarehouse.nozle_25_kecukupan +
                      sumsMess.nozle_25_kecukupan,
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
        setChartConfigBox(configBox);
        setChartConfigPilar(configPilar);
        setChartConfigHoose15(configHoose15);
        setChartConfigHoose25(configHoose25);
        setChartConfigNozle15(configNozle15);
        setChartConfigNozle25(configNozle25);

        setHydrantPortableTersedia(
          bangunan === 'office'
            ? sumsOffice.hydrant_portable_tersedia
            : bangunan === 'workshop'
            ? sumsWorkshop.hydrant_portable_tersedia
            : bangunan === 'warehouse'
            ? sumsWarehouse.hydrant_portable_tersedia
            : bangunan === 'mess'
            ? sumsMess.hydrant_portable_tersedia
            : sumsOffice.hydrant_portable_tersedia +
              sumsWorkshop.hydrant_portable_tersedia +
              sumsWarehouse.hydrant_portable_tersedia +
              sumsMess.hydrant_portable_tersedia
        );
        setHydrantPortableKecukupan(
          bangunan === 'office'
            ? sumsOffice.hydrant_portable_kecukupan
            : bangunan === 'workshop'
            ? sumsWorkshop.hydrant_portable_kecukupan
            : bangunan === 'warehouse'
            ? sumsWarehouse.hydrant_portable_kecukupan
            : bangunan === 'mess'
            ? sumsMess.hydrant_portable_kecukupan
            : sumsOffice.hydrant_portable_kecukupan +
              sumsWorkshop.hydrant_portable_kecukupan +
              sumsWarehouse.hydrant_portable_kecukupan +
              sumsMess.hydrant_portable_kecukupan
        );
        setHydrantPortableKesiapan(
          bangunan === 'office'
            ? sumsOffice.hydrant_portable_kesiapan
            : bangunan === 'workshop'
            ? sumsWorkshop.hydrant_portable_kesiapan
            : bangunan === 'warehouse'
            ? sumsWarehouse.hydrant_portable_kesiapan
            : bangunan === 'mess'
            ? sumsMess.hydrant_portable_kesiapan
            : sumsOffice.hydrant_portable_kesiapan +
              sumsWorkshop.hydrant_portable_kesiapan +
              sumsWarehouse.hydrant_portable_kesiapan +
              sumsMess.hydrant_portable_kesiapan
        );

        setJockeyPumpTersedia(
          bangunan === 'office'
            ? sumsOffice.jockey_pump_tersedia
            : bangunan === 'workshop'
            ? sumsWorkshop.jockey_pump_tersedia
            : bangunan === 'warehouse'
            ? sumsWarehouse.jockey_pump_tersedia
            : bangunan === 'mess'
            ? sumsMess.jockey_pump_tersedia
            : sumsOffice.jockey_pump_tersedia +
              sumsWorkshop.jockey_pump_tersedia +
              sumsWarehouse.jockey_pump_tersedia +
              sumsMess.jockey_pump_tersedia
        );
        setJockeyPumpKecukupan(
          bangunan === 'office'
            ? sumsOffice.jockey_pump_kecukupan
            : bangunan === 'workshop'
            ? sumsWorkshop.jockey_pump_kecukupan
            : bangunan === 'warehouse'
            ? sumsWarehouse.jockey_pump_kecukupan
            : bangunan === 'mess'
            ? sumsMess.jockey_pump_kecukupan
            : sumsOffice.jockey_pump_kecukupan +
              sumsWorkshop.jockey_pump_kecukupan +
              sumsWarehouse.jockey_pump_kecukupan +
              sumsMess.jockey_pump_kecukupan
        );
        setJockeyPumpKesiapan(
          bangunan === 'office'
            ? sumsOffice.jockey_pump_kesiapan
            : bangunan === 'workshop'
            ? sumsWorkshop.jockey_pump_kesiapan
            : bangunan === 'warehouse'
            ? sumsWarehouse.jockey_pump_kesiapan
            : bangunan === 'mess'
            ? sumsMess.jockey_pump_kesiapan
            : sumsOffice.jockey_pump_kesiapan +
              sumsWorkshop.jockey_pump_kesiapan +
              sumsWarehouse.jockey_pump_kesiapan +
              sumsMess.jockey_pump_kesiapan
        );

        setElectricPumpTersedia(
          bangunan === 'office'
            ? sumsOffice.electric_pump_tersedia
            : bangunan === 'workshop'
            ? sumsWorkshop.electric_pump_tersedia
            : bangunan === 'warehouse'
            ? sumsWarehouse.electric_pump_tersedia
            : bangunan === 'mess'
            ? sumsMess.electric_pump_tersedia
            : sumsOffice.electric_pump_tersedia +
              sumsWorkshop.electric_pump_tersedia +
              sumsWarehouse.electric_pump_tersedia +
              sumsMess.electric_pump_tersedia
        );
        setElectricPumpKecukupan(
          bangunan === 'office'
            ? sumsOffice.electric_pump_kecukupan
            : bangunan === 'workshop'
            ? sumsWorkshop.electric_pump_kecukupan
            : bangunan === 'warehouse'
            ? sumsWarehouse.electric_pump_kecukupan
            : bangunan === 'mess'
            ? sumsMess.electric_pump_kecukupan
            : sumsOffice.electric_pump_kecukupan +
              sumsWorkshop.electric_pump_kecukupan +
              sumsWarehouse.electric_pump_kecukupan +
              sumsMess.electric_pump_kecukupan
        );
        setElectricPumpKesiapan(
          bangunan === 'office'
            ? sumsOffice.electric_pump_kesiapan
            : bangunan === 'workshop'
            ? sumsWorkshop.electric_pump_kesiapan
            : bangunan === 'warehouse'
            ? sumsWarehouse.electric_pump_kesiapan
            : bangunan === 'mess'
            ? sumsMess.electric_pump_kesiapan
            : sumsOffice.electric_pump_kesiapan +
              sumsWorkshop.electric_pump_kesiapan +
              sumsWarehouse.electric_pump_kesiapan +
              sumsMess.electric_pump_kesiapan
        );

        setDieselPumpTersedia(
          bangunan === 'office'
            ? sumsOffice.diesel_pump_tersedia
            : bangunan === 'workshop'
            ? sumsWorkshop.diesel_pump_tersedia
            : bangunan === 'warehouse'
            ? sumsWarehouse.diesel_pump_tersedia
            : bangunan === 'mess'
            ? sumsMess.diesel_pump_tersedia
            : sumsOffice.diesel_pump_tersedia +
              sumsWorkshop.diesel_pump_tersedia +
              sumsWarehouse.diesel_pump_tersedia +
              sumsMess.diesel_pump_tersedia
        );
        setDieselPumpKecukupan(
          bangunan === 'office'
            ? sumsOffice.diesel_pump_kecukupan
            : bangunan === 'workshop'
            ? sumsWorkshop.diesel_pump_kecukupan
            : bangunan === 'warehouse'
            ? sumsWarehouse.diesel_pump_kecukupan
            : bangunan === 'mess'
            ? sumsMess.diesel_pump_kecukupan
            : sumsOffice.diesel_pump_kecukupan +
              sumsWorkshop.diesel_pump_kecukupan +
              sumsWarehouse.diesel_pump_kecukupan +
              sumsMess.diesel_pump_kecukupan
        );
        setDieselPumpKesiapan(
          bangunan === 'office'
            ? sumsOffice.diesel_pump_kesiapan
            : bangunan === 'workshop'
            ? sumsWorkshop.diesel_pump_kesiapan
            : bangunan === 'warehouse'
            ? sumsWarehouse.diesel_pump_kesiapan
            : bangunan === 'mess'
            ? sumsMess.diesel_pump_kesiapan
            : sumsOffice.diesel_pump_kesiapan +
              sumsWorkshop.diesel_pump_kesiapan +
              sumsWarehouse.diesel_pump_kesiapan +
              sumsMess.diesel_pump_kesiapan
        );
        setLoadingPage(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoadingPage(false);
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
          setLoadingPage(false);
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setLuasAreaBangunan(data.data[0]?.luas_bangunan);
        setKepemilikanBangunan(data.data[0]?.status_kepemilikan_area);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoadingPage(false);
      });
  };

  const cardStyle = {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adjust shadow properties as needed
    borderRadius: '8px', // Optional: Add border radius for rounded corners
    height: 440,
  };

  const defaultDate = dayjs(`${defaultYear}-${defaultMonth}-01`, 'YYYY-MM-DD');

  return loadingPage ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Horizontally center the Spin
        alignItems: 'center', // Vertically center the Spin
        minHeight: '100vh', // Ensure the container covers the entire viewport height
      }}
    >
      <Spin size="large" />
    </div>
  ) : (
    <>
      <Tooltip title="Cabang">
        <Select
          defaultValue={
            optionsCabang[0] ? optionsCabang[0].value : 'Please Select'
          }
          style={{ width: 150, margin: 16 }}
          onChange={handleChangeCabang}
          options={optionsCabang}
        />
      </Tooltip>
      <Tooltip title="Site">
        <Select
          defaultValue={optionsSite[0] ? optionsSite[0].value : 'Please Select'}
          style={{ width: 150, margin: 16 }}
          onChange={handleChangeSite}
          options={optionsSite}
        />
      </Tooltip>
      <Tooltip title="Bangunan">
        <Select
          defaultValue={'all'}
          style={{ width: 150, margin: 16 }}
          onChange={handleChangeBangunan}
          options={optionsBangunan}
        />
      </Tooltip>
      <DatePicker
        onChange={onChangeMonth}
        picker="month"
        style={{ margin: 16 }}
        defaultValue={dayjs()}
      />
      <DatePicker
        onChange={onChangeYear}
        picker="year"
        style={{ margin: 16 }}
        defaultValue={dayjs()}
      />
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={8}>
          <p style={{ textAlign: 'left', fontWeight: 700 }}>
            Nama BM/SM: {namaBMSM}
          </p>
        </Col>
        <Col span={8}>
          <p style={{ textAlign: 'left', fontWeight: 700 }}>
            Nama ADH: {namaADH}
          </p>
        </Col>
        <Col span={8}>
          <p style={{ textAlign: 'left', fontWeight: 700 }}>
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
              <p style={{ textAlign: 'left', fontWeight: 700 }}>Luas Area</p>
              <p style={{ textAlign: 'left', fontWeight: 700 }}>
                : {luasArea} M
                <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                  ²
                </Text>
              </p>

              {bangunan === 'office' && (
                <>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Office
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasAreaBangunan} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Status kepemilikan
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {kepemilikanBangunan}
                  </p>
                </>
              )}
              {bangunan === 'workshop' && (
                <>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Workshop
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasAreaBangunan} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Status kepemilikan
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {kepemilikanBangunan}
                  </p>
                </>
              )}

              {bangunan === 'warehouse' && (
                <>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Warehouse
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasAreaBangunan} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Status kepemilikan
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {kepemilikanBangunan}
                  </p>
                </>
              )}
              {bangunan === 'mess' && (
                <>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Mess
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasAreaBangunan} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Status kepemilikan
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {kepemilikanBangunan}
                  </p>
                </>
              )}
              {bangunan === 'all' && (
                <>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Office
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasOffice} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Workshop
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasWorkshop} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Warehouse
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasWarehouse} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Luas Mess
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {luasMess} M
                    <Text style={{ verticalAlign: 'super', fontSize: '0.9em' }}>
                      ²
                    </Text>
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    Status kepemilikan Tanah
                  </p>
                  <p style={{ textAlign: 'left', fontWeight: 700 }}>
                    : {statusKepemilikanTanah}
                  </p>
                </>
              )}

              <p style={{ textAlign: 'left', fontWeight: 700 }}>
                Jumlah Man Power
              </p>
              <p style={{ textAlign: 'left', fontWeight: 700 }}>
                : {jmlManPower}
              </p>
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
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Pompa Jockey</h2>
            <Card
              title="Ketersediaan"
              style={{ margin: 10, textAlign: 'center' }}
            >
              <b>{jockeyPumpTersedia}</b>
            </Card>
            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{jockeyPumpKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{jockeyPumpKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Pompa Elektrik</h2>
            <Card
              title="Ketersediaan"
              style={{ margin: 10, textAlign: 'center' }}
            >
              <b>{electricPumpTersedia}</b>
            </Card>
            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{electricPumpKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{electricPumpKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Pompa Diesel</h2>
            <Card
              title="Ketersediaan"
              style={{ margin: 5, textAlign: 'center' }}
            >
              <b>{dieselPumpTersedia}</b>
            </Card>
            <Card title="Kesiapan" style={{ margin: 5, textAlign: 'center' }}>
              <b>{dieselPumpKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 5, textAlign: 'center' }}>
              <b>{dieselPumpKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Pompa Portable</h2>
            <Card
              title="Ketersediaan"
              style={{ margin: 10, textAlign: 'center' }}
            >
              <b>{hydrantPortableTersedia}</b>
            </Card>
            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{hydrantPortableKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{hydrantPortableKecukupan}</b>
            </Card>
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigBox} height={400} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigPilar} height={400} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigHoose15} height={400} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigHoose25} height={400} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigNozle15} height={400} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={cardStyle}>
            <Column {...chartConfigNozle25} height={400} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Petugas Peran Kebakaran</h2>

            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{petugasPeranKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{petugasPeranKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Regu Penanggulangan</h2>

            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{reguPenanggulanganKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{reguPenanggulanganKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Koordinator Kebakaran</h2>

            <Card title="Kesiapan" style={{ margin: 5, textAlign: 'center' }}>
              <b>{koordKebakaranKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 5, textAlign: 'center' }}>
              <b>{koordKebakaranKecukupan}</b>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ width: '100%', height: '100%' }}>
            <h2>Ahli K3 Kebakaran</h2>

            <Card title="Kesiapan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{ahliK3KebakaranKesiapan}</b>
            </Card>
            <Card title="Kecukupan" style={{ margin: 10, textAlign: 'center' }}>
              <b>{ahliK3KebakaranKecukupan}</b>
            </Card>
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ margin: 10 }}>
        <Col span={24}>
          <Card
            style={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adjust shadow properties as needed
              borderRadius: '8px', // Optional: Add border radius for rounded corners
              width: '100%',
              height: '100%',
            }}
          >
            <p>
              <b>Keterangan:</b>
              <br />
              1. Tingkat D : Petugas peran penanggulangan kebakaran ialah
              petugas yang ditunjuk dan diserahi tugas tambahan untuk
              mengidentifikasi sumber-sumber bahaya dan melaksanakan upaya-upaya
              penanggulangan kebakaran.
              <br />
              2. Tingkat C : Regu penanggulangan kebakaran ialah Satuan tugas
              yang mempunyai tugas khusus fungsional di bidang penanggulangan
              kebakaran.
              <br />
              3. Tingkat B : Koordinator unit penanggulangan kebakaran bertugas
              memimpin penanggulangan kebakaran sebelum mendapat bantuan dari
              instansi yang berwenang
              <br />
              4. Tingkat A : Ahli Keselamatan Kerja ialah tenaga teknis yang
              berkeahlian khusus di bidang penanggulangan kebakaran dari luar
              Departemen Tenaga Kerja yang ditunjuk oleh Menteri Tenaga Kerja.
              <br />
              <br />
              <b>
                Unit penanggulangan kebakaran yang terdaftar adalah personal
                yang telah memiliki sertifikasi kompetensi Tingkat A;B;C;D
                sesuai Keputusan Menteri Tenaga Kerja R.I No.Kep.186/Men/1999
                Tentang Unit Penanggulangan Kebakaran Ditempat Kerja
              </b>
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
