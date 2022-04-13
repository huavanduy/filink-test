import "./App.css";
import { Col, Row, Card, Input, Slider, Button, Spin } from "antd";
import React from "react";
import { loadDataApi } from "./axios/fundedApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { ethers } from "ethers";

function App() {
  const { Meta } = Card;
  const PROVIDER =
    "https://rinkeby.infura.io/v3/e5b97339938341618b45e7e0d7e7d225";
  const [filter, setFilter] = React.useState({
    page: 1,
    pageSize: 5,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dataRender, setDataRender] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [avgOftime, setAvgOftime] = React.useState(0);
  const [avgOfEth, setAvgOfEth] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const getTransaction = async () => {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    const MIN_BLOCK_NUMBER = 10441830;
    const MAX_BLOCK_NUMBER = 10441840;
    const listTransactions = [];
    const timeStamp = [];
    for (
      var BLOCK_NUMBER = MIN_BLOCK_NUMBER;
      BLOCK_NUMBER <= MAX_BLOCK_NUMBER;
      BLOCK_NUMBER++
    ) {
      const result = await provider.getBlockWithTransactions(BLOCK_NUMBER);
      console.log(result);
      timeStamp.push(result.timestamp);
      result.transactions.map((item) => {
        listTransactions.push(item);
      });
    }
    let timeStampReverse = timeStamp.reverse();
    var total = 0;
    var temp = 0;
    var totalEth = 0;
    for (var i = 0; i < timeStampReverse.length - 1; i++) {
      var step = timeStampReverse[i] - timeStampReverse[i + 1];
      total += step;
      temp++;
      console.log(total);
    }
    for (var i = 0; i < listTransactions.length; i++) {
      totalEth += listTransactions[i].value.toString() / Math.pow(10, 18);
    }
    setAvgOfEth((totalEth / listTransactions.length).toFixed(2));
    setTransactions(transactions);
    setAvgOftime(total / temp);
    setLoading(false);
  };

  const loadData = async () => {
    const { data } = await loadDataApi(filter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
  };

  React.useEffect(() => {
    loadData();
    getTransaction();
  }, []);

  const renderTitleCart = (item) => {
    return (
      <>
        <div className="card-title">
          <p>{item.name}</p>
          <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
        </div>
        <div className="card-body">
          <div>$BCMC</div>
          <div className="price">
            <p>Total Raise</p>
            <p className="money">${item.totalRaise} Max</p>
          </div>
          <div className="price">
            <p>Personal Allocation</p>
            <p className="money">${item.personalAllocation}</p>
          </div>
        </div>
      </>
    );
  };

  const handleClear = async () => {
    const clearFilter = {
      page: 1,
      pageSize: 5,
    };
    const { data } = await loadDataApi(clearFilter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
    setFilter(clearFilter);
  };

  const handleFilter = async () => {
    const { data } = await loadDataApi(filter);
    if (data.statusCode === 1) {
      setDataRender(data.data.fundProjects);
    }
  };

  const loadMore = async () => {
    const page = currentPage;
    const oldData = dataRender;
    setCurrentPage(page + 1);
    const { data } = await loadDataApi({
      pageSize: 5,
      page: currentPage,
    });
    if (data.statusCode === 1) {
      setDataRender([...oldData, ...data.data.fundProjects]);
    }
  };

  const renderFilter = () => {
    return (
      <>
        <div className="filter">
          <div className="filter-1">
            <p>Name: </p>
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  name: e.target.value,
                });
              }}
            />
            <p>Symbol: </p>
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  symbol: e.target.value,
                });
              }}
            />
            <p>Status: </p>
            <Input
              onChange={(e) => {
                setFilter({
                  ...filter,
                  status: e.target.value,
                });
              }}
            />
          </div>
          <div className="filter-2">
            <div className="range">
              <p>Total Raise:</p>
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[20, 50]}
                value={filter.totalRaise}
                onAfterChange={(e) => {
                  setFilter({
                    ...filter,
                    totalRaise: e,
                  });
                }}
              />
              <Button
                onClick={() => {
                  handleClear();
                }}
                type="danger"
              >
                Clear
              </Button>
            </div>
            <div className="range">
              <p>Personal Allocation:</p>
              <Slider
                range={{ draggableTrack: true }}
                value={filter.personalAllocation}
                defaultValue={[20, 50]}
                onAfterChange={(e) => {
                  setFilter({
                    ...filter,
                    personalAllocation: e,
                  });
                }}
              />
              <Button onClick={() => handleFilter()} type="primary">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTotal = () => {
    return (
      <>
        <div className="total">
          <Spin spinning={loading} size="large">
            <Row gutter={[16, 16]}>
              <Col xl={8} md={12} xs={24}>
                <div className="content-total">
                  <div className="content">
                    <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                    <p style={{ color: "#F0D042" }}>Total transactions:</p>
                  </div>
                  <div className="value">{transactions.length}</div>
                </div>
              </Col>
              <Col xl={8} md={12} xs={24}>
                <div className="content-total">
                  <div className="content">
                    <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                    <p style={{ color: "#31B4D9" }}>AVG of block time:</p>
                  </div>
                  <div className="value">{avgOftime}</div>
                </div>
              </Col>
              <Col xl={8} md={12} xs={24}>
                <div className="content-total">
                  <div className="content">
                    <img src="https://i.ibb.co/0MN8m0v/Coin.png" />
                    <p style={{ color: "#1F8B24" }}>AVG of ETH/transactions</p>
                  </div>
                  <div className="value">{avgOfEth} ETH</div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <div className="layout-container">
        <div className="main-title">
          <div className="title">2nd largest of Transactions:</div>
          <div className="sub-title">1.10 ETH</div>
        </div>
        {renderTotal()}
        {renderFilter()}
        <InfiniteScroll
          dataLength={dataRender.length}
          next={loadMore}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <Row gutter={[32, 32]}>
            {dataRender != []
              ? dataRender.map((item, index) => {
                  return (
                    <Col xl={6} md={12} xs={24} key={index}>
                      <Card
                        hoverable
                        cover={<img alt="example" src={item.coverPhoto} />}
                      >
                        <Meta
                          title={renderTitleCart(item)}
                          description="IDO starts on October 14th 2021"
                        />
                      </Card>
                    </Col>
                  );
                })
              : ""}
          </Row>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
