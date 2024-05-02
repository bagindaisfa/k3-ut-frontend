import React, { useEffect } from 'react';
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  InputNumber,
  Upload,
  Card,
} from 'antd';
import type { TableProps, DatePickerProps } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { config } from '../config';

dayjs.extend(customParseFormat);
const dateFormat = 'DD/MM/YYYY';

interface DataType {
  unit: string;
  tersedia: any;
  kecukupan: any;
  kesiapan: any;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const DataUmum: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setId] = React.useState<string>('');
  const [data, setData] = React.useState<DataType[]>([]);
  const [dataEdit, setDataEdit] = React.useState<DataType[]>([]);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [cabang, setCabang] = React.useState<string>('');
  const [site, setSite] = React.useState<string>('');
  const [plant, setPlant] = React.useState<string>('');
  const [cabangValue, setCabangValue] = React.useState<string>('');
  const [siteValue, setSiteValue] = React.useState<string>('');
  const [plantValue, setPlantValue] = React.useState<string>('');
  const [namaBMSM, setNamaBMSM] = React.useState<string>('');
  const [namaADH, setNamaADH] = React.useState<string>('');
  const [namaESROfficerLeader, setNamaESROfficerLeader] =
    React.useState<any>('');
  const [nomorTeleponESROfficerLeader, setNomorTeleponESROfficerLeader] =
    React.useState<any>('');
  const [nomorTeleponDamkarSetempat, setNomorTeleponDamkarSetempat] =
    React.useState<any>('');
  const [nomorTeleponRSSetempat, setNomorTeleponRSSetempat] =
    React.useState<any>('');
  const [jumlahKaryawan, setJumlahKaryawan] = React.useState<any>('');
  const [luasTanahKeseluruhan, setLuasTanahKeseluruhan] =
    React.useState<any>('');
  const [statusKepemilikanArea, setStatusKepemilikanArea] =
    React.useState<any>('');
  const [sertifikatKepemilikanfileName, setSertifikatKepemilikanfileName] =
    React.useState<string>('');
  const [petugasPeranKebakaranfileName, setPetugasPeranKebakaranfileName] =
    React.useState<string>('');
  const [
    reguPenanggulanganKebakaranfileName,
    setReguPenanggulanganKebakaranfileName,
  ] = React.useState<string>('');
  const [
    koordReguPenanggulanganKebakaranfileName,
    setKoordReguPenanggulanganKebakaranfileName,
  ] = React.useState<string>('');
  const [
    ahliK3SpesialisPenanggulanganKebakaranfileName,
    setAhliK3SpesialisPenanggulanganKebakaranfileName,
  ] = React.useState<string>('');
  const [identifikasiBahayafileName, setIdentifikasiBahayafileName] =
    React.useState<string>('');
  const [identifikasiBahayafileNo, setIdentifikasiBahayafileNo] =
    React.useState<string>('');
  const [strukturOrganisasiTktdfileName, setStrukturOrganisasiTktdfileName] =
    React.useState<string>('');
  const [strukturOrganisasiTktdfileNo, setStrukturOrganisasiTktdfileNo] =
    React.useState<string>('');
  const [dokumentasiSosialisasifileName, setDokumentasiSosialisasifileName] =
    React.useState<string>('');
  const [dokumentasiSosialisasifileNo, setDokumentasiSosialisasifileNo] =
    React.useState<string>('');
  const [rekamDataInspeksifileName, setRekamDataInspeksifileName] =
    React.useState<string>('');
  const [rekamDataInspeksifileNo, setRekamDataInspeksifileNo] =
    React.useState<string>('');
  const [dokumenLaporanSimulasifileName, setDokumenLaporanSimulasifileName] =
    React.useState<string>('');
  const [dokumenLaporanSimulasifileNo, setDokumenLaporanSimulasifileNo] =
    React.useState<string>('');
  const [jmlKaryawanSimulasifileName, setJmlKaryawanSimulasifileName] =
    React.useState<string>('');
  const [jmlKaryawanSimulasifileNo, setJmlKaryawanSimulasifileNo] =
    React.useState<string>('');
  const [jmlPetugasKebakaran, setJmlPetugasKebakaran] =
    React.useState<number>(0);
  const [jmlReguPenanggulangan, setJmlReguPenanggulangan] =
    React.useState<number>(0);
  const [jmlKoord, setJmlKoord] = React.useState<number>(0);
  const [jmlK3, setJmlK3] = React.useState<number>(0);
  const [optionsCabang, setOptionsCabang] = React.useState<any[]>([]);
  const [optionsSite, setOptionsSite] = React.useState<any[]>([]);
  const [optionsPlant, setOptionsPlant] = React.useState<any[]>([]);
  const [optionsKepemilikan, setOptionsKepemilikan] = React.useState<any[]>([
    {
      value: 'SHM',
      label: 'SHM',
    },
    {
      value: 'HGB',
      label: 'HGB',
    },
    {
      value: 'SEWA',
      label: 'SEWA',
    },
    {
      value: 'AREA OWNER',
      label: 'AREA OWNER',
    },
  ]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Ketersediaan',
      dataIndex: 'tersedia',
      key: 'tersedia',
    },
    {
      title: 'Kecukupan',
      dataIndex: 'kecukupan',
      key: 'kecukupan',
    },
    {
      title: 'Kesiapan',
      dataIndex: 'kesiapan',
      key: 'kesiapan',
    },
  ];

  useEffect(() => {
    getDataCabang();
    getDataSite();
    getDataPlant();
    fetchData(cabang, site, plant, year, month);
  }, []);

  const handleOkAdd = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }
    form
      .validateFields()
      .then((values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]: any) => {
          if (
            key !== 'sertifikat_kepemilikan' &&
            key !== 'petugas_peran_kebakaran' &&
            key !== 'regu_penanggulangan_kebakaran' &&
            key !== 'koord_regu_penanggulangan_kebakaran' &&
            key !== 'ahli_k3_spesialis_penanggulangan_kebakaran' &&
            key !== 'identifikasi_bahaya' &&
            key !== 'struktur_organisasi_tktd' &&
            key !== 'dokumentasi_sosialisasi' &&
            key !== 'rekam_data_inspeksi' &&
            key !== 'dokumen_laporan_simulasi' &&
            key !== 'jml_karyawan_simulasi'
          ) {
            formData.append(key, value);
          }
        });

        // Append additional data
        formData.append('account_name', localStorage.getItem('name') ?? '');
        formData.append('role', localStorage.getItem('rolename') ?? '');

        // Append the file
        const fileList1 = values.sertifikat_kepemilikan;
        const fileList2 = values.petugas_peran_kebakaran;
        const fileList3 = values.regu_penanggulangan_kebakaran;
        const fileList4 = values.koord_regu_penanggulangan_kebakaran;
        const fileList5 = values.ahli_k3_spesialis_penanggulangan_kebakaran;
        const fileList6 = values.identifikasi_bahaya;
        const fileList7 = values.struktur_organisasi_tktd;
        const fileList8 = values.dokumentasi_sosialisasi;
        const fileList9 = values.rekam_data_inspeksi;
        const fileList10 = values.dokumen_laporan_simulasi;
        const fileList11 = values.jml_karyawan_simulasi;

        if (fileList1 && fileList1.length > 0) {
          formData.append('sertifikat_kepemilikan', fileList1[0].originFileObj);
        }
        if (fileList2 && fileList2.length > 0) {
          formData.append(
            'petugas_peran_kebakaran',
            fileList2[0].originFileObj
          );
        }
        if (fileList3 && fileList3.length > 0) {
          formData.append(
            'regu_penanggulangan_kebakaran',
            fileList3[0].originFileObj
          );
        }
        if (fileList4 && fileList4.length > 0) {
          formData.append(
            'koord_regu_penanggulangan_kebakaran',
            fileList4[0].originFileObj
          );
        }
        if (fileList5 && fileList5.length > 0) {
          formData.append(
            'ahli_k3_spesialis_penanggulangan_kebakaran',
            fileList5[0].originFileObj
          );
        }
        if (fileList6 && fileList6.length > 0) {
          formData.append('identifikasi_bahaya', fileList6[0].originFileObj);
        }
        if (fileList7 && fileList7.length > 0) {
          formData.append(
            'struktur_organisasi_tktd',
            fileList7[0].originFileObj
          );
        }
        if (fileList8 && fileList8.length > 0) {
          formData.append(
            'dokumentasi_sosialisasi',
            fileList8[0].originFileObj
          );
        }
        if (fileList9 && fileList9.length > 0) {
          formData.append('rekam_data_inspeksi', fileList9[0].originFileObj);
        }
        if (fileList10 && fileList10.length > 0) {
          formData.append(
            'dokumen_laporan_simulasi',
            fileList10[0].originFileObj
          );
        }
        if (fileList11 && fileList11.length > 0) {
          formData.append('jml_karyawan_simulasi', fileList11[0].originFileObj);
        }

        // Send POST request with the form data
        if (editMode) {
          fetch(`${config.apiUrl}/proteksi-kebakaran/edit/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'client-id': config.clientID,
              'client-secret': config.clientSecret,
            },
            body: formData,
          })
            .then(async (response) => {
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
              const data = await response.json();
              throw new Error(data.error);
            })
            .then((data) => {
              console.log('Form data edited successfully:', data);
              success('Form data edited successfully');
              getDataCabang();
              getDataSite();
              getDataPlant();
              fetchData(cabang, site, plant, year, month);
              setOpenModalAdd(false);
            })
            .catch((err) => {
              error(err.toString());
              console.error('Error edit form data:', err);
            });
        } else {
          fetch(`${config.apiUrl}/proteksi-kebakaran/save`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'client-id': config.clientID,
              'client-secret': config.clientSecret,
            },
            body: formData,
          })
            .then(async (response) => {
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
              const data = await response.json();
              throw new Error(data.error);
            })
            .then((data) => {
              console.log('Form data posted successfully:', data);
              success('Form data posted successfully');
              getDataCabang();
              getDataSite();
              getDataPlant();
              fetchData(cabang, site, plant, year, month);
              setOpenModalAdd(false);
            })
            .catch((err) => {
              error(err.toString());
              console.error('Error posting form data:', err);
            });
        }
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const getDataSite = () => {
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
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const getDataPlant = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(`${config.apiUrl}/master-plant/get`, {
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
        const plants = data.data.map((item: any) => item._id);
        const result = plants.map((item: any) => {
          return { value: item, label: item };
        });
        setOptionsPlant(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchData = (
    cabang: string,
    site: string,
    plant: string,
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
      `${
        config.apiUrl
      }/proteksi-kebakaran-dashboard/get?role=${localStorage.getItem(
        'rolename'
      )}&account_name=${localStorage.getItem(
        'name'
      )}&year=${year}&month=${month}&cabang=${cabang}&site=${site}&plant=${plant}`,
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
        const res = data.data[0] ? data.data[0] : {};
        setDataEdit(data.data);
        setId(data.data[0]?._id);
        setSertifikatKepemilikanfileName(
          data.data[0]?.sertifikat_kepemilikan_file
        );
        setPetugasPeranKebakaranfileName(
          data.data[0]?.petugas_peran_kebakaran_file
        );
        setReguPenanggulanganKebakaranfileName(
          data.data[0]?.regu_penanggulangan_kebakaran_file
        );
        setKoordReguPenanggulanganKebakaranfileName(
          data.data[0]?.koord_regu_penanggulangan_kebakaran_file
        );
        setAhliK3SpesialisPenanggulanganKebakaranfileName(
          data.data[0]?.ahli_k3_spesialis_penanggulangan_kebakaran_file
        );

        setIdentifikasiBahayafileName(data.data[0]?.identifikasi_bahaya_file);
        setStrukturOrganisasiTktdfileName(
          data.data[0]?.struktur_organisasi_tktd_file
        );
        setDokumentasiSosialisasifileName(
          data.data[0]?.dokumentasi_sosialisasi_file
        );
        setRekamDataInspeksifileName(data.data[0]?.rekam_data_inspeksi_file);
        setDokumenLaporanSimulasifileName(
          data.data[0]?.dokumen_laporan_simulasi_file
        );
        setJmlKaryawanSimulasifileName(
          data.data[0]?.jml_karyawan_simulasi_file
        );

        setIdentifikasiBahayafileNo(data.data[0]?.ibpr_no);
        setStrukturOrganisasiTktdfileNo(
          data.data[0]?.dokumen_struktur_organisasi_tktd_no
        );
        setDokumentasiSosialisasifileNo(
          data.data[0]?.dokumentasi_sosialisasi_awarreness_no
        );
        setRekamDataInspeksifileNo(data.data[0]?.rekam_data_inspeksi_no);
        setDokumenLaporanSimulasifileNo(
          data.data[0]?.dokumen_laporan_simulasi_no
        );
        setJmlKaryawanSimulasifileNo(data.data[0]?.absensi_karyawan_no);
        setJmlPetugasKebakaran(
          data.data[0]?.petugas_peran_kebakaran_jumlah_kesiapan
        );
        setJmlReguPenanggulangan(
          data.data[0]?.regu_penaggulangan_kebakaran_jumlah_kesiapan
        );
        setJmlKoord(
          data.data[0]
            ?.koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan
        );
        setJmlK3(
          data.data[0]
            ?.ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan
        );

        setCabangValue(data.data[0]?.cabang);
        setSiteValue(data.data[0]?.site);
        setPlantValue(data.data[0]?.plant);
        setNamaBMSM(data.data[0]?.nama_BM_SM);
        setNamaADH(data.data[0]?.nama_ADH);
        setNamaESROfficerLeader(data.data[0]?.nama_ESR_Officer_Leader);
        setNomorTeleponESROfficerLeader(
          data.data[0]?.nomor_telepon_ESR_Officer_Leader
        );
        setNomorTeleponDamkarSetempat(
          data.data[0]?.nomor_telepon_damkar_setempat
        );
        setNomorTeleponRSSetempat(data.data[0]?.nomor_Telepon_RS_setempat);
        setJumlahKaryawan(data.data[0]?.jumlah_karyawan);
        setLuasTanahKeseluruhan(data.data[0]?.luas_tanah_keseluruhan);
        setStatusKepemilikanArea(data.data[0]?.status_kepemilikan_area);
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
      plant,
      new Date(dateString as string).getFullYear(),
      month
    );
  };

  const handleCancelAdd = () => {
    setOpenModalAdd(false);
  };

  const onChangeMonth: DatePickerProps['onChange'] = (date, dateString) => {
    setMonth(new Date(dateString as string).getMonth() + 1);
    fetchData(
      cabang,
      site,
      plant,
      year,
      new Date(dateString as string).getMonth() + 1
    );
  };

  const handleChangeCabang = (value: any) => {
    setCabang(value);
    fetchData(value, site, plant, year, month);
  };

  const handleChangeSite = (value: any) => {
    setSite(value);
    fetchData(cabang, value, plant, year, month);
  };

  const handleChangePlant = (value: any) => {
    setPlant(value);
    fetchData(cabang, site, value, year, month);
  };

  const beforeUpload = (file: any) => {
    return false; // Allow upload for all files
  };

  function setDataForEdit() {
    // Set the values in the form
    form.setFieldsValue(dataEdit[0]);
    setOpenModalAdd(true);
  }

  function downloadFile(fileName: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }
    fetch(`${config.apiUrl}/proteksi-kebakaran-area/download/${fileName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include bearer token in the headers
        'client-id': config.clientID,
        'client-secret': config.clientSecret,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  }

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  return (
    <div>
      {contextHolder}
      <div>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setEditMode(false);
            setOpenModalAdd(true);
          }}
          style={{ margin: 16 }}
        >
          Add Data
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setDataForEdit();
            setEditMode(true);
          }}
          style={{ margin: 16 }}
        >
          Edit Data
        </Button>

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
          defaultValue={
            optionsPlant[0] ? optionsPlant[0].value : 'Please Select'
          }
          style={{ width: 150, margin: 16 }}
          onChange={handleChangePlant}
          options={optionsPlant}
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
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content auto',
          rowGap: '5px',
        }}
      >
        <p style={{ textAlign: 'left' }}>Cabang</p>
        <p style={{ textAlign: 'left' }}>: {cabangValue}</p>
        <p style={{ textAlign: 'left' }}>Site</p>
        <p style={{ textAlign: 'left' }}>: {siteValue}</p>
        <p style={{ textAlign: 'left' }}>Plant</p>
        <p style={{ textAlign: 'left' }}>: {plantValue}</p>
        <p style={{ textAlign: 'left' }}>Nama BM/SM</p>
        <p style={{ textAlign: 'left' }}>: {namaBMSM}</p>
        <p style={{ textAlign: 'left' }}>Nama ADH</p>
        <p style={{ textAlign: 'left' }}>: {namaADH}</p>
        <p style={{ textAlign: 'left' }}>Nama ESR Officer/Leader</p>
        <p style={{ textAlign: 'left' }}>: {namaESROfficerLeader}</p>
        <p style={{ textAlign: 'left' }}>Nomor Telepon ESR Officer/Leader</p>
        <p style={{ textAlign: 'left' }}>: {nomorTeleponESROfficerLeader}</p>
        <p style={{ textAlign: 'left' }}>Nomor Telepon Damkar Setempat</p>
        <p style={{ textAlign: 'left' }}>: {nomorTeleponDamkarSetempat}</p>
        <p style={{ textAlign: 'left' }}>Nomor Telepon RS Setempat</p>
        <p style={{ textAlign: 'left' }}>: {nomorTeleponRSSetempat}</p>
        <p style={{ textAlign: 'left' }}>
          Jumlah Karyawan, Partner, Vendor dan Siswa PKL
        </p>
        <p style={{ textAlign: 'left' }}>: {jumlahKaryawan}</p>
        <p style={{ textAlign: 'left' }}>Luas Tanah Keseluruhan</p>
        <p style={{ textAlign: 'left' }}>: {luasTanahKeseluruhan}</p>
        <p style={{ textAlign: 'left' }}>Status Kepemilikan Area</p>
        <p style={{ textAlign: 'left' }}>
          : {statusKepemilikanArea} /
          <Button
            onClick={() => downloadFile(sertifikatKepemilikanfileName)}
            type="link"
          >
            {sertifikatKepemilikanfileName}
          </Button>
        </p>
      </div>

      <table border={1} style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th style={{ minWidth: 330 }}>Dokumen Unggahan</th>
            <th style={{ minWidth: 200 }}>Jumlah</th>
            <th style={{ minWidth: 200 }}>Upload</th>
            <th style={{ minWidth: 150 }}>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Petugas Peran Kebakaran (D)</td>
            <td style={{ textAlign: 'center' }}>{jmlPetugasKebakaran}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(petugasPeranKebakaranfileName)}
                type="link"
              >
                {petugasPeranKebakaranfileName}
              </Button>
            </td>
            <td rowSpan={4} style={{ textAlign: 'center' }}>
              Unit penanggulangan kebakaran yang terdaftar adalah personal yang
              telah memiliki sertifikasi kompetensi Tingkat A;B;C;D sesuai
              Keputusan Menteri Tenaga Kerja R.I No.Kep.186/Men/1999 Tentang
              Unit Penanggulangan Kebakaran Ditempat Kerja
            </td>
          </tr>
          <tr>
            <td>Regu Penanggulangan Kebakaran (C)</td>
            <td style={{ textAlign: 'center' }}>{jmlReguPenanggulangan}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() =>
                  downloadFile(reguPenanggulanganKebakaranfileName)
                }
                type="link"
              >
                {reguPenanggulanganKebakaranfileName}
              </Button>
            </td>
            <td style={{ textAlign: 'center' }}></td>
          </tr>
          <tr>
            <td>Koordinator Unit Penanggulangan Kebakaran (B)</td>
            <td style={{ textAlign: 'center' }}>{jmlKoord}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() =>
                  downloadFile(koordReguPenanggulanganKebakaranfileName)
                }
                type="link"
              >
                {koordReguPenanggulanganKebakaranfileName}
              </Button>
            </td>
            <td style={{ textAlign: 'center' }}></td>
          </tr>
          <tr>
            <td>Ahli K3 Spesialis Penanggulangan Kebakaran (A)</td>
            <td style={{ textAlign: 'center' }}>{jmlK3}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() =>
                  downloadFile(ahliK3SpesialisPenanggulanganKebakaranfileName)
                }
                type="link"
              >
                {ahliK3SpesialisPenanggulanganKebakaranfileName}
              </Button>
            </td>
            <td style={{ textAlign: 'center' }}></td>
          </tr>
        </tbody>
      </table>
      <table border={1} style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th style={{ maxWidth: 400 }}>Dokumen Unggahan</th>
            <th style={{ minWidth: 200 }}>Nomor Dokumen</th>
            <th style={{ minWidth: 150 }}>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Identifikasi Bahaya, penilaian resiko serta penentuan upaya
              pengendalian resiko kebakaran di area kerja (IBPR) disahkan SM/BM
            </td>
            <td style={{ textAlign: 'center' }}>{identifikasiBahayafileNo}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(identifikasiBahayafileName)}
                type="link"
              >
                {identifikasiBahayafileName}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              Dokumen Struktur Organisasi TKTD beserta tugas dan tanggung jawab
              disahkan oleh SM/BM.
            </td>
            <td style={{ textAlign: 'center' }}>
              {strukturOrganisasiTktdfileNo}
            </td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(strukturOrganisasiTktdfileName)}
                type="link"
              >
                {strukturOrganisasiTktdfileName}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              Dokumentasi (notulensi, attendance list serta foto kegiatan)
              sosialisasi awarreness peningkatan kewaspadaan dan antisipasi
              potensi kebakaran.
            </td>
            <td style={{ textAlign: 'center' }}>
              {dokumentasiSosialisasifileNo}
            </td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(dokumentasiSosialisasifileName)}
                type="link"
              >
                {dokumentasiSosialisasifileName}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              Rekam data inspeksi terhadap tindakan tidak aman, kondisi tidak
              aman dan sarana prasarana sistem proteksi kebakaran.
            </td>
            <td style={{ textAlign: 'center' }}>{rekamDataInspeksifileNo}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(rekamDataInspeksifileName)}
                type="link"
              >
                {rekamDataInspeksifileName}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              Dokumen laporan simulasi tanggap darurat kebakaran disahkan SM/BM.
            </td>
            <td style={{ textAlign: 'center' }}>
              {dokumenLaporanSimulasifileNo}
            </td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(dokumenLaporanSimulasifileName)}
                type="link"
              >
                {dokumenLaporanSimulasifileName}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              Jumlah Karyawan yang mengikuti simulasi tanggap darurat kebakaran
              (berdasarkan dokumen absensi).
            </td>
            <td style={{ textAlign: 'center' }}>{jmlKaryawanSimulasifileNo}</td>
            <td style={{ textAlign: 'center' }}>
              <Button
                onClick={() => downloadFile(jmlKaryawanSimulasifileName)}
                type="link"
              >
                {jmlKaryawanSimulasifileName}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Modal
        title="Add Data"
        open={openModalAdd}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
        width={600}
        destroyOnClose={true}
      >
        <Form
          form={form}
          onFinish={handleOkAdd}
          layout="vertical"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Cabang"
            name="cabang"
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Site" name="site">
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Plant" name="plant">
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nama BM/SM"
            name="nama_BM_SM"
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nama ADH"
            name="nama_ADH"
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nama ESR Officer/Leader"
            name="nama_ESR_Officer_Leader"
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nomor Telepon ESR Officer/Leader"
            name="nomor_telepon_ESR_Officer_Leader"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nomor Telepon Damkar Setempat"
            name="nomor_telepon_damkar_setempat"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Nomor Telepon RS Setempat"
            name="nomor_Telepon_RS_setempat"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Jumlah Karyawan, Partner, Vendor dan Siswa PKL:"
            name="jumlah_karyawan"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            name="luas_tanah_keseluruhan"
            label="Luas Tanah"
          >
            <InputNumber
              placeholder="luas bangunan"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Status Kepemilikan"
            name="status_kepemilikan_area"
          >
            <Select style={{ width: '100%' }} options={optionsKepemilikan} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: !editMode,
                message: 'Please input your data!',
              },
            ]}
            label="Upload Sertifikat Kepemilikan"
            valuePropName="fileList"
            name="sertifikat_kepemilikan"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={beforeUpload}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <p>Petugas Peran Kebakaran (D)</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="petugas_peran_kebakaran_jumlah_kesiapan"
                label="Jumlah Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="petugas_peran_kebakaran_jumlah_kecukupan"
                label="Jumlah Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="petugas_peran_kebakaran"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <p>Regu Penanggulangan Kebakaran (C)</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="regu_penaggulangan_kebakaran_jumlah_kesiapan"
                label="Jumlah Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="regu_penaggulangan_kebakaran_jumlah_kecukupan"
                label="Jumlah Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="regu_penanggulangan_kebakaran"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <p>Koordinator Unit Penanggulangan Kebakaran (B)</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="koordinator_unit_penanggulangan_kebakaran_jumlah_kesiapan"
                label="Jumlah Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="koordinator_unit_penanggulangan_kebakaran_jumlah_kecukupan"
                label="Jumlah Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="koord_regu_penanggulangan_kebakaran"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <p>Ahli K3 Spesialis Penanggulangan Kebakaran (A)</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kesiapan"
                label="Jumlah Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="ahli_k3_spesialis_penanggulangan_kebakaran_jumlah_kecukupan"
                label="Jumlah Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="ahli_k3_spesialis_penanggulangan_kebakaran"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <p>
            Identifikasi Bahaya, penilaian resiko serta penentuan upaya
            pengendalian resiko kebakaran di area kerja (IBPR) disahkan SM/BM
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="ibpr_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="identifikasi_bahaya"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>
            Dokumen Struktur Organisasi TKTD beserta tugas dan tanggung jawab
            disahkan oleh SM/BM.
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="dokumen_struktur_organisasi_tktd_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="struktur_organisasi_tktd"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>
            Dokumentasi (notulensi, attendance list serta foto kegiatan)
            sosialisasi awarreness peningkatan kewaspadaan dan antisipasi
            potensi kebakaran.
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="dokumentasi_sosialisasi_awarreness_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="dokumentasi_sosialisasi"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>
            Rekam data inspeksi terhadap tindakan tidak aman, kondisi tidak aman
            dan sarana prasarana sistem proteksi kebakaran.
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="rekam_data_inspeksi_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="rekam_data_inspeksi"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>
            Dokumen laporan simulasi tanggap darurat kebakaran disahkan SM/BM.
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="dokumen_laporan_simulasi_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="dokumen_laporan_simulasi"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>
            Jumlah Karyawan yang mengikuti simulasi tanggap darurat kebakaran
            (berdasarkan dokumen absensi).
          </p>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input your data!',
                  },
                ]}
                name="absensi_karyawan_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: !editMode,
                    message: 'Please input your data!',
                  },
                ]}
                label="Upload"
                valuePropName="fileList"
                name="jml_karyawan_simulasi"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DataUmum;
