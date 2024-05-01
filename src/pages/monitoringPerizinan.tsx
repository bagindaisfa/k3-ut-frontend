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
  InputNumber,
} from 'antd';
import type { TableProps, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { config } from '../config';

dayjs.extend(customParseFormat);
const dateFormat = 'DD/MM/YYYY';

interface DataType {
  _id: string;
  no: number;
  objek_perizinan: string;
  area: string;
  no_izin_pengesahan: string;
  jml_instalasi: number;
  pelaksanaan_pemeriksaan: string;
  hasil_pemeriksaan: string;
  batas_waktu_perizinan: string;
  status_perizinan: string;
  countdown: string;
  link_dokumen: string;
  keterangan: string;
}

const MonitoringPerizinan: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = React.useState<DataType[]>([]);
  const [openModalAdd, setOpenModalAdd] = React.useState(false);
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [status, setStatus] = React.useState('open');
  const [id, setId] = React.useState('');
  const [editMode, setEditMode] = React.useState(false);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: 'Objek Perizinan',
      dataIndex: 'objek_perizinan',
      key: 'objek_perizinan',
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'No Izin Pengesahan',
      dataIndex: 'no_izin_pengesahan',
      key: 'no_izin_pengesahan',
    },
    {
      title: 'Jumlah Instalasi',
      dataIndex: 'jml_instalasi',
      key: 'jml_instalasi',
    },
    {
      title: 'Pelaksanaan Pemeriksaan',
      dataIndex: 'pelaksanaan_pemeriksaan',
      key: 'pelaksanaan_pemeriksaan',
      render: (pelaksanaan_pemeriksaan) =>
        dayjs(pelaksanaan_pemeriksaan).format(dateFormat),
    },
    {
      title: 'Hasil Pemeriksaan',
      dataIndex: 'hasil_pemeriksaan',
      key: 'hasil_pemeriksaan',
    },
    {
      title: 'Batas Waktu Perizinan',
      dataIndex: 'batas_waktu_perizinan',
      key: 'batas_waktu_perizinan',
      render: (batas_waktu_perizinan) =>
        dayjs(batas_waktu_perizinan).format(dateFormat),
    },
    {
      title: 'Status Perizinan*',
      dataIndex: 'status_perizinan',
      key: 'status_perizinan',
      render: (_, { status_perizinan }) => (
        <Tag
          color={status_perizinan === 'Tidak Berlaku' ? 'volcano' : 'green'}
          key={status_perizinan}
        >
          {status_perizinan?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Countdown',
      dataIndex: 'countdown',
      key: 'countdown',
    },
    {
      title: 'Link Dokumen Perizinan (open access)',
      dataIndex: 'link_dokumen',
      key: 'link_dokumen',
      render: (link_dokumen) => (
        <a href={link_dokumen} target="_blank">
          {link_dokumen}
        </a>
      ),
    },
    {
      title: 'Keterangan',
      dataIndex: 'keterangan',
      key: 'keterangan',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => editData(record)}>Edit</a>
          <a onClick={() => deleteData(record._id)}>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData(year, month);
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
        // Format the dead_line date field
        let requestBody = {};
        if (
          values.area &&
          values.batas_waktu_perizinan &&
          values.hasil_pemeriksaan &&
          values.jml_instalasi &&
          values.keterangan &&
          values.link_dokumen &&
          values.no_izin_pengesahan &&
          values.objek_perizinan &&
          values.pelaksanaan_pemeriksaan
        ) {
          requestBody = {
            ...values,
            account_name: localStorage.getItem('name'),
            role: localStorage.getItem('rolename'),
          };
        } else {
          error('Please fill all the fields');
          return;
        }
        // Send POST request with the form data
        if (editMode) {
          fetch(`${config.apiUrl}/legal-spi/edit/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`, // Include bearer token in the headers
              'Content-Type': 'application/json',
              'client-id': config.clientID,
              'client-secret': config.clientSecret,
            },
            body: JSON.stringify(requestBody),
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
              fetchData(year, month);
              setOpenModalAdd(false);
            })
            .catch((err) => {
              error(err.toString());
              console.error('Error posting form data:', err);
            });
        } else {
          fetch(`${config.apiUrl}/legal-spi/save`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Include bearer token in the headers
              'Content-Type': 'application/json',
              'client-id': config.clientID,
              'client-secret': config.clientSecret,
            },
            body: JSON.stringify(requestBody),
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
              fetchData(year, month);
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

  const getRemainingDays = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const today = new Date();
    const differenceInTime = endDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    console.log('differenceInDays:', differenceInDays);
    return isNaN(differenceInDays) ? 0 : differenceInDays;
  };

  const fetchData = (year: number, month: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(
      `${config.apiUrl}/legal-spi/get?role=${localStorage.getItem(
        'rolename'
      )}&year=${year}&month=${month}`,
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
        data.data.forEach((item: any) => {
          const remainingDays = getRemainingDays(item.batas_waktu_perizinan);
          item.countdown = `${remainingDays} Hari`;
          item.status_perizinan =
            remainingDays <= 60 ? 'Tidak Berlaku' : 'Berlaku';
        });

        setData(data.data);
      })
      .catch((err) => {
        error(err.toString());
        console.error('Error fetching data:', err);
      });
  };

  const deleteData = (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(`${config.apiUrl}/legal-spi/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Include bearer token in the headers
        'Content-Type': 'application/json',
        'client-id': config.clientID,
        'client-secret': config.clientSecret,
      },
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
        success('Deleted successfully');
        fetchData(year, month);
      })
      .catch((err) => {
        error(err.toString());
        console.error('Error posting form data:', err);
      });
  };

  const editData = (data: any) => {
    setEditMode(true);
    data.pelaksanaan_pemeriksaan = dayjs(
      data.pelaksanaan_pemeriksaan,
      dateFormat
    );
    data.batas_waktu_perizinan = dayjs(data.batas_waktu_perizinan, dateFormat);
    form.setFieldsValue(data);
    setId(data._id);
    setOpenModalAdd(true);
  };

  const handleCancelAdd = () => {
    setOpenModalAdd(false);
  };

  const onChangeYear: DatePickerProps['onChange'] = (date, dateString) => {
    setYear(new Date(dateString as string).getFullYear());
    fetchData(new Date(dateString as string).getFullYear(), month);
  };

  const onChangeMonth: DatePickerProps['onChange'] = (date, dateString) => {
    setMonth(new Date(dateString as string).getMonth() + 1);
    fetchData(year, new Date(dateString as string).getMonth() + 1);
  };

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
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Add Data"
        open={openModalAdd}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
      >
        <Form layout="vertical" form={form} style={{ maxWidth: 600 }}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Objek Perizinan"
            name="objek_perizinan"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Area"
            name="area"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="No Izin Pengesahan"
            name="no_izin_pengesahan"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Jumlah Instalasi"
            name="jml_instalasi"
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
            label="Pelaksanaan Pemeriksaan"
            name="pelaksanaan_pemeriksaan"
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Hasil Pemeriksaan"
            name="hasil_pemeriksaan"
          >
            <Select
              style={{ width: '100%' }}
              options={[
                {
                  value: 'Memenuhi Persyaratan K3',
                  label: 'Memenuhi Persyaratan K3',
                },
                {
                  value: 'Tidak Memenuhi Persyaratan K3',
                  label: 'Tidak Memenuhi Persyaratan K3',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Batas Waktu Perizinan"
            name="batas_waktu_perizinan"
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Link Dokumen Perizinan (open access)"
            name="link_dokumen"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please input your data!',
              },
            ]}
            label="Keterangan"
            name="keterangan"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonitoringPerizinan;
