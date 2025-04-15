import React, { useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Typography, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCrypto } from '../../context/cryptoContext';

const { Title } = Typography;
const { Option } = Select;

export default function Portfolio() {
  const { assets, crypto, addAsset } = useCrypto();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const portfolioValue = assets.reduce((total, asset) => {
    const coin = crypto.find(c => c.id === asset.id);
    return total + (coin?.price || 0) * asset.amount;
  }, 0);

  const columns = [
    {
      title: 'Asset',
      dataIndex: 'id',
      key: 'asset',
      render: id => {
        const coin = crypto.find(c => c.id === id);
        return (
          <span>
            <img src={coin?.icon} alt={coin?.name} style={{ width: 25, marginRight: 10 }} />
            {coin?.name}
          </span>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => {
        const coin = crypto.find(c => c.id === record.id);
        const value = (coin?.price || 0) * record.amount;
        return `$${value.toLocaleString()}`;
      },
    },
    {
      title: '24h Change',
      key: 'change',
      render: (_, record) => {
        const coin = crypto.find(c => c.id === record.id);
        return (
          <span style={{ color: (coin?.priceChange1d || 0) >= 0 ? '#3f8600' : '#cf1322' }}>
            {coin?.priceChange1d >= 0 ? '+' : ''}
            {coin?.priceChange1d}%
          </span>
        );
      },
    },
  ];

  const handleAddAsset = values => {
    addAsset({
      id: values.asset,
      amount: parseFloat(values.amount),
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Your Portfolio</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Asset
          </Button>
        </Col>
      </Row>

      <Card>
        <Title level={4}>Total Portfolio Value: ${portfolioValue.toLocaleString()}</Title>
        <Table dataSource={assets} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Add Asset"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} onFinish={handleAddAsset} layout="vertical">
          <Form.Item
            name="asset"
            label="Select Asset"
            rules={[{ required: true, message: 'Please select an asset!' }]}
          >
            <Select>
              {crypto.map(coin => (
                <Option key={coin.id} value={coin.id}>
                  {coin.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input the amount!' }]}
          >
            <Input type="number" min="0" step="0.000001" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
