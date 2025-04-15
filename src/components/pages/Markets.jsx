import React, { useState } from 'react';
import { Table, Input, Typography, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCrypto } from '../../context/cryptoContext';

const { Title } = Typography;

export default function Markets() {
  const { crypto } = useCrypto();
  const [searchText, setSearchText] = useState('');

  const filteredData = crypto.filter(
    coin =>
      coin.name.toLowerCase().includes(searchText.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          <img src={record.icon} alt={text} style={{ width: 25, marginRight: 10 }} />
          {text} ({record.symbol})
        </span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: cap => `$${(cap / 1e9).toFixed(2)}B`,
      sorter: (a, b) => a.marketCap - b.marketCap,
    },
    {
      title: 'Volume (24h)',
      dataIndex: 'volume',
      key: 'volume',
      render: volume => `$${(volume / 1e6).toFixed(2)}M`,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: '24h Change',
      dataIndex: 'priceChange1d',
      key: 'priceChange1d',
      render: change => (
        <span style={{ color: change >= 0 ? '#3f8600' : '#cf1322' }}>
          {change >= 0 ? '+' : ''}
          {change}%
        </span>
      ),
      sorter: (a, b) => a.priceChange1d - b.priceChange1d,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Cryptocurrency Markets</Title>

      <Card>
        <Input
          placeholder="Search by name or symbol"
          prefix={<SearchOutlined />}
          style={{ marginBottom: 16, width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
}
