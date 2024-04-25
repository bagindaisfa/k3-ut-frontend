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
  problem_identification: string;
  root_cause: string;
  corrective_action: string;
  preventive_action: string;
  dead_line: string;
  pic: string;
  status: string;
}

const FormEval: React.FC = () => {
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
      title: 'PROBLEM IDENTIFICATION',
      dataIndex: 'problem_identification',
      key: 'problem_identification',
    },
    {
      title: 'ROOT CAUSE',
      dataIndex: 'root_cause',
      key: 'root_cause',
    },
    {
      title: 'CORRECTIVE ACTION',
      dataIndex: 'corrective_action',
      key: 'corrective_action',
    },
    {
      title: 'PREVENTIVE ACTION',
      dataIndex: 'preventive_action',
      key: 'preventive_action',
    },
    {
      title: 'DEAD LINE',
      dataIndex: 'dead_line',
      key: 'dead_line',
    },
    {
      title: 'PIC',
      dataIndex: 'pic',
      key: 'pic',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <Tag color={status === 'open' ? 'volcano' : 'green'} key={status}>
          {status?.toUpperCase()}
        </Tag>
      ),
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
        values.dead_line = dayjs(values.dead_line).format(dateFormat);
        const requestBody = {
          ...values,
          account_name: localStorage.getItem('name'),
          role: localStorage.getItem('rolename'),
        };
        // Send POST request with the form data
        if (editMode) {
          fetch(`${config.apiUrl}/form-eval-proteksi-kebakaran/edit/${id}`, {
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
          fetch(`${config.apiUrl}/form-eval-proteksi-kebakaran/save`, {
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

  const fetchData = (year: number, month: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage.');
      window.location.href = '/login';
      return;
    }

    fetch(
      `${
        config.apiUrl
      }/form-eval-proteksi-kebakaran/get?role=${localStorage.getItem(
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

    fetch(`${config.apiUrl}/form-eval-proteksi-kebakaran/delete/${id}`, {
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
    data.dead_line = dayjs(data.dead_line, dateFormat);
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
          <Form.Item label="Department / Divisi" name="dept">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="Keterangan" name="keterangan">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            label="PROBLEM IDENTIFICATION"
            name="problem_identification"
          >
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="ROOT CAUSE" name="root_cause">
            <Input placeholder="root cause" />
          </Form.Item>
          <Form.Item label="CORRECTIVE ACTION" name="corrective_action">
            <Input placeholder="corrective action" />
          </Form.Item>
          <Form.Item label="PREVENTIVE ACTION" name="preventive_action">
            <Input placeholder="preventive action" />
          </Form.Item>
          <Form.Item label="DEAD LINE" name="dead_line">
            <DatePicker
              defaultValue={dayjs('01/01/2015', dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label="PIC" name="pic">
            <Input placeholder="pic" />
          </Form.Item>
          <Form.Item label="STATUS" name="status">
            <Select
              value={status}
              style={{ width: '100%' }}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormEval;
