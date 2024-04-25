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
import { UploadOutlined } from '@ant-design/icons';
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

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const FormArea: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = React.useState<DataType[]>([]);
  const [dataEdit, setDataEdit] = React.useState<DataType[]>([]);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [cabang, setCabang] = React.useState<string>('');
  const [bangunan, setBangunan] = React.useState<string>('office');
  const [id, setId] = React.useState<string>('');
  const [fileName, setFileName] = React.useState<string>('');
  const [fileNo, setFileNo] = React.useState<string>('');
  const [optionsCabang, setOptionsCabang] = React.useState<any[]>([]);
  const [optionsBangunan, setOptionsBangunan] = React.useState<any[]>([
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

  const beforeUpload = (file: any) => {
    return false; // Allow upload for all files
  };

  useEffect(() => {
    getDataCabang();
    fetchData(cabang, bangunan, year, month);
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
          if (key !== 'layout_denah_area') {
            formData.append(key, value);
          }
        });

        // Append additional data
        formData.append('account_name', localStorage.getItem('name') ?? '');
        formData.append('role', localStorage.getItem('rolename') ?? '');

        // Append the file
        const fileList = values.layout_denah_area;
        if (fileList && fileList.length > 0) {
          formData.append('layout_denah_area', fileList[0].originFileObj);
        }

        // Send POST request with the form data
        if (editMode) {
          fetch(`${config.apiUrl}/proteksi-kebakaran-area/edit/${id}`, {
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
              fetchData(cabang, bangunan, year, month);
              setOpenModalAdd(false);
            })
            .catch((err) => {
              error(err.toString());
            });
        } else {
          fetch(`${config.apiUrl}/proteksi-kebakaran-area/save`, {
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
              fetchData(cabang, bangunan, year, month);
              setOpenModalAdd(false);
            })
            .catch((err) => {
              error(err.toString());
            });
        }
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const fetchData = (
    cabang: string,
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
        const res = data.data[0] ? data.data[0] : {};
        setDataEdit(data.data);
        setId(data.data[0]?._id);
        setFileName(data.data[0]?.layout_denah_area_file);
        setFileNo(data.data[0]?.layout_no);
        const transformedData = Object.entries(res)
          .filter(([key, value]) => key.endsWith('_tersedia') && value !== null)
          .map(([key, value]) => ({
            unit:
              key.split('_tersedia')[0] === 'hydrant_dlm_gedung'
                ? 'HYDRANT DALAM GEDUNG'
                : key.split('_tersedia')[0] === 'volume_water_tank'
                ? 'VOLUME WATER TANK'
                : key.split('_tersedia')[0] === 'nozle_25'
                ? 'NOZLE 2.5 Inch'
                : key.split('_tersedia')[0] === 'nozle_15'
                ? 'NOZLE 1.5 Inch'
                : key.split('_tersedia')[0] === 'hydrant_hoose_25'
                ? 'HYDRANT HOOSE 2.5 Inch'
                : key.split('_tersedia')[0] === 'hydrant_hoose_15'
                ? 'HYDRANT HOOSE 1.5 Inch'
                : key.split('_')[0].toUpperCase() +
                  ' ' +
                  key.split('_')[1].toUpperCase(),
            tersedia: value,
            kecukupan: res[`${key.split('_tersedia')[0]}_kecukupan`],
            kesiapan: res[`${key.split('_tersedia')[0]}_kesiapan`],
          }));
        console.log('transformedData', transformedData);
        setData(transformedData);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };

  function downloadFile() {
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
      .catch((err) => {
        console.error('Error downloading file:', err);
      });
  }

  function setDataForEdit() {
    // Set the values in the form
    form.setFieldsValue(dataEdit[0]);
    setOpenModalAdd(true);
  }

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
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };
  const handleCancelAdd = () => {
    setOpenModalAdd(false);
  };

  const onChangeYear: DatePickerProps['onChange'] = (date, dateString) => {
    setYear(new Date(dateString as string).getFullYear());
    fetchData(
      cabang,
      bangunan,
      new Date(dateString as string).getFullYear(),
      month
    );
  };

  const onChangeMonth: DatePickerProps['onChange'] = (date, dateString) => {
    setMonth(new Date(dateString as string).getMonth() + 1);
    fetchData(
      cabang,
      bangunan,
      year,
      new Date(dateString as string).getMonth() + 1
    );
  };

  const handleChangeCabang = (value: any) => {
    setCabang(value);
    fetchData(value, bangunan, year, month);
  };

  const handleChangeBangunan = (value: any) => {
    setBangunan(value);
    fetchData(cabang, value, year, month);
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
          defaultValue="office"
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
      </div>
      <p>Dokumen Unggahan</p>
      <p>
        No Dokumen : {fileNo}{' '}
        <Button onClick={downloadFile} type="link">
          {fileName}
        </Button>
      </p>

      <Table columns={columns} dataSource={data} />
      <Card>
        <p>
          <b>Sarana Kesiapsiagaan Tanggap Darurat (KTD).</b>
          <br />
          1. Alat Pengendali Api Ringan (APAR) Permenaker No. 04/MEN/1980.{' '}
          <br />
          2. Hydrant (Permen PU No. 26/KPTS/2008) Perda/ Persyaratan izin
          terkait (UUG, IMB, SLF, dll). <br />
          3. Alarm Kebakaran Manual dan / atau Otomatis Permen PU No. 26 Tahun
          2008 (Bagunan gedung kantor usaha profesional komersial dll) <br />
          <b>Note : </b>
          <br />
          <b>Tulis N/A</b> jika terdapat instalasi yang tidak perlu di
          aplikasikan di area terkait.
          <br />
          <b>Ketersediaan:</b> Jumlah unit proteksi kebakaran yang berada di
          masing-masing instalasi.
          <br />
          <b>Kesiapan:</b> Jumlah unit proteksi kebakaran yang siap digunakan
          atau kondisi baik/tidak rusak.
          <br />
          <b>Kecukupan:</b> Jumlah unit sesuai dengan persyaratan perundangan.
        </p>
      </Card>
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
          <Form.Item label="Cabang" name="cabang">
            <Select style={{ width: '100%' }} options={optionsCabang} />
          </Form.Item>
          <Form.Item label="Bangunan" name="bangunan">
            <Select style={{ width: '100%' }} options={optionsBangunan} />
          </Form.Item>
          <Form.Item name="luas_bangunan" label="Luas Bangunan">
            <InputNumber
              placeholder="luas bangunan"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="Status Kepemilikan" name="status_kepemilikan_area">
            <Select style={{ width: '100%' }} options={optionsKepemilikan} />
          </Form.Item>
          <p>Layout denah sistem proteksi kebakaran di office</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="layout_no"
                label="No Dokumen"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="No Dokumen" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Upload"
                valuePropName="fileList"
                name="layout_denah_area"
                getValueFromEvent={normFile}
              >
                <Upload beforeUpload={beforeUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <p>Push Button</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="push_button_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="push_button_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="push_button_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <p>Heat Detector</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="heat_detector_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="heat_detector_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="heat_detector_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Smoke Detector</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="smoke_detector_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="smoke_detector_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="smoke_detector_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Alarm Kebakaran</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="alarm_kebakaran_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="alarm_kebakaran_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="alarm_kebakaran_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Sprinkler </p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="sprinkler_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sprinkler_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sprinkler_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>APAR AF11</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="apar_AF11_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_AF11_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_AF11_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>APAR WATER</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="apar_WATER_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_WATER_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_WATER_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>APAR Foam AFFF</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="apar_Foam_AFFF_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_Foam_AFFF_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_Foam_AFFF_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>APAR Dry Chemical Powder</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="apar_Dry_Chemical_Powder_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_Dry_Chemical_Powder_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_Dry_Chemical_Powder_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>APAR CO2</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="apar_CO2_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_CO2_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="apar_CO2_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Volume Water Tank</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="volume_water_tank_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="volume_water_tank_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="volume_water_tank_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Hydrant Portable</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="hydrant_portable_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_portable_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_portable_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Jockey Pump</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="jockey_pump_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="jockey_pump_kesiapan"
                style={{ marginBottom: 0 }}
                label="Kesiapan"
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="jockey_pump_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Electric Pump</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="electric_pump_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="electric_pump_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="electric_pump_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Diesel Pump</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="diesel_pump_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="diesel_pump_kesiapan"
                style={{ marginBottom: 0 }}
                label="Kesiapan"
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="diesel_pump_kecukupan"
                style={{ marginBottom: 0 }}
                label="Kecukupan"
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Hydrant Dalam Gedung</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="hydrant_dlm_gedung_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_dlm_gedung_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_dlm_gedung_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Hydrant Pilar/Hydrant Luar Gedung</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="hydrant_pillar_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_pillar_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_pillar_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Hydrant Hose 2.5 Inch</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_25_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_25_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_25_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Hydrant Hose 1.5 Inch</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_15_tersedia"
                label="Tersedia"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_15_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hydrant_hoose_15_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Nozle 2.5 Inch</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="nozle_25_tersedia"
                style={{ marginBottom: 0 }}
                label="Tersedia"
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nozle_25_kesiapan"
                style={{ marginBottom: 0 }}
                label="kesiapan"
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nozle_25_kecukupan"
                style={{ marginBottom: 0 }}
                label="Kecukupan"
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Nozle 1.5 Inch</p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="nozle_15_tersedia"
                style={{ marginBottom: 0 }}
                label="Tersedia"
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nozle_15_kesiapan"
                style={{ marginBottom: 0 }}
                label="kesiapan"
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nozle_15_kecukupan"
                style={{ marginBottom: 0 }}
                label="Kecukupan"
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <p>Kunci Pilar Hydrant </p>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="kunci_hydrant_pillar_tersedia"
                style={{ marginBottom: 0 }}
                label="Tersedia"
              >
                <InputNumber
                  placeholder="Ketersediaan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="kunci_hydrant_pillar_kesiapan"
                label="Kesiapan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber placeholder="Kesiapan" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="kunci_hydrant_pillar_kecukupan"
                label="Kecukupan"
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="Kecukupan"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default FormArea;
