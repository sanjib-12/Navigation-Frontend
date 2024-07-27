import { useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Dropdown, Button, Modal, Table, message, Typography } from 'antd';
import { UserOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import { getHistoryData } from './../utility/HistoryDataHandler'

const LogoutButton = () => {
  const { logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem('user') || " ";

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const data = await getHistoryData();
      setHistoryData(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      message.error('Failed to load travel history');
    } finally {
      setLoading(false);
    }
  };

  const onViewHistory = () => {
    setIsModalVisible(true);
    fetchHistoryData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Start Location',
      dataIndex: 'startAddress',
      key: 'startAddress',
    },
    {
      title: 'End Location',
      dataIndex: 'endAddress',
      key: 'endAddress',
    },
    // {
    //   title: 'Start Location',
    //   dataIndex: ['startLocation', 'lat'],
    //   key: 'startLat',
    //   render: (text, record) => `${record.startLocation.lat.toFixed(4)}, ${record.startLocation.lng.toFixed(4)}`,
    // },
    // {
    //   title: 'End Location',
    //   dataIndex: ['endLocation', 'lat'],
    //   key: 'endLat',
    //   render: (text, record) => `${record.endLocation.lat.toFixed(4)}, ${record.endLocation.lng.toFixed(4)}`,
    // },
    {
      title: 'Travel Time',
      dataIndex: 'travelTime',
      key: 'travelTime',
    },
    {
      title: 'Travel Distance',
      dataIndex: 'travelDistance',
      key: 'travelDistance',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const menuItems = [
    {
      key: 'history',
      label: 'View History',
      icon: <HistoryOutlined />,
      onClick: onViewHistory
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: logout
    }
  ];

  const { Title } = Typography;  

  return (
    <>
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click']}
      >
        <Button 
          icon={<UserOutlined />}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
          }}
        >
          {username}
        </Button>
      </Dropdown>
      <Modal
        title={
          <Title level={4} style={{ textAlign: 'center', margin: 0 }}>
            Travel History
          </Title>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Table
          dataSource={historyData}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default LogoutButton;