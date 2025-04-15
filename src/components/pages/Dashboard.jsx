import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/charts';
import { useCrypto } from '../../context/cryptoContext';

const { Title } = Typography;

export default function Dashboard() {
  const { assets, crypto } = useCrypto();

  const topGainers = crypto.sort((a, b) => b.priceChange1d - a.priceChange1d).slice(0, 3);

  const topLosers = crypto.sort((a, b) => a.priceChange1d - b.priceChange1d).slice(0, 3);

  const marketData = {
    totalMarketCap: crypto.reduce((sum, coin) => sum + coin.marketCap, 0),
    volume24h: crypto.reduce((sum, coin) => sum + coin.volume, 0),
    btcDominance:
      ((crypto.find(coin => coin.symbol === 'BTC')?.marketCap || 0) /
        crypto.reduce((sum, coin) => sum + coin.marketCap, 0)) *
      100,
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          <img src={record.icon} alt={text} style={{ width: 25, marginRight: 10 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price.toLocaleString()}`,
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
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Crypto Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Market Cap"
              value={marketData.totalMarketCap}
              precision={0}
              prefix="$"
              formatter={value => `${(value / 1e12).toFixed(2)}T`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="24h Volume"
              value={marketData.volume24h}
              precision={0}
              prefix="$"
              formatter={value => `${(value / 1e9).toFixed(2)}B`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Bitcoin Dominance"
              value={marketData.btcDominance}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Top Gainers">
            <Table dataSource={topGainers} columns={columns} pagination={false} rowKey="id" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Losers">
            <Table dataSource={topLosers} columns={columns} pagination={false} rowKey="id" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
